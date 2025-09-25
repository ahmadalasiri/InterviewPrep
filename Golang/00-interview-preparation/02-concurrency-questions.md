# Concurrency Interview Questions

## Goroutines

### 1. What is a goroutine and how is it different from a thread?

**Answer:**
A goroutine is a lightweight thread managed by the Go runtime. Key differences from OS threads:

- **Size**: Goroutines start with ~2KB stack, threads start with ~2MB
- **Management**: Go runtime manages goroutines, OS manages threads
- **Scheduling**: M:N scheduling (M goroutines on N OS threads)
- **Creation cost**: Very cheap to create goroutines
- **Communication**: Goroutines communicate via channels

```go
// Create a goroutine
go func() {
    fmt.Println("Running in goroutine")
}()

// Goroutine with function
go sayHello("World")

func sayHello(name string) {
    fmt.Printf("Hello, %s!\n", name)
}
```

### 2. How do you synchronize goroutines?

**Answer:**
Several synchronization mechanisms:

**1. WaitGroup**

```go
var wg sync.WaitGroup

for i := 0; i < 5; i++ {
    wg.Add(1)
    go func(id int) {
        defer wg.Done()
        fmt.Printf("Goroutine %d\n", id)
    }(i)
}

wg.Wait() // Wait for all goroutines to complete
```

**2. Channels**

```go
done := make(chan bool)

go func() {
    // Do work
    done <- true
}()

<-done // Wait for completion
```

**3. Mutex**

```go
var mu sync.Mutex
var counter int

go func() {
    mu.Lock()
    counter++
    mu.Unlock()
}()
```

### 3. What is the difference between buffered and unbuffered channels?

**Answer:**

- **Unbuffered channel**: Synchronous, sender blocks until receiver is ready
- **Buffered channel**: Asynchronous, sender blocks only when buffer is full

```go
// Unbuffered channel
ch1 := make(chan int)
go func() {
    ch1 <- 1 // Blocks until someone receives
}()

// Buffered channel
ch2 := make(chan int, 2)
ch2 <- 1 // Doesn't block
ch2 <- 2 // Doesn't block
ch2 <- 3 // Blocks - buffer is full
```

### 4. How do you prevent goroutine leaks?

**Answer:**
Goroutine leaks occur when goroutines never terminate. Prevention strategies:

```go
// 1. Use context for cancellation
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

go func() {
    select {
    case <-time.After(10 * time.Second):
        fmt.Println("Work done")
    case <-ctx.Done():
        fmt.Println("Cancelled")
        return
    }
}()

// 2. Use done channels
done := make(chan bool)
go func() {
    defer close(done)
    // Do work
}()

// 3. Always close channels when done
go func() {
    defer close(ch)
    for i := 0; i < 10; i++ {
        ch <- i
    }
}()
```

## Channels

### 5. What are the different channel directions in Go?

**Answer:**

- **Bidirectional**: `chan int` - can send and receive
- **Send-only**: `chan<- int` - can only send
- **Receive-only**: `<-chan int` - can only receive

```go
// Send-only channel
func sendData(ch chan<- int) {
    ch <- 42
}

// Receive-only channel
func receiveData(ch <-chan int) {
    value := <-ch
    fmt.Println(value)
}

// Bidirectional channel
func processData(ch chan int) {
    ch <- 100
    value := <-ch
    fmt.Println(value)
}
```

### 6. How do you implement a worker pool pattern?

**Answer:**
Worker pool pattern distributes work across multiple goroutines:

```go
func workerPool() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)

    // Start 3 workers
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }

    // Send jobs
    for j := 1; j <= 9; j++ {
        jobs <- j
    }
    close(jobs)

    // Collect results
    for a := 1; a <= 9; a++ {
        <-results
    }
}

func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Printf("Worker %d processing job %d\n", id, j)
        time.Sleep(time.Second)
        results <- j * 2
    }
}
```

### 7. What is the select statement and how do you use it?

**Answer:**
The `select` statement allows a goroutine to wait on multiple channel operations:

```go
select {
case msg1 := <-ch1:
    fmt.Println("Received from ch1:", msg1)
case msg2 := <-ch2:
    fmt.Println("Received from ch2:", msg2)
case ch3 <- 42:
    fmt.Println("Sent to ch3")
case <-time.After(1 * time.Second):
    fmt.Println("Timeout")
default:
    fmt.Println("No channel ready")
}
```

