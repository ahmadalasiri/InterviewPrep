package main

import (
	"fmt"
	"time"
)

// Channels in Go
func main() {
	fmt.Println("=== Channels in Go ===")
	
	// 1. Basic channel operations
	basicChannelDemo()
	
	// 2. Buffered channels
	bufferedChannelDemo()
	
	// 3. Channel directions
	channelDirectionsDemo()
	
	// 4. Select statement
	selectStatementDemo()
	
	// 5. Channel patterns
	channelPatternsDemo()
	
	// 6. Channel best practices
	channelBestPracticesDemo()
}

func basicChannelDemo() {
	fmt.Println("\n--- Basic Channel Operations ---")
	
	// Create a channel
	ch := make(chan int)
	
	// Send data in a goroutine
	go func() {
		ch <- 42
		ch <- 100
		close(ch) // Close channel when done
	}()
	
	// Receive data
	value1 := <-ch
	value2 := <-ch
	fmt.Printf("Received: %d, %d\n", value1, value2)
	
	// Check if channel is closed
	value3, ok := <-ch
	if !ok {
		fmt.Println("Channel is closed")
	} else {
		fmt.Printf("Received: %d\n", value3)
	}
	
	// Range over channel
	ch2 := make(chan string, 3)
	ch2 <- "Hello"
	ch2 <- "World"
	ch2 <- "Go"
	close(ch2)
	
	fmt.Println("Range over channel:")
	for msg := range ch2 {
		fmt.Printf("  %s\n", msg)
	}
}

func bufferedChannelDemo() {
	fmt.Println("\n--- Buffered Channels ---")
	
	// Unbuffered channel (blocking)
	unbuffered := make(chan int)
	
	go func() {
		fmt.Println("Sending to unbuffered channel...")
		unbuffered <- 1
		fmt.Println("Sent to unbuffered channel")
	}()
	
	time.Sleep(100 * time.Millisecond)
	fmt.Println("Receiving from unbuffered channel...")
	<-unbuffered
	fmt.Println("Received from unbuffered channel")
	
	// Buffered channel (non-blocking up to buffer size)
	buffered := make(chan int, 3)
	
	fmt.Println("Sending to buffered channel...")
	buffered <- 1
	buffered <- 2
	buffered <- 3
	fmt.Println("Sent 3 values to buffered channel")
	
	// This would block if buffer is full
	// buffered <- 4 // Would block here
	
	fmt.Println("Receiving from buffered channel:")
	fmt.Printf("  %d\n", <-buffered)
	fmt.Printf("  %d\n", <-buffered)
	fmt.Printf("  %d\n", <-buffered)
}

func channelDirectionsDemo() {
	fmt.Println("\n--- Channel Directions ---")
	
	// Send-only channel
	sendCh := make(chan<- int)
	
	// Receive-only channel
	receiveCh := make(<-chan int)
	
	// Bidirectional channel
	bidirCh := make(chan int)
	
	// Function that takes send-only channel
	go sendData(sendCh)
	
	// Function that takes receive-only channel
	go receiveData(receiveCh)
	
	// Function that takes bidirectional channel
	go processData(bidirCh)
	
	time.Sleep(100 * time.Millisecond)
}

func sendData(ch chan<- int) {
	ch <- 42
	fmt.Println("Sent data")
}

func receiveData(ch <-chan int) {
	value := <-ch
	fmt.Printf("Received: %d\n", value)
}

func processData(ch chan int) {
	ch <- 100
	value := <-ch
	fmt.Printf("Processed: %d\n", value)
}

func selectStatementDemo() {
	fmt.Println("\n--- Select Statement ---")
	
	ch1 := make(chan string)
	ch2 := make(chan string)
	
	// Send data to channels
	go func() {
		time.Sleep(100 * time.Millisecond)
		ch1 <- "from ch1"
	}()
	
	go func() {
		time.Sleep(200 * time.Millisecond)
		ch2 <- "from ch2"
	}()
	
	// Select from multiple channels
	for i := 0; i < 2; i++ {
		select {
		case msg1 := <-ch1:
			fmt.Printf("Received: %s\n", msg1)
		case msg2 := <-ch2:
			fmt.Printf("Received: %s\n", msg2)
		case <-time.After(300 * time.Millisecond):
			fmt.Println("Timeout!")
		}
	}
	
	// Non-blocking select
	select {
	case msg := <-ch1:
		fmt.Printf("Non-blocking received: %s\n", msg)
	default:
		fmt.Println("No message available")
	}
	
	// Select with default case
	ch3 := make(chan int, 1)
	ch3 <- 1
	
	select {
	case ch3 <- 2:
		fmt.Println("Sent 2 to ch3")
	default:
		fmt.Println("ch3 is full")
	}
}

