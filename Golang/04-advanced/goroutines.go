package main

import (
	"fmt"
	"runtime"
	"sync"
	"time"
)

/*
===========================================
INTERVIEW QUESTIONS & ANSWERS - Goroutines
===========================================

Q1: What is a goroutine and how does it differ from a thread?
A: A goroutine is a lightweight thread managed by the Go runtime. Differences:
   - Goroutines: Smaller stack size (starts at 2KB), grow/shrink dynamically
   - OS Threads: Fixed stack size (usually 1-2MB)
   - Goroutines are multiplexed onto OS threads by the Go scheduler
   - Can create millions of goroutines vs thousands of threads
   - Cheaper to create and destroy

Q2: How do you start a goroutine?
A: Use the 'go' keyword before a function call:
   go functionName(args)
   go func() { /* anonymous function */ }()
   The goroutine starts immediately and executes concurrently.

Q3: What is a WaitGroup and when would you use it?
A: sync.WaitGroup is used to wait for a collection of goroutines to finish.
   Methods:
   - Add(delta int): Increment counter
   - Done(): Decrement counter (typically defer wg.Done())
   - Wait(): Block until counter becomes zero
   Use when you need to wait for multiple goroutines to complete.

Q4: What is a race condition and how do you prevent it?
A: A race condition occurs when multiple goroutines access shared data concurrently and
   at least one modifies it, leading to unpredictable results.
   Prevention:
   - Use sync.Mutex for mutual exclusion
   - Use channels for communication
   - Use sync.RWMutex for read-heavy workloads
   - Run with -race flag to detect: go run -race program.go

Q5: What's the difference between sync.Mutex and sync.RWMutex?
A: - sync.Mutex: Exclusive lock, only one goroutine can hold it
   - sync.RWMutex: Reader-writer lock
     * RLock()/RUnlock(): Multiple readers can hold simultaneously
     * Lock()/Unlock(): Exclusive write lock
   Use RWMutex when reads vastly outnumber writes for better performance.

Q6: What is a goroutine leak and how do you prevent it?
A: A goroutine leak occurs when goroutines are created but never terminate, consuming
   memory and resources. Common causes:
   - Waiting on a channel that's never sent to/closed
   - Infinite loops without exit conditions
   - Forgetting to signal completion
   Prevention:
   - Use context for cancellation
   - Always ensure goroutines have exit paths
   - Use buffered channels appropriately
   - Monitor with runtime.NumGoroutine()

Q7: What is sync.Once and when would you use it?
A: sync.Once ensures a function is executed only once, even if called from multiple
   goroutines. Use cases:
   - Singleton initialization
   - One-time setup/configuration
   - Lazy initialization of expensive resources
   Example: var once sync.Once; once.Do(initFunction)

Q8: How does the Go scheduler work?
A: Go uses an M:N scheduler (M goroutines on N OS threads):
   - G (Goroutine): User-level lightweight thread
   - M (Machine): OS thread
   - P (Processor): Resource required to execute Go code
   The scheduler multiplexes goroutines onto OS threads, handling blocking, preemption,
   and work stealing for load balancing.

Q9: What happens when you don't wait for goroutines to finish?
A: If the main function exits, all goroutines are terminated immediately, regardless of
   whether they've completed. This can lead to:
   - Incomplete work
   - Resource leaks
   - Data corruption
   Always ensure proper synchronization (WaitGroup, channels, etc.)

Q10: How can you limit the number of concurrent goroutines?
A: Several approaches:
   - Worker pool pattern: Fixed number of workers processing from a job channel
   - Semaphore pattern: Buffered channel as a counting semaphore
   - Use third-party libraries like golang.org/x/sync/semaphore
   Example: semaphore := make(chan struct{}, maxGoroutines)
*/

