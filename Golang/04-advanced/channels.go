package main

import (
	"fmt"
	"time"
)

/*
===========================================
INTERVIEW QUESTIONS & ANSWERS - Channels
===========================================

Q1: What are channels in Go and why are they important?
A: Channels are typed conduits that allow you to send and receive values between goroutines.
   They enable safe communication and synchronization between concurrent goroutines without
   explicit locks or condition variables. Channels follow the principle: "Don't communicate
   by sharing memory; share memory by communicating."

Q2: What's the difference between buffered and unbuffered channels?
A: - Unbuffered channels (make(chan T)): Block until both sender and receiver are ready.
     Send operation blocks until another goroutine receives.
   - Buffered channels (make(chan T, capacity)): Have a capacity and only block when full
     (on send) or empty (on receive). Allow asynchronous communication up to buffer size.

Q3: How do you close a channel and why is it important?
A: Use the built-in close(ch) function. It's important because:
   - It signals to receivers that no more values will be sent
   - Receivers can check if a channel is closed: value, ok := <-ch
   - Range loops over channels terminate when the channel is closed
   - Only the sender should close channels, never the receiver
   - Sending to a closed channel causes a panic

Q4: What is the select statement and when would you use it?
A: Select lets you wait on multiple channel operations simultaneously. It blocks until one
   of its cases can proceed, then executes that case. Use cases:
   - Multiplexing multiple channels
   - Implementing timeouts (with time.After)
   - Non-blocking operations (with default case)
   - Graceful shutdown patterns

Q5: Explain channel directions (send-only, receive-only) and their benefits?
A: Channel direction syntax:
   - chan<- T: Send-only channel (can only send values)
   - <-chan T: Receive-only channel (can only receive values)
   - chan T: Bidirectional channel
   Benefits: Type safety, clear intent, prevents misuse (e.g., closing receive-only channels)

Q6: What are common channel patterns in Go?
A: - Fan-out: Multiple goroutines reading from the same channel
   - Fan-in: Multiplexing multiple input channels into one
   - Pipeline: Chain of stages connected by channels
   - Worker pool: Fixed number of workers processing from a job channel
   - Publish-Subscribe: Broadcasting to multiple subscribers

Q7: What causes a goroutine leak with channels?
A: Goroutines leak when they block forever on channel operations:
   - Sending to a channel that's never read from
   - Receiving from a channel that's never written to or closed
   - Forgetting to close channels that are being ranged over
   Prevention: Use buffered channels, context cancellation, proper cleanup

Q8: How do you implement a timeout for a channel operation?
A: Use select with time.After:
   select {
   case result := <-ch:
       // Process result
   case <-time.After(5 * time.Second):
       // Handle timeout
   }

Q9: What happens when you range over a channel?
A: The range loop receives values from the channel until it's closed. If the channel is
   never closed, the loop will block forever waiting for new values. Always close channels
   when done sending to prevent goroutine leaks.

Q10: Can you send and receive on a nil channel?
A: Operations on nil channels always block. This is useful in select statements where you
   can set a channel to nil to disable a case dynamically.
*/

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

// basicChannelDemo demonstrates fundamental channel operations
// Shows creating channels, sending/receiving values, checking closed status, and ranging
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

// bufferedChannelDemo demonstrates the difference between unbuffered and buffered channels
// Unbuffered channels block until both sender and receiver are ready
// Buffered channels allow asynchronous sends up to the buffer capacity
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

// channelDirectionsDemo demonstrates send-only and receive-only channel types
// Channel directions provide type safety and document intent in function signatures
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

// sendData demonstrates a function that accepts a send-only channel
// The compiler ensures this function can only send, not receive
func sendData(ch chan<- int) {
	ch <- 42
	fmt.Println("Sent data")
}

// receiveData demonstrates a function that accepts a receive-only channel
// The compiler ensures this function can only receive, not send
func receiveData(ch <-chan int) {
	value := <-ch
	fmt.Printf("Received: %d\n", value)
}

// processData demonstrates a function that accepts a bidirectional channel
// It can both send and receive on the channel
func processData(ch chan int) {
	ch <- 100
	value := <-ch
	fmt.Printf("Processed: %d\n", value)
}

// selectStatementDemo demonstrates using select to handle multiple channel operations
// Select blocks until one of its cases can proceed, enabling timeouts and non-blocking ops
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

// channelPatternsDemo showcases common concurrency patterns using channels
// These patterns solve real-world problems in concurrent programming
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

// fanOutDemo demonstrates the Fan-out pattern
// Fan-out: Distributing work from a single source channel to multiple worker goroutines
// This pattern is useful when you have a single source of work items that can be
// processed independently and in parallel by multiple workers.
// Use case: Image processing, data transformation, parallel computations
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

// fanInDemo demonstrates the Fan-in pattern
// Fan-in: Multiplexing multiple input channels into a single output channel
// Multiple producers send data to their own channels, and a single consumer
// reads from all of them through one combined channel.
// Use case: Aggregating results from multiple workers, merging log streams
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

// fanIn is a helper function that merges two channels into one
// It uses select to read from both input channels and forwards values to the output channel
// When a channel closes, it sets it to nil to disable that select case
// When both channels are closed (nil), it closes the output channel and exits
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

// pipelineDemo demonstrates the Pipeline pattern
// Pipeline: A series of stages connected by channels, where each stage is a group
// of goroutines running the same function. Data flows through the pipeline from
// one stage to the next, being transformed at each step.
// Use case: Data processing streams, ETL operations, image filters chain
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

// generate is the first stage of the pipeline
// It takes a variadic list of integers and sends them to an output channel
// This represents a data source stage in the pipeline
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

// square is the second stage of the pipeline
// It receives integers from an input channel, squares them, and sends results to output channel
// This represents a data transformation stage in the pipeline
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

// workerPoolDemo demonstrates the Worker Pool pattern
// Worker Pool: A fixed number of worker goroutines process jobs from a shared queue
// This pattern limits concurrency while efficiently processing a large number of tasks
// Use case: Rate-limited API calls, database operations, bounded parallel processing
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

// worker is a worker goroutine in the worker pool
// It receives jobs from the jobs channel, processes them, and sends results
// The worker continues until the jobs channel is closed
func worker(id int, jobs <-chan int, results chan<- int) {
	for job := range jobs {
		fmt.Printf("Worker %d processing job %d\n", id, job)
		time.Sleep(100 * time.Millisecond) // Simulate work
		results <- job * 2
	}
}

// channelBestPracticesDemo demonstrates recommended patterns for using channels safely
// Following these practices prevents deadlocks, goroutine leaks, and race conditions
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


