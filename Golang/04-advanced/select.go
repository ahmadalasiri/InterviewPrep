package main

import (
	"fmt"
	"time"
)

/*
===========================================
INTERVIEW QUESTIONS & ANSWERS - Select Statement
===========================================

Q1: What is the select statement in Go?
A: Select lets a goroutine wait on multiple channel operations. It blocks until one of
   its cases can run, then executes that case. If multiple cases are ready, one is
   chosen at random. It's similar to a switch statement but for channel operations.

Q2: What's the difference between select and switch?
A: - Select: Works with channel operations only, blocks until a case is ready
   - Switch: General-purpose control flow, evaluates conditions sequentially
   Select is specifically designed for concurrent channel communication.

Q3: What does the default case do in a select statement?
A: The default case makes select non-blocking. If no other case is ready, the default
   case executes immediately. Use cases:
   - Non-blocking send: select { case ch <- value: ...; default: ... }
   - Non-blocking receive: select { case v := <-ch: ...; default: ... }
   - Polling channel state

Q4: How do you implement a timeout using select?
A: Use time.After() which returns a channel that sends after a duration:
   select {
   case result := <-ch:
       // Got result
   case <-time.After(5 * time.Second):
       // Timeout after 5 seconds
   }
   Or use context.WithTimeout for more control.

Q5: What happens when multiple cases in select are ready?
A: If multiple cases are ready, select chooses one at random (pseudo-randomly).
   This ensures fairness and prevents starvation. Each execution may choose a different
   ready case.

Q6: Can you use select without any cases?
A: Yes, but it blocks forever:
   select {}
   This is sometimes used to keep a program running (e.g., servers) but context-based
   waiting is preferred in modern Go.

Q7: How do you implement graceful shutdown with select?
A: Combine a quit/shutdown channel with work channels:
   select {
   case work := <-workCh:
       // Process work
   case <-quitCh:
       // Cleanup and return
   }
   When shutting down, close or send to quitCh to signal all workers.

Q8: What is the fan-in pattern and how does select help?
A: Fan-in merges multiple input channels into one output channel. Select helps by:
   select {
   case v1 := <-ch1: output <- v1
   case v2 := <-ch2: output <- v2
   case v3 := <-ch3: output <- v3
   }
   Efficiently multiplexes multiple sources without explicit locking.

Q9: How do you disable a case in select?
A: Set the channel to nil. Operations on nil channels block forever, effectively
   disabling that case:
   if closed {
       ch1 = nil  // This case will never be selected
   }
   select {
   case v := <-ch1: // Won't be selected if ch1 is nil
   case v := <-ch2:
   }

Q10: What is rate limiting with select?
A: Use a ticker to control operation frequency:
   ticker := time.NewTicker(100 * time.Millisecond)
   select {
   case <-ticker.C:
       // Proceed with rate-limited operation
   }
   This ensures operations don't exceed a specified rate, useful for API calls,
   request handling, etc.
*/

// Select Statement in Go
func main() {
	fmt.Println("=== Select Statement ===")

	// 1. Basic select statement
	basicSelectDemo()

	// 2. Select with timeout
	selectWithTimeoutDemo()

	// 3. Non-blocking select
	nonBlockingSelectDemo()

	// 4. Select with default case
	selectWithDefaultDemo()

	// 5. Select for channel multiplexing
	channelMultiplexingDemo()

	// 6. Select patterns
	selectPatternsDemo()
}

// basicSelectDemo demonstrates the fundamental select statement usage
// Select waits on multiple channel operations and executes the first one ready
func basicSelectDemo() {
	fmt.Println("\n--- Basic Select Statement ---")

	ch1 := make(chan string)
	ch2 := make(chan string)

	// Send data to channels
	go func() {
		time.Sleep(100 * time.Millisecond)
		ch1 <- "Hello from ch1"
	}()

	go func() {
		time.Sleep(200 * time.Millisecond)
		ch2 <- "Hello from ch2"
	}()

	// Select from multiple channels
	for i := 0; i < 2; i++ {
		select {
		case msg1 := <-ch1:
			fmt.Printf("Received from ch1: %s\n", msg1)
		case msg2 := <-ch2:
			fmt.Printf("Received from ch2: %s\n", msg2)
		}
	}
}

// selectWithTimeoutDemo demonstrates implementing timeouts using select and time.After
// Prevents operations from blocking indefinitely
func selectWithTimeoutDemo() {
	fmt.Println("\n--- Select with Timeout ---")

	ch := make(chan string)

	// Send data after delay
	go func() {
		time.Sleep(500 * time.Millisecond)
		ch <- "Data received"
	}()

	// Select with timeout
	select {
	case msg := <-ch:
		fmt.Printf("Received: %s\n", msg)
	case <-time.After(300 * time.Millisecond):
		fmt.Println("Timeout! No data received")
	}

	// Another example with longer timeout
	select {
	case msg := <-ch:
		fmt.Printf("Received: %s\n", msg)
	case <-time.After(1 * time.Second):
		fmt.Println("Timeout! No data received")
	}
}

// nonBlockingSelectDemo demonstrates non-blocking channel operations
// Using select without waiting allows immediate continuation if channels aren't ready
func nonBlockingSelectDemo() {
	fmt.Println("\n--- Non-blocking Select ---")

	ch := make(chan int)

	// Try to receive without blocking
	select {
	case value := <-ch:
		fmt.Printf("Received: %d\n", value)
	default:
		fmt.Println("No data available, continuing...")
	}

	// Try to send without blocking
	select {
	case ch <- 42:
		fmt.Println("Sent 42 to channel")
	default:
		fmt.Println("Channel is full, cannot send")
	}

	// Now try to receive again
	select {
	case value := <-ch:
		fmt.Printf("Received: %d\n", value)
	default:
		fmt.Println("No data available")
	}
}