**Common patterns:**

- **Timeout**: `case <-time.After(duration):`
- **Non-blocking**: `default:` case
- **Cancellation**: `case <-ctx.Done():`

## Synchronization

### 8. What is a race condition and how do you prevent it?

**Answer:**
A race condition occurs when multiple goroutines access shared data concurrently without proper synchronization.

```go
// Race condition example
var counter int

func increment() {
    counter++ // Not atomic - race condition!
}

// Prevention with mutex
var mu sync.Mutex
var counter int

func increment() {
    mu.Lock()
    counter++
    mu.Unlock()
}

// Prevention with atomic operations
var counter int64

func increment() {
    atomic.AddInt64(&counter, 1)
}
```

### 9. What is the difference between Mutex and RWMutex?

**Answer:**

- **Mutex**: Exclusive lock, only one goroutine can hold it
- **RWMutex**: Allows multiple readers OR one writer

```go
// Mutex - exclusive access
var mu sync.Mutex
var data int

func write() {
    mu.Lock()
    data = 42
    mu.Unlock()
}

func read() {
    mu.Lock()
    fmt.Println(data)
    mu.Unlock()
}

// RWMutex - multiple readers, single writer
var rwmu sync.RWMutex
var data int

func write() {
    rwmu.Lock()
    data = 42
    rwmu.Unlock()
}

func read() {
    rwmu.RLock()
    fmt.Println(data)
    rwmu.RUnlock()
}
```

### 10. What is sync.Once and when do you use it?

**Answer:**
`sync.Once` ensures a function is executed only once, even if called from multiple goroutines:

```go
var once sync.Once
var instance *Singleton

func GetInstance() *Singleton {
    once.Do(func() {
        instance = &Singleton{}
    })
    return instance
}

// Common use cases:
// - Singleton pattern
// - One-time initialization
// - Lazy loading
```

## Advanced Concurrency

### 11. How do you implement a fan-out/fan-in pattern?

**Answer:**
Fan-out: Distribute work across multiple goroutines
Fan-in: Collect results from multiple goroutines

```go
// Fan-out: Distribute work
func fanOut(input <-chan int, workers int) []<-chan int {
    outputs := make([]<-chan int, workers)

    for i := 0; i < workers; i++ {
        output := make(chan int)
        outputs[i] = output

        go func() {
            defer close(output)
            for n := range input {
                output <- n * 2
            }
        }()
    }

    return outputs
}

// Fan-in: Collect results
func fanIn(inputs ...<-chan int) <-chan int {
    output := make(chan int)

    var wg sync.WaitGroup
    wg.Add(len(inputs))

    for _, input := range inputs {
        go func(ch <-chan int) {
            defer wg.Done()
            for n := range ch {
                output <- n
            }
        }(input)
    }

    go func() {
        wg.Wait()
        close(output)
    }()

    return output
}
```

### 12. How do you implement a pipeline pattern?

**Answer:**
Pipeline pattern processes data through a series of stages:

```go
// Stage 1: Generate numbers
func generate(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for _, n := range nums {
            out <- n
        }
    }()
    return out
}

// Stage 2: Square numbers
func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for n := range in {
            out <- n * n
        }
    }()
    return out
}

// Stage 3: Print results
func print(in <-chan int) {
    for n := range in {
        fmt.Println(n)
    }
}

// Usage
numbers := generate(1, 2, 3, 4, 5)
squared := square(numbers)
print(squared)
```

### 13. What is the context package and how do you use it?

**Answer:**
The `context` package provides cancellation, timeout, and deadline functionality:

```go
// With timeout
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

go func() {
    select {
    case <-time.After(10 * time.Second):
        fmt.Println("Work completed")
    case <-ctx.Done():
        fmt.Println("Cancelled:", ctx.Err())
    }
}()

// With cancellation
ctx, cancel := context.WithCancel(context.Background())
defer cancel()

go func() {
    for {
        select {
        case <-ctx.Done():
            return
        default:
            // Do work
        }
    }
}()

// With deadline
deadline := time.Now().Add(2 * time.Second)
ctx, cancel := context.WithDeadline(context.Background(), deadline)
defer cancel()
```