func channelPatternsDemo() {
	fmt.Println("\n--- Channel Patterns ---")
	
	// 1. Fan-out pattern
	fanOutDemo()
	
	// 2. Fan-in pattern
	fanInDemo()
	
	// 3. Pipeline pattern
	pipelineDemo()
	
	// 4. Worker pool pattern
	workerPoolDemo()
}

func fanOutDemo() {
	fmt.Println("Fan-out pattern:")
	
	input := make(chan int)
	
	// Start multiple workers
	for i := 0; i < 3; i++ {
		go func(id int) {
			for n := range input {
				fmt.Printf("Worker %d processed: %d\n", id, n)
			}
		}(i)
	}
	
	// Send data
	for i := 1; i <= 5; i++ {
		input <- i
	}
	close(input)
	
	time.Sleep(100 * time.Millisecond)
}

func fanInDemo() {
	fmt.Println("Fan-in pattern:")
	
	// Create multiple input channels
	ch1 := make(chan int)
	ch2 := make(chan int)
	
	// Send data to channels
	go func() {
		for i := 1; i <= 3; i++ {
			ch1 <- i
		}
		close(ch1)
	}()
	
	go func() {
		for i := 4; i <= 6; i++ {
			ch2 <- i
		}
		close(ch2)
	}()
	
	// Fan-in to single channel
	output := fanIn(ch1, ch2)
	
	for n := range output {
		fmt.Printf("Fan-in received: %d\n", n)
	}
}

func fanIn(ch1, ch2 <-chan int) <-chan int {
	out := make(chan int)
	
	go func() {
		defer close(out)
		for {
			select {
			case n, ok := <-ch1:
				if !ok {
					ch1 = nil
				} else {
					out <- n
				}
			case n, ok := <-ch2:
				if !ok {
					ch2 = nil
				} else {
					out <- n
				}
			}
			
			if ch1 == nil && ch2 == nil {
				break
			}
		}
	}()
	
	return out
}

func pipelineDemo() {
	fmt.Println("Pipeline pattern:")
	
	// Stage 1: Generate numbers
	numbers := generate(1, 2, 3, 4, 5)
	
	// Stage 2: Square numbers
	squared := square(numbers)
	
	// Stage 3: Print results
	for n := range squared {
		fmt.Printf("Pipeline result: %d\n", n)
	}
}

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

func workerPoolDemo() {
	fmt.Println("Worker pool pattern:")
	
	jobs := make(chan int, 10)
	results := make(chan int, 10)
	
	// Start 3 workers
	for i := 0; i < 3; i++ {
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
		time.Sleep(100 * time.Millisecond)
		results <- job * 2
	}
}

func channelBestPracticesDemo() {
	fmt.Println("\n--- Channel Best Practices ---")
	
	// 1. Always close channels when done
	ch := make(chan int)
	go func() {
		defer close(ch)
		ch <- 42
	}()
	
	// 2. Use range to receive until channel is closed
	for value := range ch {
		fmt.Printf("Received: %d\n", value)
	}
	
	// 3. Use select for non-blocking operations
	ch1 := make(chan int)
	ch2 := make(chan int)
	
	select {
	case <-ch1:
		fmt.Println("Received from ch1")
	case <-ch2:
		fmt.Println("Received from ch2")
	default:
		fmt.Println("No data available")
	}
	
	// 4. Use buffered channels to prevent goroutine leaks
	buffered := make(chan int, 1)
	buffered <- 1
	// This won't block even if no one is reading
	fmt.Println("Sent to buffered channel")
	
	// 5. Use context for cancellation
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	
	select {
	case <-time.After(2 * time.Second):
		fmt.Println("Operation completed")
	case <-ctx.Done():
		fmt.Println("Operation cancelled")
	}
}

// Context package import
import "context"


