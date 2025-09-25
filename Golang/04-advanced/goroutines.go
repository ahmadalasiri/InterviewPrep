package main

import (
	"fmt"
	"runtime"
	"sync"
	"time"
)

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

func sayHello(name string) {
	fmt.Printf("Hello from %s!\n", name)
}

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

func work(id int) {
	fmt.Printf("Worker %d starting\n", id)
	time.Sleep(time.Duration(id) * 100 * time.Millisecond)
	fmt.Printf("Worker %d finished\n", id)
}

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

func worker(id int, jobs <-chan int, results chan<- int) {
	for job := range jobs {
		fmt.Printf("Worker %d processing job %d\n", id, job)
		time.Sleep(100 * time.Millisecond) // Simulate work
		results <- job * 2
	}
}

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


