package main

import (
	"fmt"
	"math"
	"strings"
	"time"

	// Import with alias
	rand "math/rand"

	// Import with dot notation (use functions without package name)
	. "fmt"

	// Blank import (for side effects only)
	_ "os"
)

// Packages and Imports in Go
func main() {
	fmt.Println("=== Packages and Imports ===")

	// 1. Standard library packages
	standardLibraryDemo()

	// 2. Package visibility
	visibilityDemo()

	// 3. Import aliases and special imports
	importAliasesDemo()

	// 4. Package initialization
	packageInitDemo()
}

func standardLibraryDemo() {
	fmt.Println("\n--- Standard Library Packages ---")

	// fmt package - formatting and printing
	fmt.Printf("Hello, %s!\n", "World")

	// strings package - string manipulation
	text := "  Hello, Go!  "
	trimmed := strings.TrimSpace(text)
	upper := strings.ToUpper(trimmed)
	fmt.Printf("Original: '%s', Trimmed: '%s', Upper: '%s'\n", text, trimmed, upper)

	// math package - mathematical functions
	fmt.Printf("Square root of 16: %.2f\n", math.Sqrt(16))
	fmt.Printf("Pi: %.5f\n", math.Pi)

	// time package - time and date operations
	now := time.Now()
	fmt.Printf("Current time: %s\n", now.Format("2006-01-02 15:04:05"))

	// rand package - random number generation
	rand.Seed(time.Now().UnixNano())
	randomNum := rand.Intn(100)
	fmt.Printf("Random number (0-99): %d\n", randomNum)
}

func visibilityDemo() {
	fmt.Println("\n--- Package Visibility ---")

	// In Go, visibility is determined by the first letter of the identifier
	// - Uppercase: exported (public) - accessible from other packages
	// - Lowercase: unexported (private) - only accessible within the same package

	// Example of exported function (starts with uppercase)
	result := ExportedFunction(5)
	fmt.Printf("Exported function result: %d\n", result)

	// Example of unexported function (starts with lowercase)
	result = unexportedFunction(5)
	fmt.Printf("Unexported function result: %d\n", result)
}

// Exported function (can be used by other packages)
func ExportedFunction(x int) int {
	return x * 2
}

// Unexported function (only accessible within this package)
func unexportedFunction(x int) int {
	return x + 1
}

func importAliasesDemo() {
	fmt.Println("\n--- Import Aliases ---")

	// Using alias for math/rand
	randomValue := rand.Float64()
	fmt.Printf("Random float (using alias): %.4f\n", randomValue)

	// Using dot import (no package name needed)
	Println("This uses dot import - no 'fmt.' prefix needed!")

	// Blank import example (imported for side effects)
	// The 'os' package is imported but not used directly
	// This is useful for packages that have init() functions
}

func packageInitDemo() {
	fmt.Println("\n--- Package Initialization ---")

	// Go packages can have init() functions that run automatically
	// when the package is imported. These are useful for:
	// - Setting up package-level variables
	// - Registering with other packages
	// - One-time setup tasks

	fmt.Println("Package initialization completed!")
}

// init() function - runs automatically when package is loaded
func init() {
	fmt.Println("Package 'main' is being initialized...")
}

// Multiple init() functions are allowed and run in order
func init() {
	fmt.Println("Second init() function running...")
}

// Package-level variables (initialized before init() functions)
var packageVar = "Package variable initialized"

// Package-level constants
const (
	PackageConstant1 = "constant1"
	PackageConstant2 = "constant2"
)

// Package-level function
func PackageFunction() {
	fmt.Println("This is a package-level function")
}


