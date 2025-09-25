package main

import "fmt"

// Arrays and Slices in Go
func main() {
	fmt.Println("=== Arrays and Slices ===")

	// 1. Arrays
	arrayDemo()

	// 2. Slices
	sliceDemo()

	// 3. Slice operations
	sliceOperationsDemo()

	// 4. Slice internals
	sliceInternalsDemo()

	// 5. Multi-dimensional arrays and slices
	multiDimensionalDemo()
}

func arrayDemo() {
	fmt.Println("\n--- Arrays ---")

	// Array declaration and initialization
	var arr1 [5]int                 // Zero-initialized array
	arr2 := [5]int{1, 2, 3, 4, 5}   // Array with values
	arr3 := [...]int{1, 2, 3, 4, 5} // Array with inferred size
	arr4 := [5]int{1: 10, 3: 30}    // Array with specific indices

	fmt.Printf("arr1: %v\n", arr1)
	fmt.Printf("arr2: %v\n", arr2)
	fmt.Printf("arr3: %v\n", arr3)
	fmt.Printf("arr4: %v\n", arr4)

	// Array access and modification
	arr2[0] = 100
	fmt.Printf("Modified arr2: %v\n", arr2)

	// Array length
	fmt.Printf("Length of arr2: %d\n", len(arr2))

	// Array iteration
	fmt.Println("Iterating over arr2:")
	for i, v := range arr2 {
		fmt.Printf("  Index %d: %d\n", i, v)
	}

	// Array comparison
	arr5 := [5]int{100, 2, 3, 4, 5}
	fmt.Printf("arr2 == arr5: %t\n", arr2 == arr5)

	// Array copying
	arr6 := arr2 // This creates a copy
	arr6[0] = 999
	fmt.Printf("arr2 after copying: %v\n", arr2)
	fmt.Printf("arr6 (copy): %v\n", arr6)
}

func sliceDemo() {
	fmt.Println("\n--- Slices ---")

	// Slice declaration and initialization
	var slice1 []int               // Nil slice
	slice2 := []int{1, 2, 3, 4, 5} // Slice with values
	slice3 := make([]int, 5)       // Slice with make (length 5)
	slice4 := make([]int, 5, 10)   // Slice with make (length 5, capacity 10)

	fmt.Printf("slice1: %v (len: %d, cap: %d)\n", slice1, len(slice1), cap(slice1))
	fmt.Printf("slice2: %v (len: %d, cap: %d)\n", slice2, len(slice2), cap(slice2))
	fmt.Printf("slice3: %v (len: %d, cap: %d)\n", slice3, len(slice3), cap(slice3))
	fmt.Printf("slice4: %v (len: %d, cap: %d)\n", slice4, len(slice4), cap(slice4))

	// Slice from array
	arr := [5]int{10, 20, 30, 40, 50}
	slice5 := arr[1:4] // Elements from index 1 to 3 (exclusive)
	fmt.Printf("slice5 from array: %v (len: %d, cap: %d)\n", slice5, len(slice5), cap(slice5))

	// Slice from slice
	slice6 := slice2[1:3]
	fmt.Printf("slice6 from slice2: %v (len: %d, cap: %d)\n", slice6, len(slice6), cap(slice6))

	// Full slice expressions
	slice7 := arr[1:4:4] // start:end:max (max limits capacity)
	fmt.Printf("slice7 with max: %v (len: %d, cap: %d)\n", slice7, len(slice7), cap(slice7))
}

