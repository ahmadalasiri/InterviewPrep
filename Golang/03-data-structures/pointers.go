package main

import "fmt"

// Pointers in Go
func main() {
	fmt.Println("=== Pointers in Go ===")

	// 1. Basic pointer operations
	basicPointerDemo()

	// 2. Pointers and functions
	pointersAndFunctionsDemo()

	// 3. Pointers and structs
	pointersAndStructsDemo()

	// 4. Pointers and slices
	pointersAndSlicesDemo()

	// 5. Pointer arithmetic (not available in Go)
	pointerArithmeticDemo()
}

func basicPointerDemo() {
	fmt.Println("\n--- Basic Pointer Operations ---")

	// Declare a variable
	x := 42
	fmt.Printf("Value of x: %d\n", x)
	fmt.Printf("Address of x: %p\n", &x)

	// Declare a pointer
	var p *int = &x
	fmt.Printf("Value of p (address): %p\n", p)
	fmt.Printf("Value pointed to by p: %d\n", *p)

	// Modify value through pointer
	*p = 100
	fmt.Printf("After modifying through pointer:\n")
	fmt.Printf("Value of x: %d\n", x)
	fmt.Printf("Value pointed to by p: %d\n", *p)

	// Nil pointer
	var nilPtr *int
	fmt.Printf("Nil pointer: %p\n", nilPtr)
	// fmt.Printf("Dereferencing nil pointer: %d\n", *nilPtr) // This would panic!

	// Check for nil pointer
	if nilPtr != nil {
		fmt.Printf("Value: %d\n", *nilPtr)
	} else {
		fmt.Println("Pointer is nil")
	}

	// New function to create pointers
	ptr := new(int)
	*ptr = 200
	fmt.Printf("Value created with new(): %d\n", *ptr)
}

func pointersAndFunctionsDemo() {
	fmt.Println("\n--- Pointers and Functions ---")

	// Pass by value (doesn't modify original)
	x := 10
	fmt.Printf("Before passByValue: x = %d\n", x)
	passByValue(x)
	fmt.Printf("After passByValue: x = %d\n", x)

	// Pass by reference (modifies original)
	fmt.Printf("Before passByReference: x = %d\n", x)
	passByReference(&x)
	fmt.Printf("After passByReference: x = %d\n", x)

	// Function that returns a pointer
	ptr := createPointer(42)
	fmt.Printf("Created pointer points to: %d\n", *ptr)

	// Function that takes and returns pointers
	ptr2 := doublePointer(ptr)
	fmt.Printf("Doubled value: %d\n", *ptr2)
}

func passByValue(x int) {
	x = x * 2
	fmt.Printf("Inside passByValue: x = %d\n", x)
}

func passByReference(x *int) {
	*x = *x * 2
	fmt.Printf("Inside passByReference: *x = %d\n", *x)
}

func createPointer(value int) *int {
	return &value
}

func doublePointer(ptr *int) *int {
	result := *ptr * 2
	return &result
}

func pointersAndStructsDemo() {
	fmt.Println("\n--- Pointers and Structs ---")

	// Create a struct
	person := Person{Name: "Alice", Age: 25}
	fmt.Printf("Original person: %+v\n", person)

	// Pass struct by value
	modifyPersonByValue(person)
	fmt.Printf("After modifyPersonByValue: %+v\n", person)

	// Pass struct by pointer
	modifyPersonByPointer(&person)
	fmt.Printf("After modifyPersonByPointer: %+v\n", person)

	// Method with value receiver
	person.HaveBirthdayValue()
	fmt.Printf("After HaveBirthdayValue: %+v\n", person)

	// Method with pointer receiver
	person.HaveBirthdayPointer()
	fmt.Printf("After HaveBirthdayPointer: %+v\n", person)

	// Pointer to struct
	personPtr := &Person{Name: "Bob", Age: 30}
	fmt.Printf("Person pointer: %+v\n", *personPtr)

	// Access fields through pointer
	personPtr.Name = "Charlie"
	fmt.Printf("Modified through pointer: %+v\n", *personPtr)
}

type Person struct {
	Name string
	Age  int
}

func modifyPersonByValue(p Person) {
	p.Age = 100
	fmt.Printf("Inside modifyPersonByValue: %+v\n", p)
}

func modifyPersonByPointer(p *Person) {
	p.Age = 100
	fmt.Printf("Inside modifyPersonByPointer: %+v\n", *p)
}

func (p Person) HaveBirthdayValue() {
	p.Age++
	fmt.Printf("Inside HaveBirthdayValue: %+v\n", p)
}

func (p *Person) HaveBirthdayPointer() {
	p.Age++
	fmt.Printf("Inside HaveBirthdayPointer: %+v\n", *p)
}

func pointersAndSlicesDemo() {
	fmt.Println("\n--- Pointers and Slices ---")

	// Slices are reference types
	slice := []int{1, 2, 3, 4, 5}
	fmt.Printf("Original slice: %v\n", slice)

	// Pass slice to function (modifies original)
	modifySlice(slice)
	fmt.Printf("After modifySlice: %v\n", slice)

	// Pointer to slice
	slicePtr := &slice
	fmt.Printf("Slice pointer: %p\n", slicePtr)
	fmt.Printf("Slice through pointer: %v\n", *slicePtr)

	// Modify slice through pointer
	*slicePtr = append(*slicePtr, 6, 7)
	fmt.Printf("After appending through pointer: %v\n", slice)

	// Array vs slice with pointers
	array := [3]int{1, 2, 3}
	fmt.Printf("Original array: %v\n", array)
	modifyArray(array)
	fmt.Printf("After modifyArray: %v\n", array)

	modifyArrayByPointer(&array)
	fmt.Printf("After modifyArrayByPointer: %v\n", array)
}

func modifySlice(s []int) {
	s[0] = 100
	s = append(s, 999) // This doesn't affect the original slice
	fmt.Printf("Inside modifySlice: %v\n", s)
}

func modifyArray(arr [3]int) {
	arr[0] = 100
	fmt.Printf("Inside modifyArray: %v\n", arr)
}

func modifyArrayByPointer(arr *[3]int) {
	arr[0] = 100
	fmt.Printf("Inside modifyArrayByPointer: %v\n", *arr)
}

func pointerArithmeticDemo() {
	fmt.Println("\n--- Pointer Arithmetic (Not Available in Go) ---")

	// Go doesn't support pointer arithmetic for safety reasons
	// This is different from C/C++

	x := 42
	p := &x

	fmt.Printf("Address of x: %p\n", p)
	fmt.Printf("Value at address: %d\n", *p)

	// In C, you could do: p++ or p + 1
	// In Go, this is not allowed:
	// p++ // This would cause a compile error

	fmt.Println("Go doesn't allow pointer arithmetic for memory safety")
	fmt.Println("Use slices and indices instead for array-like operations")

	// Alternative: use slices
	numbers := []int{1, 2, 3, 4, 5}
	for i := range numbers {
		fmt.Printf("numbers[%d] = %d (address: %p)\n", i, numbers[i], &numbers[i])
	}
}


