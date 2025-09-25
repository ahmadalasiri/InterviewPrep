package main

import (
	"errors"
	"fmt"
	"os"
	"strconv"
)

// Error Handling in Go
func main() {
	fmt.Println("=== Error Handling in Go ===")
	
	// 1. Basic error handling
	basicErrorDemo()
	
	// 2. Custom errors
	customErrorDemo()
	
	// 3. Error wrapping
	errorWrappingDemo()
	
	// 4. Error checking patterns
	errorCheckingPatternsDemo()
	
	// 5. Error handling best practices
	errorBestPracticesDemo()
}

func basicErrorDemo() {
	fmt.Println("\n--- Basic Error Handling ---")
	
	// Function that returns an error
	result, err := divide(10, 2)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("Result: %.2f\n", result)
	}
	
	// Function that returns an error
	result, err = divide(10, 0)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("Result: %.2f\n", result)
	}
	
	// Multiple return values with error
	values, err := parseNumbers("1,2,3,4,5")
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("Parsed numbers: %v\n", values)
	}
	
	// Error with invalid input
	values, err = parseNumbers("1,2,abc,4,5")
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("Parsed numbers: %v\n", values)
	}
}

func divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, errors.New("division by zero")
	}
	return a / b, nil
}

func parseNumbers(input string) ([]int, error) {
	if input == "" {
		return nil, errors.New("empty input")
	}
	
	var numbers []int
	parts := splitString(input, ",")
	
	for i, part := range parts {
		num, err := strconv.Atoi(part)
		if err != nil {
			return nil, fmt.Errorf("invalid number at position %d: %w", i, err)
		}
		numbers = append(numbers, num)
	}
	
	return numbers, nil
}

func splitString(s, sep string) []string {
	var result []string
	start := 0
	for i := 0; i < len(s); i++ {
		if i+len(sep) <= len(s) && s[i:i+len(sep)] == sep {
			result = append(result, s[start:i])
			start = i + len(sep)
		}
	}
	result = append(result, s[start:])
	return result
}

func customErrorDemo() {
	fmt.Println("\n--- Custom Errors ---")
	
	// Custom error type
	err := &ValidationError{
		Field:   "email",
		Message: "invalid email format",
	}
	fmt.Printf("Custom error: %v\n", err)
	
	// Check error type
	if validationErr, ok := err.(*ValidationError); ok {
		fmt.Printf("Validation error on field '%s': %s\n", validationErr.Field, validationErr.Message)
	}
	
	// Using custom error in function
	user := User{Name: "John", Email: "invalid-email"}
	if err := validateUser(user); err != nil {
		fmt.Printf("Validation failed: %v\n", err)
	}
	
	// Multiple validation errors
	user2 := User{Name: "", Email: "invalid"}
	if err := validateUser(user2); err != nil {
		fmt.Printf("Validation failed: %v\n", err)
	}
}

type ValidationError struct {
	Field   string
	Message string
}

func (e *ValidationError) Error() string {
	return fmt.Sprintf("validation error on field '%s': %s", e.Field, e.Message)
}

type User struct {
	Name  string
	Email string
}

func validateUser(user User) error {
	if user.Name == "" {
		return &ValidationError{
			Field:   "name",
			Message: "name is required",
		}
	}
	
	if user.Email == "" {
		return &ValidationError{
			Field:   "email",
			Message: "email is required",
		}
	}
	
	if len(user.Email) < 5 || !contains(user.Email, "@") {
		return &ValidationError{
			Field:   "email",
			Message: "invalid email format",
		}
	}
	
	return nil
}

func contains(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}

func errorWrappingDemo() {
	fmt.Println("\n--- Error Wrapping ---")
	
	// Error wrapping with fmt.Errorf
	err := processFile("nonexistent.txt")
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		
		// Unwrap error
		if unwrapped := errors.Unwrap(err); unwrapped != nil {
			fmt.Printf("Unwrapped error: %v\n", unwrapped)
		}
	}
	
	// Error wrapping with custom wrapper
	err = processData("invalid data")
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		
		// Check if it's a specific error type
		var dataErr *DataProcessingError
		if errors.As(err, &dataErr) {
			fmt.Printf("Data processing error: %s\n", dataErr.Message)
		}
	}
}

func processFile(filename string) error {
	file, err := os.Open(filename)
	if err != nil {
		return fmt.Errorf("failed to process file '%s': %w", filename, err)
	}
	defer file.Close()
	
	// Simulate file processing
	return nil
}

