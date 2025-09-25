package main

import (
	"fmt"
	"reflect"
)

// Data Types in Go
func main() {
	fmt.Println("=== Go Data Types ===")

	// 1. Basic Types
	basicTypes()

	// 2. Type Conversion
	typeConversion()

	// 3. Type Assertions
	typeAssertions()

	// 4. Custom Types
	customTypes()
}

func basicTypes() {
	fmt.Println("\n--- Basic Types ---")

	// Integer types
	var (
		int8Val  int8  = 127
		int16Val int16 = 32767
		int32Val int32 = 2147483647
		int64Val int64 = 9223372036854775807
		intVal   int   = 42 // Platform dependent (32 or 64 bit)
		uintVal  uint  = 42
		byteVal  byte  = 255 // alias for uint8
		runeVal  rune  = 'A' // alias for int32, represents Unicode code point
	)

	fmt.Printf("Integers: int8=%d, int16=%d, int32=%d, int64=%d, int=%d\n",
		int8Val, int16Val, int32Val, int64Val, intVal)
	fmt.Printf("Unsigned: uint=%d, byte=%d, rune=%c (%d)\n",
		uintVal, byteVal, runeVal, runeVal)

	// Floating point types
	var (
		float32Val float32 = 3.14
		float64Val float64 = 3.14159265359
	)
	fmt.Printf("Floats: float32=%.2f, float64=%.11f\n", float32Val, float64Val)

	// Boolean type
	var boolVal bool = true
	fmt.Printf("Boolean: %t\n", boolVal)

	// String type
	var strVal string = "Hello, Go!"
	fmt.Printf("String: %s (length: %d)\n", strVal, len(strVal))

	// Complex types
	var (
		complex64Val  complex64  = 1 + 2i
		complex128Val complex128 = 3 + 4i
	)
	fmt.Printf("Complex: %v, %v\n", complex64Val, complex128Val)
}

func typeConversion() {
	fmt.Println("\n--- Type Conversion ---")

	// Explicit type conversion is required in Go
	var intVal int = 42
	var floatVal float64 = float64(intVal)
	var stringVal string = string(intVal) // This converts to Unicode character!

	fmt.Printf("int to float64: %d -> %.2f\n", intVal, floatVal)
	fmt.Printf("int to string (Unicode): %d -> %s\n", intVal, stringVal)

	// Proper int to string conversion
	properString := fmt.Sprintf("%d", intVal)
	fmt.Printf("int to string (proper): %d -> %s\n", intVal, properString)

	// Float to int (truncates)
	var pi float64 = 3.14159
	var intPi int = int(pi)
	fmt.Printf("float64 to int: %.5f -> %d\n", pi, intPi)
}

func typeAssertions() {
	fmt.Println("\n--- Type Assertions ---")

	// Type assertions work with interface{} (empty interface)
	var value interface{} = "Hello, World!"

	// Safe type assertion
	if str, ok := value.(string); ok {
		fmt.Printf("Value is string: %s\n", str)
	}

	// Type assertion with panic if wrong type
	str := value.(string)
	fmt.Printf("Direct assertion: %s\n", str)

	// Type switch
	switch v := value.(type) {
	case string:
		fmt.Printf("Type switch - string: %s\n", v)
	case int:
		fmt.Printf("Type switch - int: %d\n", v)
	case float64:
		fmt.Printf("Type switch - float64: %.2f\n", v)
	default:
		fmt.Printf("Type switch - unknown type: %T\n", v)
	}
}

func customTypes() {
	fmt.Println("\n--- Custom Types ---")

	// Type alias
	type UserID int
	type ProductID int

	var userID UserID = 123
	var productID ProductID = 456

	// These are different types even though they're both int
	fmt.Printf("UserID: %d, ProductID: %d\n", userID, productID)

	// Type conversion between custom types
	var convertedUserID UserID = UserID(productID)
	fmt.Printf("Converted UserID: %d\n", convertedUserID)

	// Using reflect to get type information
	fmt.Printf("UserID type: %s\n", reflect.TypeOf(userID))
	fmt.Printf("ProductID type: %s\n", reflect.TypeOf(productID))
}


