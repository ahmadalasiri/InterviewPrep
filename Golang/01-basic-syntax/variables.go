package main

import "fmt"

// Variables and Constants in Go
func main() {
	fmt.Println("=== Variables and Constants ===")

	// 1. Variable Declaration
	// Method 1: var keyword with type
	var name string
	name = "John Doe"
	fmt.Printf("Name: %s\n", name)

	// Method 2: var with initialization (type inference)
	var age = 25
	fmt.Printf("Age: %d\n", age)

	// Method 3: Short declaration (most common)
	email := "john@example.com"
	fmt.Printf("Email: %s\n", email)

	// 2. Multiple variable declaration
	var (
		city    = "New York"
		country = "USA"
		zipCode = 10001
	)
	fmt.Printf("Address: %s, %s %d\n", city, country, zipCode)

	// Short declaration for multiple variables
	firstName, lastName := "Jane", "Smith"
	fmt.Printf("Full name: %s %s\n", firstName, lastName)

	// 3. Constants
	const pi = 3.14159
	const (
		statusOK    = 200
		statusError = 500
	)
	fmt.Printf("Pi: %.2f\n", pi)
	fmt.Printf("Status codes: %d, %d\n", statusOK, statusError)

	// 4. Zero values
	var (
		defaultInt    int
		defaultFloat  float64
		defaultString string
		defaultBool   bool
	)
	fmt.Printf("Zero values - int: %d, float: %.2f, string: '%s', bool: %t\n",
		defaultInt, defaultFloat, defaultString, defaultBool)

	// 5. Variable scoping
	demonstrateScoping()
}

func demonstrateScoping() {
	// Local variable
	localVar := "I'm local to this function"
	fmt.Printf("Local variable: %s\n", localVar)

	// Block scoping
	{
		blockVar := "I'm in a block"
		fmt.Printf("Block variable: %s\n", blockVar)
	}
	// blockVar is not accessible here

	// Shadowing
	shadowed := "original"
	fmt.Printf("Before shadowing: %s\n", shadowed)
	{
		shadowed := "shadowed"
		fmt.Printf("Inside block: %s\n", shadowed)
	}
	fmt.Printf("After block: %s\n", shadowed)
}


