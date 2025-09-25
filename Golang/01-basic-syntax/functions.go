package main

import (
	"fmt"
	"math"
)

// Functions in Go
func main() {
	fmt.Println("=== Functions in Go ===")

	// 1. Basic function calls
	result := add(5, 3)
	fmt.Printf("5 + 3 = %d\n", result)

	// 2. Multiple return values
	sum, product := calculate(4, 6)
	fmt.Printf("Sum: %d, Product: %d\n", sum, product)

	// 3. Named return values
	quotient, remainder := divide(17, 5)
	fmt.Printf("17 ÷ 5 = %d remainder %d\n", quotient, remainder)

	// 4. Variadic functions
	total := sumNumbers(1, 2, 3, 4, 5)
	fmt.Printf("Sum of 1,2,3,4,5 = %d\n", total)

	// 5. Function as a value
	operation := multiply
	result = operation(3, 4)
	fmt.Printf("3 * 4 = %d\n", result)

	// 6. Anonymous functions
	anonymous := func(x, y int) int {
		return x * y
	}
	fmt.Printf("Anonymous function: 2 * 3 = %d\n", anonymous(2, 3))

	// 7. Closures
	counter := createCounter()
	fmt.Printf("Counter: %d\n", counter())
	fmt.Printf("Counter: %d\n", counter())
	fmt.Printf("Counter: %d\n", counter())

	// 8. Higher-order functions
	numbers := []int{1, 2, 3, 4, 5}
	squared := mapNumbers(numbers, square)
	fmt.Printf("Squared numbers: %v\n", squared)

	// 9. Recursive functions
	factorial := factorial(5)
	fmt.Printf("5! = %d\n", factorial)

	// 10. Method demonstration
	rect := Rectangle{width: 5, height: 3}
	area := rect.Area()
	perimeter := rect.Perimeter()
	fmt.Printf("Rectangle (5x3): Area=%d, Perimeter=%d\n", area, perimeter)
}

// Basic function with parameters and return value
func add(a, b int) int {
	return a + b
}

// Function with multiple return values
func calculate(a, b int) (int, int) {
	return a + b, a * b
}

// Function with named return values
func divide(a, b int) (quotient, remainder int) {
	quotient = a / b
	remainder = a % b
	return // naked return
}

// Variadic function (takes variable number of arguments)
func sumNumbers(numbers ...int) int {
	total := 0
	for _, num := range numbers {
		total += num
	}
	return total
}

// Function as a value
func multiply(a, b int) int {
	return a * b
}

// Closure - function that returns a function
func createCounter() func() int {
	count := 0
	return func() int {
		count++
		return count
	}
}

// Higher-order function - takes a function as parameter
func mapNumbers(numbers []int, fn func(int) int) []int {
	result := make([]int, len(numbers))
	for i, num := range numbers {
		result[i] = fn(num)
	}
	return result
}

func square(x int) int {
	return x * x
}

// Recursive function
func factorial(n int) int {
	if n <= 1 {
		return 1
	}
	return n * factorial(n-1)
}

// Custom type for method demonstration
type Rectangle struct {
	width, height int
}

// Method on Rectangle type
func (r Rectangle) Area() int {
	return r.width * r.height
}

func (r Rectangle) Perimeter() int {
	return 2 * (r.width + r.height)
}

// Method with pointer receiver (can modify the struct)
func (r *Rectangle) Scale(factor int) {
	r.width *= factor
	r.height *= factor
}

// Function with interface parameter
func printArea(shape AreaCalculator) {
	fmt.Printf("Area: %.2f\n", shape.Area())
}

// Interface definition
type AreaCalculator interface {
	Area() float64
}

// Circle implementing the interface
type Circle struct {
	radius float64
}

func (c Circle) Area() float64 {
	return math.Pi * c.radius * c.radius
}


