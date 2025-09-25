package main

import (
	"fmt"
	"testing"
)

// Testing in Go
func main() {
	fmt.Println("=== Testing in Go ===")
	fmt.Println("Run tests with: go test")
	fmt.Println("Run tests with verbose output: go test -v")
	fmt.Println("Run specific test: go test -run TestFunctionName")
	fmt.Println("Run tests with coverage: go test -cover")
}

// Function to test
func Add(a, b int) int {
	return a + b
}

func Multiply(a, b int) int {
	return a * b
}

func Divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, fmt.Errorf("division by zero")
	}
	return a / b, nil
}

func IsEven(n int) bool {
	return n%2 == 0
}

func Factorial(n int) int {
	if n <= 1 {
		return 1
	}
	return n * Factorial(n-1)
}

// Test functions
func TestAdd(t *testing.T) {
	tests := []struct {
		name     string
		a        int
		b        int
		expected int
	}{
		{"positive numbers", 2, 3, 5},
		{"negative numbers", -2, -3, -5},
		{"mixed numbers", -2, 3, 1},
		{"zero", 0, 5, 5},
		{"both zero", 0, 0, 0},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := Add(tt.a, tt.b)
			if result != tt.expected {
				t.Errorf("Add(%d, %d) = %d; expected %d", tt.a, tt.b, result, tt.expected)
			}
		})
	}
}

func TestMultiply(t *testing.T) {
	result := Multiply(3, 4)
	expected := 12

	if result != expected {
		t.Errorf("Multiply(3, 4) = %d; expected %d", result, expected)
	}
}

func TestDivide(t *testing.T) {
	tests := []struct {
		name        string
		a           float64
		b           float64
		expected    float64
		expectError bool
	}{
		{"normal division", 10, 2, 5, false},
		{"division by zero", 10, 0, 0, true},
		{"decimal result", 7, 2, 3.5, false},
		{"negative numbers", -10, 2, -5, false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := Divide(tt.a, tt.b)

			if tt.expectError {
				if err == nil {
					t.Errorf("Divide(%f, %f) expected error but got none", tt.a, tt.b)
				}
			} else {
				if err != nil {
					t.Errorf("Divide(%f, %f) unexpected error: %v", tt.a, tt.b, err)
				}
				if result != tt.expected {
					t.Errorf("Divide(%f, %f) = %f; expected %f", tt.a, tt.b, result, tt.expected)
				}
			}
		})
	}
}

func TestIsEven(t *testing.T) {
	tests := []struct {
		input    int
		expected bool
	}{
		{2, true},
		{3, false},
		{0, true},
		{-2, true},
		{-3, false},
	}

	for _, tt := range tests {
		t.Run(fmt.Sprintf("IsEven(%d)", tt.input), func(t *testing.T) {
			result := IsEven(tt.input)
			if result != tt.expected {
				t.Errorf("IsEven(%d) = %t; expected %t", tt.input, result, tt.expected)
			}
		})
	}
}

func TestFactorial(t *testing.T) {
	tests := []struct {
		input    int
		expected int
	}{
		{0, 1},
		{1, 1},
		{2, 2},
		{3, 6},
		{4, 24},
		{5, 120},
	}

	for _, tt := range tests {
		t.Run(fmt.Sprintf("Factorial(%d)", tt.input), func(t *testing.T) {
			result := Factorial(tt.input)
			if result != tt.expected {
				t.Errorf("Factorial(%d) = %d; expected %d", tt.input, result, tt.expected)
			}
		})
	}
}

// Benchmark tests
func BenchmarkAdd(b *testing.B) {
	for i := 0; i < b.N; i++ {
		Add(2, 3)
	}
}

func BenchmarkMultiply(b *testing.B) {
	for i := 0; i < b.N; i++ {
		Multiply(2, 3)
	}
}

func BenchmarkFactorial(b *testing.B) {
	for i := 0; i < b.N; i++ {
		Factorial(10)
	}
}

// Example tests
func ExampleAdd() {
	result := Add(2, 3)
	fmt.Println(result)
	// Output: 5
}

func ExampleMultiply() {
	result := Multiply(4, 5)
	fmt.Println(result)
	// Output: 20
}

// Test with setup and teardown
func TestWithSetup(t *testing.T) {
	// Setup
	data := []int{1, 2, 3, 4, 5}

	// Test
	t.Run("sum", func(t *testing.T) {
		sum := 0
		for _, v := range data {
			sum += v
		}
		if sum != 15 {
			t.Errorf("Sum = %d; expected 15", sum)
		}
	})

	t.Run("product", func(t *testing.T) {
		product := 1
		for _, v := range data {
			product *= v
		}
		if product != 120 {
			t.Errorf("Product = %d; expected 120", product)
		}
	})

	// Teardown (if needed)
	// cleanup code here
}

// Test with subtests
func TestSubtests(t *testing.T) {
	t.Run("addition", func(t *testing.T) {
		if Add(2, 3) != 5 {
			t.Error("Addition failed")
		}
	})

	t.Run("multiplication", func(t *testing.T) {
		if Multiply(2, 3) != 6 {
			t.Error("Multiplication failed")
		}
	})

	t.Run("division", func(t *testing.T) {
		result, err := Divide(10, 2)
		if err != nil {
			t.Error("Division should not error")
		}
		if result != 5 {
			t.Error("Division result incorrect")
		}
	})
}

// Test with parallel execution
func TestParallel(t *testing.T) {
	t.Parallel()

	t.Run("parallel test 1", func(t *testing.T) {
		t.Parallel()
		// This test can run in parallel
		result := Add(1, 2)
		if result != 3 {
			t.Error("Parallel test 1 failed")
		}
	})

	t.Run("parallel test 2", func(t *testing.T) {
		t.Parallel()
		// This test can run in parallel
		result := Multiply(2, 3)
		if result != 6 {
			t.Error("Parallel test 2 failed")
		}
	})
}

// Test with table-driven approach
func TestTableDriven(t *testing.T) {
	tests := []struct {
		name     string
		function func(int, int) int
		a        int
		b        int
		expected int
	}{
		{"add", Add, 2, 3, 5},
		{"multiply", Multiply, 2, 3, 6},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.function(tt.a, tt.b)
			if result != tt.expected {
				t.Errorf("%s(%d, %d) = %d; expected %d",
					tt.name, tt.a, tt.b, result, tt.expected)
			}
		})
	}
}


