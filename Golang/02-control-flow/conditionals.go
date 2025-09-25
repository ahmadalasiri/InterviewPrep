package main

import "fmt"

// Conditional Statements in Go
func main() {
	fmt.Println("=== Conditional Statements ===")

	// 1. Basic if statement
	basicIfDemo()

	// 2. if-else statement
	ifElseDemo()

	// 3. if-else if-else chain
	ifElseIfDemo()

	// 4. if with initialization
	ifWithInitDemo()

	// 5. Logical operators
	logicalOperatorsDemo()

	// 6. Comparison operators
	comparisonOperatorsDemo()
}

func basicIfDemo() {
	fmt.Println("\n--- Basic If Statement ---")

	age := 18

	if age >= 18 {
		fmt.Println("You are an adult")
	}

	// Single line if (not recommended for readability)
	if age >= 18 {
		fmt.Println("Single line if")
	}
}

func ifElseDemo() {
	fmt.Println("\n--- If-Else Statement ---")

	temperature := 25

	if temperature > 30 {
		fmt.Println("It's hot outside")
	} else {
		fmt.Println("It's not too hot")
	}

	// Nested if-else
	score := 85

	if score >= 90 {
		fmt.Println("Grade: A")
	} else {
		if score >= 80 {
			fmt.Println("Grade: B")
		} else {
			fmt.Println("Grade: C or below")
		}
	}
}

func ifElseIfDemo() {
	fmt.Println("\n--- If-Else If-Else Chain ---")

	score := 75

	if score >= 90 {
		fmt.Println("Grade: A")
	} else if score >= 80 {
		fmt.Println("Grade: B")
	} else if score >= 70 {
		fmt.Println("Grade: C")
	} else if score >= 60 {
		fmt.Println("Grade: D")
	} else {
		fmt.Println("Grade: F")
	}

	// Multiple conditions
	age := 25
	hasLicense := true

	if age >= 18 && hasLicense {
		fmt.Println("You can drive")
	} else if age >= 16 && hasLicense {
		fmt.Println("You can drive with restrictions")
	} else if age >= 18 {
		fmt.Println("You need to get a license first")
	} else {
		fmt.Println("You're too young to drive")
	}
}

func ifWithInitDemo() {
	fmt.Println("\n--- If with Initialization ---")

	// Initialize variable in if statement
	if num := 42; num%2 == 0 {
		fmt.Printf("%d is even\n", num)
	}
	// num is not accessible here

	// Multiple initialization
	if x, y := 10, 20; x < y {
		fmt.Printf("%d is less than %d\n", x, y)
	}

	// Common pattern: error checking
	if err := someFunction(); err != nil {
		fmt.Printf("Error occurred: %v\n", err)
	} else {
		fmt.Println("Function executed successfully")
	}

	// File operations example
	if file, err := openFile("example.txt"); err != nil {
		fmt.Printf("Failed to open file: %v\n", err)
	} else {
		fmt.Printf("File opened successfully: %s\n", file)
		defer closeFile(file)
	}
}

func logicalOperatorsDemo() {
	fmt.Println("\n--- Logical Operators ---")

	a, b, c := true, false, true

	// AND operator (&&)
	fmt.Printf("true && false = %t\n", a && b)
	fmt.Printf("true && true = %t\n", a && c)

	// OR operator (||)
	fmt.Printf("true || false = %t\n", a || b)
	fmt.Printf("false || false = %t\n", b || b)

	// NOT operator (!)
	fmt.Printf("!true = %t\n", !a)
	fmt.Printf("!false = %t\n", !b)

	// Short-circuit evaluation
	fmt.Println("Short-circuit evaluation:")
	if shortCircuitDemo() && anotherFunction() {
		fmt.Println("Both functions returned true")
	}
}

func shortCircuitDemo() bool {
	fmt.Println("  shortCircuitDemo() called")
	return false
}

func anotherFunction() bool {
	fmt.Println("  anotherFunction() called")
	return true
}

func comparisonOperatorsDemo() {
	fmt.Println("\n--- Comparison Operators ---")

	a, b := 10, 20

	// Equality (==)
	fmt.Printf("%d == %d: %t\n", a, b, a == b)

	// Inequality (!=)
	fmt.Printf("%d != %d: %t\n", a, b, a != b)

	// Less than (<)
	fmt.Printf("%d < %d: %t\n", a, b, a < b)

	// Less than or equal (<=)
	fmt.Printf("%d <= %d: %t\n", a, b, a <= b)

	// Greater than (>)
	fmt.Printf("%d > %d: %t\n", a, b, a > b)

	// Greater than or equal (>=)
	fmt.Printf("%d >= %d: %t\n", a, b, a >= b)

	// String comparison
	str1, str2 := "apple", "banana"
	fmt.Printf("'%s' < '%s': %t\n", str1, str2, str1 < str2)

	// Case sensitivity in string comparison
	str3, str4 := "Hello", "hello"
	fmt.Printf("'%s' == '%s': %t\n", str3, str4, str3 == str4)
}

// Helper functions for demonstration
func someFunction() error {
	// Simulate a function that might return an error
	return nil // or errors.New("something went wrong")
}

func openFile(filename string) (string, error) {
	// Simulate file opening
	if filename == "example.txt" {
		return "file_handle", nil
	}
	return "", fmt.Errorf("file not found: %s", filename)
}

func closeFile(file string) {
	fmt.Printf("Closing file: %s\n", file)
}


