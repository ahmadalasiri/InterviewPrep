package main

import (
	"fmt"
	"time"
)

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