## Common Concurrency Problems

### 14. How do you detect and fix deadlocks?

**Answer:**
Deadlock occurs when goroutines are waiting for each other indefinitely.

**Detection:**

```bash
go run -race your_program.go
```

**Common deadlock scenarios:**

```go
// 1. Unbuffered channel with no receiver
ch := make(chan int)
ch <- 1 // Deadlock - no receiver

// 2. Mutex not unlocked
var mu sync.Mutex
mu.Lock()
// Forgot to unlock - deadlock on next Lock()

// 3. Circular wait
// Goroutine A waits for B, B waits for A
```

**Prevention:**

- Always unlock mutexes
- Use buffered channels when appropriate
- Avoid circular dependencies
- Use timeouts and context cancellation

### 15. How do you implement a rate limiter?

**Answer:**
Rate limiter controls the rate of operations:

```go
type RateLimiter struct {
    tokens chan struct{}
    ticker *time.Ticker
}

func NewRateLimiter(rate int, per time.Duration) *RateLimiter {
    rl := &RateLimiter{
        tokens: make(chan struct{}, rate),
        ticker: time.NewTicker(per / time.Duration(rate)),
    }

    // Fill tokens
    for i := 0; i < rate; i++ {
        rl.tokens <- struct{}{}
    }

    // Refill tokens
    go func() {
        for range rl.ticker.C {
            select {
            case rl.tokens <- struct{}{}:
            default:
            }
        }
    }()

    return rl
}

func (rl *RateLimiter) Allow() bool {
    select {
    case <-rl.tokens:
        return true
    default:
        return false
    }
}
```

## Performance and Optimization

### 16. How do you profile concurrent Go programs?

**Answer:**
Use Go's built-in profiling tools:

```go
import _ "net/http/pprof"

func main() {
    go func() {
        log.Println(http.ListenAndServe("localhost:6060", nil))
    }()

    // Your program logic
}

// Run profiling
// go tool pprof http://localhost:6060/debug/pprof/profile
// go tool pprof http://localhost:6060/debug/pprof/heap
// go tool pprof http://localhost:6060/debug/pprof/goroutine
```

### 17. What are some common concurrency anti-patterns to avoid?

**Answer:**

- **Goroutine leaks**: Not properly cleaning up goroutines
- **Shared mutable state**: Accessing shared data without synchronization
- **Channel misuse**: Using channels for data that should be passed by value
- **Over-synchronization**: Using locks when atomic operations would suffice
- **Blocking operations**: Blocking in goroutines without timeouts
- **Resource exhaustion**: Creating too many goroutines or channels

## Practice Questions

### 18. What will this code output?

```go
func main() {
    ch := make(chan int)
    go func() {
        ch <- 1
        ch <- 2
        close(ch)
    }()

    for v := range ch {
        fmt.Println(v)
    }
}
```

### 19. How would you implement a semaphore in Go?

```go
type Semaphore struct {
    tokens chan struct{}
}

func NewSemaphore(capacity int) *Semaphore {
    return &Semaphore{
        tokens: make(chan struct{}, capacity),
    }
}

func (s *Semaphore) Acquire() {
    s.tokens <- struct{}{}
}

func (s *Semaphore) Release() {
    <-s.tokens
}
```

### 20. What's wrong with this code?

```go
func main() {
    var wg sync.WaitGroup
    for i := 0; i < 5; i++ {
        go func() {
            wg.Add(1)
            defer wg.Done()
            fmt.Println(i)
        }()
    }
    wg.Wait()
}
```

**Answer:** The goroutine captures the loop variable `i` by reference, so all goroutines will print the same value (5). Fix by passing `i` as a parameter or creating a local copy.

---

## Key Takeaways

1. **Goroutines are cheap** - Use them liberally but manage their lifecycle
2. **Channels are for communication** - Don't use them just to pass data
3. **Synchronize access to shared data** - Use mutexes, atomic operations, or channels
4. **Always handle timeouts and cancellation** - Use context package
5. **Profile your concurrent code** - Measure before optimizing
6. **Avoid common pitfalls** - Race conditions, deadlocks, goroutine leaks