// Goroutines in Go
func main() {
	fmt.Println("=== Goroutines in Go ===")
	
	// 1. Basic goroutine usage
	basicGoroutineDemo()
	
	// 2. Goroutines with WaitGroup
	goroutineWithWaitGroupDemo()
	
	// 3. Goroutines and race conditions
	raceConditionDemo()
	
	// 4. Goroutines with mutex
	goroutineWithMutexDemo()
	
	// 5. Goroutine pools
	goroutinePoolDemo()
	
	// 6. Goroutine best practices
	goroutineBestPracticesDemo()
}

// basicGoroutineDemo demonstrates starting and running goroutines
// Shows starting goroutines with named functions and anonymous functions
func basicGoroutineDemo() {
	fmt.Println("\n--- Basic Goroutine Usage ---")
	
	// Start a goroutine
	go sayHello("World")
	
	// Start multiple goroutines
	for i := 0; i < 5; i++ {
		go sayHello(fmt.Sprintf("Goroutine %d", i))
	}
	
	// Give goroutines time to execute
	time.Sleep(1 * time.Second)
	
	// Anonymous goroutine
	go func() {
		fmt.Println("Anonymous goroutine says hello!")
	}()
	
	time.Sleep(100 * time.Millisecond)
}

// sayHello is a simple function to be run as a goroutine
func sayHello(name string) {
	fmt.Printf("Hello from %s!\n", name)
}

// goroutineWithWaitGroupDemo demonstrates using sync.WaitGroup to wait for goroutines
// WaitGroup is the standard way to wait for multiple goroutines to complete
func goroutineWithWaitGroupDemo() {
	fmt.Println("\n--- Goroutines with WaitGroup ---")
	
	var wg sync.WaitGroup
	
	// Start multiple goroutines
	for i := 0; i < 5; i++ {
		wg.Add(1) // Increment counter
		go func(id int) {
			defer wg.Done() // Decrement counter when done
			work(id)
		}(i)
	}
	
	// Wait for all goroutines to complete
	wg.Wait()
	fmt.Println("All goroutines completed!")
}

// work simulates a worker that takes different amounts of time
func work(id int) {
	fmt.Printf("Worker %d starting\n", id)
	time.Sleep(time.Duration(id) * 100 * time.Millisecond)
	fmt.Printf("Worker %d finished\n", id)
}

// raceConditionDemo demonstrates a race condition (data race)
// Multiple goroutines accessing shared variable without synchronization
// Run with 'go run -race' to detect the race condition
func raceConditionDemo() {
	fmt.Println("\n--- Race Condition Demo ---")
	
	// This demonstrates a race condition
	// Run with: go run -race goroutines.go
	counter := 0
	var wg sync.WaitGroup
	
	// Start 1000 goroutines that increment counter
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			counter++ // Race condition here!
		}()
	}
	
	wg.Wait()
	fmt.Printf("Counter value: %d (should be 1000)\n", counter)
	fmt.Println("Note: Run with 'go run -race' to detect race conditions")
}

// goroutineWithMutexDemo demonstrates using mutex to prevent race conditions
// Shows both sync.Mutex and sync.RWMutex usage patterns
func goroutineWithMutexDemo() {
	fmt.Println("\n--- Goroutines with Mutex ---")
	
	// Fix race condition with mutex
	counter := 0
	var mu sync.Mutex
	var wg sync.WaitGroup
	
	// Start 1000 goroutines that increment counter safely
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			mu.Lock()
			counter++ // Safe increment
			mu.Unlock()
		}()
	}
	
	wg.Wait()
	fmt.Printf("Counter value: %d (correctly 1000)\n", counter)
	
	// Using RWMutex for read-heavy workloads
	sharedData := make(map[string]int)
	var rwmu sync.RWMutex
	var rwg sync.WaitGroup
	
	// Writers
	for i := 0; i < 5; i++ {
		rwg.Add(1)
		go func(id int) {
			defer rwg.Done()
			rwmu.Lock()
			sharedData[fmt.Sprintf("key%d", id)] = id
			rwmu.Unlock()
			fmt.Printf("Writer %d wrote data\n", id)
		}(i)
	}
	
	// Readers
	for i := 0; i < 10; i++ {
		rwg.Add(1)
		go func(id int) {
			defer rwg.Done()
			rwmu.RLock()
			value := sharedData[fmt.Sprintf("key%d", id%5)]
			rwmu.RUnlock()
			fmt.Printf("Reader %d read value: %d\n", id, value)
		}(i)
	}
	
	rwg.Wait()
}