type DataProcessingError struct {
	Message string
	Code    int
}

func (e *DataProcessingError) Error() string {
	return fmt.Sprintf("data processing error (code %d): %s", e.Code, e.Message)
}

func processData(data string) error {
	if data == "" {
		return &DataProcessingError{
			Message: "empty data",
			Code:    1001,
		}
	}
	
	if len(data) < 3 {
		return fmt.Errorf("data too short: %w", &DataProcessingError{
			Message: "minimum length is 3 characters",
			Code:    1002,
		})
	}
	
	return nil
}

func errorCheckingPatternsDemo() {
	fmt.Println("\n--- Error Checking Patterns ---")
	
	// Pattern 1: Early return
	result, err := earlyReturnPattern(10, 0)
	if err != nil {
		fmt.Printf("Early return error: %v\n", err)
	} else {
		fmt.Printf("Early return result: %d\n", result)
	}
	
	// Pattern 2: Error aggregation
	errs := errorAggregationPattern()
	if len(errs) > 0 {
		fmt.Printf("Multiple errors: %v\n", errs)
	}
	
	// Pattern 3: Retry pattern
	result, err = retryPattern(3)
	if err != nil {
		fmt.Printf("Retry failed: %v\n", err)
	} else {
		fmt.Printf("Retry succeeded: %d\n", result)
	}
}

func earlyReturnPattern(a, b int) (int, error) {
	if b == 0 {
		return 0, errors.New("division by zero")
	}
	
	if a < 0 {
		return 0, errors.New("negative dividend")
	}
	
	if b < 0 {
		return 0, errors.New("negative divisor")
	}
	
	return a / b, nil
}

func errorAggregationPattern() []error {
	var errs []error
	
	// Simulate multiple operations that might fail
	if err := validateInput(""); err != nil {
		errs = append(errs, err)
	}
	
	if err := validateInput("short"); err != nil {
		errs = append(errs, err)
	}
	
	if err := validateInput("valid input"); err != nil {
		errs = append(errs, err)
	}
	
	return errs
}

func validateInput(input string) error {
	if input == "" {
		return errors.New("input is empty")
	}
	
	if len(input) < 5 {
		return errors.New("input too short")
	}
	
	return nil
}

func retryPattern(maxRetries int) (int, error) {
	for i := 0; i < maxRetries; i++ {
		result, err := unreliableOperation()
		if err == nil {
			return result, nil
		}
		
		fmt.Printf("Attempt %d failed: %v\n", i+1, err)
		
		if i == maxRetries-1 {
			return 0, fmt.Errorf("operation failed after %d attempts", maxRetries)
		}
	}
	
	return 0, errors.New("unexpected error")
}

func unreliableOperation() (int, error) {
	// Simulate unreliable operation
	if time.Now().UnixNano()%3 == 0 {
		return 42, nil
	}
	return 0, errors.New("operation failed")
}

func errorBestPracticesDemo() {
	fmt.Println("\n--- Error Handling Best Practices ---")
	
	// 1. Always handle errors
	_, err := os.Open("nonexistent.txt")
	if err != nil {
		fmt.Printf("File error handled: %v\n", err)
	}
	
	// 2. Use meaningful error messages
	err = meaningfulErrorDemo("")
	if err != nil {
		fmt.Printf("Meaningful error: %v\n", err)
	}
	
	// 3. Don't ignore errors
	// BAD: _ = someFunction()
	// GOOD: if err := someFunction(); err != nil { ... }
	
	// 4. Use error wrapping for context
	err = contextErrorDemo()
	if err != nil {
		fmt.Printf("Context error: %v\n", err)
	}
	
	// 5. Use errors.Is for error comparison
	err = checkErrorType()
	if errors.Is(err, os.ErrNotExist) {
		fmt.Println("File does not exist")
	}
}

func meaningfulErrorDemo(input string) error {
	if input == "" {
		return errors.New("input cannot be empty")
	}
	
	if len(input) < 3 {
		return errors.New("input must be at least 3 characters long")
	}
	
	return nil
}

func contextErrorDemo() error {
	// Simulate nested function calls
	err := innerFunction()
	if err != nil {
		return fmt.Errorf("outer function failed: %w", err)
	}
	return nil
}

func innerFunction() error {
	return fmt.Errorf("inner function failed: %w", errors.New("root cause"))
}

func checkErrorType() error {
	_, err := os.Open("nonexistent.txt")
	return err
}

// Import time package for unreliable operation
import "time"


