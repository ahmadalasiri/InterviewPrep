package main

import (
	"fmt"
	"runtime"
)

// Panic and Recover in Go
func main() {
	fmt.Println("=== Panic and Recover ===")
	
	// 1. Basic panic
	basicPanicDemo()
	
	// 2. Panic recovery
	panicRecoveryDemo()
	
	// 3. Panic in goroutines
	panicInGoroutineDemo()
	
	// 4. Panic best practices
	panicBestPracticesDemo()
	
	// 5. When to use panic vs error
	panicVsErrorDemo()
}

func basicPanicDemo() {
	fmt.Println("\n--- Basic Panic ---")
	
	// Panic with a message
	fmt.Println("About to panic...")
	// panic("Something went wrong!")
	
	// Panic with a value
	// panic(42)
	
	// Panic from runtime error
	// var slice []int
	// fmt.Println(slice[0]) // This would panic
	
	fmt.Println("Panic examples commented out to prevent program termination")
}

func panicRecoveryDemo() {
	fmt.Println("\n--- Panic Recovery ---")
	
	// Recover from panic
	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("Recovered from panic: %v\n", r)
		}
	}()
	
	// This will panic but be recovered
	panic("This panic will be recovered")
}

func panicInGoroutineDemo() {
	fmt.Println("\n--- Panic in Goroutines ---")
	
	// Panic in goroutine without recovery
	go func() {
		fmt.Println("Goroutine about to panic...")
		panic("Goroutine panic!")
	}()
	
	// Give goroutine time to panic
	runtime.Gosched()
	
	// Panic in goroutine with recovery
	go func() {
		defer func() {
			if r := recover(); r != nil {
				fmt.Printf("Recovered in goroutine: %v\n", r)
			}
		}()
		
		fmt.Println("Goroutine with recovery about to panic...")
		panic("Goroutine panic with recovery!")
	}()
	
	// Give goroutines time to execute
	runtime.Gosched()
	time.Sleep(100 * time.Millisecond)
}

func panicBestPracticesDemo() {
	fmt.Println("\n--- Panic Best Practices ---")
	
	// 1. Use panic for programming errors
	// 2. Use error for expected failures
	// 3. Always recover from panics in main functions
	// 4. Use defer for cleanup
	
	// Example of proper panic usage
	result := safeDivide(10, 2)
	fmt.Printf("Safe divide result: %d\n", result)
	
	result = safeDivide(10, 0)
	fmt.Printf("Safe divide result: %d\n", result)
	
	// Example of panic for programming errors
	processValidInput("valid input")
	
	// Example of panic recovery in main
	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("Main function recovered from panic: %v\n", r)
		}
	}()
	
	// This would panic but be recovered
	// processInvalidInput("")
}

func safeDivide(a, b int) int {
	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("Recovered from division panic: %v\n", r)
		}
	}()
	
	if b == 0 {
		panic("division by zero")
	}
	
	return a / b
}

func processValidInput(input string) {
	if input == "" {
		panic("programming error: empty input not allowed")
	}
	
	fmt.Printf("Processing input: %s\n", input)
}

func processInvalidInput(input string) {
	if input == "" {
		panic("programming error: empty input not allowed")
	}
	
	fmt.Printf("Processing input: %s\n", input)
}

func panicVsErrorDemo() {
	fmt.Println("\n--- Panic vs Error ---")
	
	// Use error for expected failures
	result, err := divideWithError(10, 0)
	if err != nil {
		fmt.Printf("Error handling: %v\n", err)
	} else {
		fmt.Printf("Result: %d\n", result)
	}
	
	// Use panic for programming errors
	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("Panic handling: %v\n", r)
		}
	}()
	
	result = divideWithPanic(10, 0)
	fmt.Printf("Result: %d\n", result)
}

func divideWithError(a, b int) (int, error) {
	if b == 0 {
		return 0, fmt.Errorf("division by zero")
	}
	return a / b, nil
}

func divideWithPanic(a, b int) int {
	if b == 0 {
		panic("programming error: division by zero")
	}
	return a / b
}

// Import time package
import "time"