// goroutinePoolDemo demonstrates the worker pool pattern
// Fixed number of workers process jobs from a queue, limiting concurrency
func goroutinePoolDemo() {
	fmt.Println("\n--- Goroutine Pool Demo ---")
	
	// Create a worker pool
	numWorkers := 3
	jobs := make(chan int, 10)
	results := make(chan int, 10)
	
	// Start workers
	for i := 0; i < numWorkers; i++ {
		go worker(i, jobs, results)
	}
	
	// Send jobs
	for i := 1; i <= 10; i++ {
		jobs <- i
	}
	close(jobs)
	
	// Collect results
	for i := 1; i <= 10; i++ {
		result := <-results
		fmt.Printf("Result: %d\n", result)
	}
}

// worker is a worker goroutine that processes jobs from the jobs channel
// It continues until the jobs channel is closed
func worker(id int, jobs <-chan int, results chan<- int) {
	for job := range jobs {
		fmt.Printf("Worker %d processing job %d\n", id, job)
		time.Sleep(100 * time.Millisecond) // Simulate work
		results <- job * 2
	}
}

// goroutineBestPracticesDemo demonstrates best practices for goroutine management
// Shows patterns for cleanup, cancellation, leak prevention, and one-time initialization
func goroutineBestPracticesDemo() {
	fmt.Println("\n--- Goroutine Best Practices ---")
	
	// 1. Always clean up goroutines
	done := make(chan bool)
	
	go func() {
		defer close(done)
		time.Sleep(500 * time.Millisecond)
		fmt.Println("Goroutine finished")
	}()
	
	// Wait for completion
	<-done
	
	// 2. Use context for cancellation
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	
	go func() {
		select {
		case <-time.After(2 * time.Second):
			fmt.Println("Long running task completed")
		case <-ctx.Done():
			fmt.Println("Task cancelled:", ctx.Err())
		}
	}()
	
	time.Sleep(1 * time.Second)
	
	// 3. Avoid goroutine leaks
	leakyGoroutineDemo()
	properGoroutineDemo()
	
	// 4. Use sync.Once for one-time initialization
	var once sync.Once
	var expensiveResource string
	
	for i := 0; i < 5; i++ {
		go func(id int) {
			once.Do(func() {
				expensiveResource = "Initialized once"
				fmt.Println("Expensive resource initialized")
			})
			fmt.Printf("Goroutine %d: %s\n", id, expensiveResource)
		}(i)
	}
	
	time.Sleep(100 * time.Millisecond)
}

// leakyGoroutineDemo shows a potential goroutine leak and how to prevent it
// Goroutines can leak if they block on channel operations that never complete
func leakyGoroutineDemo() {
	fmt.Println("Leaky goroutine example:")
	ch := make(chan int)
	
	go func() {
		ch <- 1
		// This goroutine will block forever if no one reads from ch
	}()
	
	// Read from channel to prevent leak
	<-ch
	fmt.Println("Prevented goroutine leak")
}

// properGoroutineDemo shows proper goroutine management with buffered channels
// Buffered channels prevent goroutines from blocking indefinitely
func properGoroutineDemo() {
	fmt.Println("Proper goroutine example:")
	ch := make(chan int, 1) // Buffered channel
	
	go func() {
		ch <- 1
		fmt.Println("Goroutine completed")
	}()
	
	time.Sleep(100 * time.Millisecond)
	<-ch
}

// Context package import (needed for context demo)
import "context"


