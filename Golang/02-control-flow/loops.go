package main

import "fmt"

// Loops in Go
func main() {
	fmt.Println("=== Loops in Go ===")

	// 1. Basic for loop
	basicForLoop()

	// 2. for loop with initialization and increment
	forWithInitAndIncrement()

	// 3. while-style loop
	whileStyleLoop()

	// 4. Infinite loop
	infiniteLoopDemo()

	// 5. Range loop
	rangeLoopDemo()

	// 6. Loop control statements
	loopControlDemo()

	// 7. Nested loops
	nestedLoopsDemo()
}

func basicForLoop() {
	fmt.Println("\n--- Basic For Loop ---")

	// Traditional for loop
	for i := 0; i < 5; i++ {
		fmt.Printf("Iteration %d\n", i)
	}

	// Loop with different increment
	for i := 0; i < 10; i += 2 {
		fmt.Printf("Even numbers: %d\n", i)
	}

	// Countdown loop
	for i := 5; i > 0; i-- {
		fmt.Printf("Countdown: %d\n", i)
	}
}

func forWithInitAndIncrement() {
	fmt.Println("\n--- For Loop with Init and Increment ---")

	// Multiple variables in initialization
	for i, j := 0, 10; i < j; i, j = i+1, j-1 {
		fmt.Printf("i=%d, j=%d\n", i, j)
	}

	// Complex increment
	for i := 0; i < 20; i += 3 {
		fmt.Printf("Multiples of 3: %d\n", i)
	}
}

func whileStyleLoop() {
	fmt.Println("\n--- While-Style Loop ---")

	// Go doesn't have a while keyword, but you can use for
	counter := 0
	for counter < 5 {
		fmt.Printf("Counter: %d\n", counter)
		counter++
	}

	// Another while-style example
	number := 1
	for number < 100 {
		fmt.Printf("Number: %d\n", number)
		number *= 2
	}
}

func infiniteLoopDemo() {
	fmt.Println("\n--- Infinite Loop (with break) ---")

	// Infinite loop with break condition
	counter := 0
	for {
		counter++
		if counter > 3 {
			break
		}
		fmt.Printf("Infinite loop iteration: %d\n", counter)
	}

	// Infinite loop with continue
	fmt.Println("Skipping even numbers:")
	for i := 1; ; i++ {
		if i > 10 {
			break
		}
		if i%2 == 0 {
			continue
		}
		fmt.Printf("Odd number: %d\n", i)
	}
}

func rangeLoopDemo() {
	fmt.Println("\n--- Range Loop ---")

	// Range over slice
	numbers := []int{10, 20, 30, 40, 50}
	fmt.Println("Range over slice:")
	for index, value := range numbers {
		fmt.Printf("Index: %d, Value: %d\n", index, value)
	}

	// Range over slice (index only)
	fmt.Println("Range over slice (index only):")
	for index := range numbers {
		fmt.Printf("Index: %d\n", index)
	}

	// Range over slice (value only)
	fmt.Println("Range over slice (value only):")
	for _, value := range numbers {
		fmt.Printf("Value: %d\n", value)
	}

	// Range over string
	text := "Hello"
	fmt.Println("Range over string:")
	for index, char := range text {
		fmt.Printf("Index: %d, Character: %c (Unicode: %d)\n", index, char, char)
	}

	// Range over map
	colors := map[string]string{
		"red":   "#FF0000",
		"green": "#00FF00",
		"blue":  "#0000FF",
	}
	fmt.Println("Range over map:")
	for key, value := range colors {
		fmt.Printf("Color: %s, Hex: %s\n", key, value)
	}

	// Range over map (key only)
	fmt.Println("Range over map (key only):")
	for key := range colors {
		fmt.Printf("Color: %s\n", key)
	}
}

func loopControlDemo() {
	fmt.Println("\n--- Loop Control Statements ---")

	// Break statement
	fmt.Println("Break example:")
	for i := 1; i <= 10; i++ {
		if i == 5 {
			fmt.Println("Breaking at 5")
			break
		}
		fmt.Printf("i: %d\n", i)
	}

	// Continue statement
	fmt.Println("Continue example:")
	for i := 1; i <= 5; i++ {
		if i == 3 {
			fmt.Println("Skipping 3")
			continue
		}
		fmt.Printf("i: %d\n", i)
	}

	// Labeled break
	fmt.Println("Labeled break example:")
OuterLoop:
	for i := 1; i <= 3; i++ {
		for j := 1; j <= 3; j++ {
			if i == 2 && j == 2 {
				fmt.Println("Breaking outer loop")
				break OuterLoop
			}
			fmt.Printf("i: %d, j: %d\n", i, j)
		}
	}

	// Labeled continue
	fmt.Println("Labeled continue example:")
OuterLoop2:
	for i := 1; i <= 3; i++ {
		for j := 1; j <= 3; j++ {
			if i == 2 && j == 2 {
				fmt.Println("Continuing outer loop")
				continue OuterLoop2
			}
			fmt.Printf("i: %d, j: %d\n", i, j)
		}
	}
}

func nestedLoopsDemo() {
	fmt.Println("\n--- Nested Loops ---")

	// Multiplication table
	fmt.Println("Multiplication table (3x3):")
	for i := 1; i <= 3; i++ {
		for j := 1; j <= 3; j++ {
			fmt.Printf("%d x %d = %d\t", i, j, i*j)
		}
		fmt.Println()
	}

	// Pattern printing
	fmt.Println("Pattern printing:")
	for i := 1; i <= 5; i++ {
		for j := 1; j <= i; j++ {
			fmt.Print("*")
		}
		fmt.Println()
	}

	// 2D slice iteration
	matrix := [][]int{
		{1, 2, 3},
		{4, 5, 6},
		{7, 8, 9},
	}
	fmt.Println("2D slice iteration:")
	for i, row := range matrix {
		for j, value := range row {
			fmt.Printf("matrix[%d][%d] = %d\n", i, j, value)
		}
	}
}