func sliceOperationsDemo() {
	fmt.Println("\n--- Slice Operations ---")

	// Append operation
	slice := []int{1, 2, 3}
	fmt.Printf("Original slice: %v\n", slice)

	slice = append(slice, 4, 5, 6)
	fmt.Printf("After append: %v (len: %d, cap: %d)\n", slice, len(slice), cap(slice))

	// Append another slice
	anotherSlice := []int{7, 8, 9}
	slice = append(slice, anotherSlice...)
	fmt.Printf("After appending slice: %v (len: %d, cap: %d)\n", slice, len(slice), cap(slice))

	// Copy operation
	source := []int{1, 2, 3, 4, 5}
	destination := make([]int, 3)
	copied := copy(destination, source)
	fmt.Printf("Source: %v\n", source)
	fmt.Printf("Destination: %v\n", destination)
	fmt.Printf("Copied elements: %d\n", copied)

	// Slice deletion (by index)
	slice = []int{1, 2, 3, 4, 5}
	index := 2 // Remove element at index 2
	slice = append(slice[:index], slice[index+1:]...)
	fmt.Printf("After removing index 2: %v\n", slice)

	// Slice insertion
	slice = []int{1, 2, 4, 5}
	insertIndex := 2
	insertValue := 3
	slice = append(slice[:insertIndex], append([]int{insertValue}, slice[insertIndex:]...)...)
	fmt.Printf("After inserting 3 at index 2: %v\n", slice)

	// Slice filtering
	numbers := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
	var evenNumbers []int
	for _, num := range numbers {
		if num%2 == 0 {
			evenNumbers = append(evenNumbers, num)
		}
	}
	fmt.Printf("Even numbers: %v\n", evenNumbers)
}

func sliceInternalsDemo() {
	fmt.Println("\n--- Slice Internals ---")

	// Understanding slice capacity growth
	slice := make([]int, 0, 2)
	fmt.Printf("Initial: len=%d, cap=%d\n", len(slice), cap(slice))

	for i := 0; i < 10; i++ {
		slice = append(slice, i)
		fmt.Printf("After append %d: len=%d, cap=%d\n", i, len(slice), cap(slice))
	}

	// Slice sharing underlying array
	arr := [5]int{1, 2, 3, 4, 5}
	slice1 := arr[1:4]
	slice2 := arr[2:5]

	fmt.Printf("Original array: %v\n", arr)
	fmt.Printf("slice1: %v\n", slice1)
	fmt.Printf("slice2: %v\n", slice2)

	// Modifying through slice1 affects slice2
	slice1[0] = 100
	fmt.Printf("After modifying slice1[0]:\n")
	fmt.Printf("Array: %v\n", arr)
	fmt.Printf("slice1: %v\n", slice1)
	fmt.Printf("slice2: %v\n", slice2)

	// Slice bounds
	slice := []int{1, 2, 3, 4, 5}
	fmt.Printf("Original slice: %v\n", slice)

	// Different slice expressions
	fmt.Printf("slice[1:3]: %v\n", slice[1:3])
	fmt.Printf("slice[:3]: %v\n", slice[:3])
	fmt.Printf("slice[2:]: %v\n", slice[2:])
	fmt.Printf("slice[:]: %v\n", slice[:])
}

func multiDimensionalDemo() {
	fmt.Println("\n--- Multi-dimensional Arrays and Slices ---")

	// 2D Array
	var matrix [3][3]int
	matrix[0] = [3]int{1, 2, 3}
	matrix[1] = [3]int{4, 5, 6}
	matrix[2] = [3]int{7, 8, 9}

	fmt.Println("2D Array:")
	for i, row := range matrix {
		fmt.Printf("Row %d: %v\n", i, row)
	}

	// 2D Slice
	slice2D := [][]int{
		{1, 2, 3},
		{4, 5, 6},
		{7, 8, 9},
	}

	fmt.Println("2D Slice:")
	for i, row := range slice2D {
		fmt.Printf("Row %d: %v\n", i, row)
	}

	// Dynamic 2D slice
	rows, cols := 3, 4
	dynamic2D := make([][]int, rows)
	for i := range dynamic2D {
		dynamic2D[i] = make([]int, cols)
		for j := range dynamic2D[i] {
			dynamic2D[i][j] = i*cols + j + 1
		}
	}

	fmt.Println("Dynamic 2D Slice:")
	for i, row := range dynamic2D {
		fmt.Printf("Row %d: %v\n", i, row)
	}

	// 3D slice
	slice3D := [][][]int{
		{
			{1, 2},
			{3, 4},
		},
		{
			{5, 6},
			{7, 8},
		},
	}

	fmt.Println("3D Slice:")
	for i, layer := range slice3D {
		fmt.Printf("Layer %d:\n", i)
		for j, row := range layer {
			fmt.Printf("  Row %d: %v\n", j, row)
		}
	}
}