// selectWithDefaultDemo demonstrates default case usage in select
// Default case executes immediately if no other case is ready, preventing blocking
func selectWithDefaultDemo() {
	fmt.Println("\n--- Select with Default Case ---")

	ch := make(chan int, 1)

	// Channel has capacity for 1 value
	select {
	case ch <- 1:
		fmt.Println("Sent 1 to channel")
	default:
		fmt.Println("Channel is full")
	}

	// Try to send another value
	select {
	case ch <- 2:
		fmt.Println("Sent 2 to channel")
	default:
		fmt.Println("Channel is full, cannot send 2")
	}

	// Receive the value
	select {
	case value := <-ch:
		fmt.Printf("Received: %d\n", value)
	default:
		fmt.Println("No data available")
	}
}

// channelMultiplexingDemo demonstrates multiplexing multiple channels
// Select efficiently handles multiple channel sources without explicit coordination
func channelMultiplexingDemo() {
	fmt.Println("\n--- Channel Multiplexing ---")

	// Create multiple channels
	ch1 := make(chan string)
	ch2 := make(chan string)
	ch3 := make(chan string)

	// Send data to different channels
	go func() {
		time.Sleep(100 * time.Millisecond)
		ch1 <- "Message from ch1"
	}()

	go func() {
		time.Sleep(150 * time.Millisecond)
		ch2 <- "Message from ch2"
	}()

	go func() {
		time.Sleep(200 * time.Millisecond)
		ch3 <- "Message from ch3"
	}()

	// Multiplex channels
	for i := 0; i < 3; i++ {
		select {
		case msg1 := <-ch1:
			fmt.Printf("Multiplexed from ch1: %s\n", msg1)
		case msg2 := <-ch2:
			fmt.Printf("Multiplexed from ch2: %s\n", msg2)
		case msg3 := <-ch3:
			fmt.Printf("Multiplexed from ch3: %s\n", msg3)
		}
	}
}

// selectPatternsDemo showcases common patterns using select statement
// Demonstrates real-world use cases for concurrent programming
func selectPatternsDemo() {
	fmt.Println("\n--- Select Patterns ---")

	// 1. Fan-in pattern with select
	fanInSelectDemo()

	// 2. Heartbeat pattern
	heartbeatDemo()

	// 3. Rate limiting pattern
	rateLimitingDemo()

	// 4. Graceful shutdown pattern
	gracefulShutdownDemo()
}

// fanInSelectDemo demonstrates the fan-in pattern using select
// Merges multiple input channels into one, handling channel closures gracefully
func fanInSelectDemo() {
	fmt.Println("Fan-in with select:")

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

	// Fan-in using select
	for {
		select {
		case n, ok := <-ch1:
			if !ok {
				ch1 = nil
			} else {
				fmt.Printf("Fan-in from ch1: %d\n", n)
			}
		case n, ok := <-ch2:
			if !ok {
				ch2 = nil
			} else {
				fmt.Printf("Fan-in from ch2: %d\n", n)
			}
		}

		if ch1 == nil && ch2 == nil {
			break
		}
	}
}

// heartbeatDemo demonstrates a heartbeat pattern for monitoring
// Provides regular status updates while processing work
func heartbeatDemo() {
	fmt.Println("Heartbeat pattern:")

	heartbeat := time.NewTicker(200 * time.Millisecond)
	defer heartbeat.Stop()

	work := make(chan int)

	// Send work
	go func() {
		for i := 1; i <= 5; i++ {
			work <- i
			time.Sleep(300 * time.Millisecond)
		}
		close(work)
	}()

	// Process work with heartbeat
	for {
		select {
		case job, ok := <-work:
			if !ok {
				fmt.Println("Work completed")
				return
			}
			fmt.Printf("Processing job: %d\n", job)
		case <-heartbeat.C:
			fmt.Println("Heartbeat: Still alive")
		}
	}
}

// rateLimitingDemo demonstrates rate limiting with select and ticker
// Controls the frequency of operations to prevent resource exhaustion
func rateLimitingDemo() {
	fmt.Println("Rate limiting pattern:")

	// Create a rate limiter
	rateLimiter := time.NewTicker(100 * time.Millisecond)
	defer rateLimiter.Stop()

	requests := make(chan string, 10)

	// Send requests
	go func() {
		for i := 1; i <= 10; i++ {
			requests <- fmt.Sprintf("Request %d", i)
		}
		close(requests)
	}()

	// Process requests with rate limiting
	for req := range requests {
		select {
		case <-rateLimiter.C:
			fmt.Printf("Processing: %s\n", req)
		}
	}
}

// gracefulShutdownDemo demonstrates graceful shutdown using select
// Allows workers to stop cleanly when a shutdown signal is received
func gracefulShutdownDemo() {
	fmt.Println("Graceful shutdown pattern:")

	shutdown := make(chan bool)
	work := make(chan int)

	// Start worker
	go func() {
		for {
			select {
			case job := <-work:
				fmt.Printf("Processing job: %d\n", job)
			case <-shutdown:
				fmt.Println("Worker shutting down gracefully")
				return
			}
		}
	}()

	// Send some work
	for i := 1; i <= 3; i++ {
		work <- i
		time.Sleep(100 * time.Millisecond)
	}

	// Shutdown
	close(shutdown)
	time.Sleep(100 * time.Millisecond)
}


