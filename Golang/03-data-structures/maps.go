package main

import "fmt"

// Maps in Go
func main() {
	fmt.Println("=== Maps in Go ===")

	// 1. Map creation and initialization
	mapCreationDemo()

	// 2. Map operations
	mapOperationsDemo()

	// 3. Map iteration
	mapIterationDemo()

	// 4. Map with different value types
	mapValueTypesDemo()

	// 5. Map as function parameters
	mapAsParameterDemo()

	// 6. Map patterns and best practices
	mapPatternsDemo()
}

func mapCreationDemo() {
	fmt.Println("\n--- Map Creation and Initialization ---")

	// Method 1: Using make()
	var map1 map[string]int = make(map[string]int)
	map1["apple"] = 5
	map1["banana"] = 3
	fmt.Printf("map1: %v\n", map1)

	// Method 2: Map literal
	map2 := map[string]int{
		"apple":  5,
		"banana": 3,
		"orange": 8,
	}
	fmt.Printf("map2: %v\n", map2)

	// Method 3: Empty map literal
	map3 := map[string]int{}
	map3["grape"] = 12
	fmt.Printf("map3: %v\n", map3)

	// Method 4: Using new() (returns pointer to nil map)
	map4 := new(map[string]int)
	fmt.Printf("map4: %v (pointer to nil map)\n", map4)

	// Nil map behavior
	var nilMap map[string]int
	fmt.Printf("nilMap: %v\n", nilMap)
	fmt.Printf("nilMap == nil: %t\n", nilMap == nil)

	// Different key types
	intMap := map[int]string{
		1: "one",
		2: "two",
		3: "three",
	}
	fmt.Printf("intMap: %v\n", intMap)

	boolMap := map[bool]string{
		true:  "yes",
		false: "no",
	}
	fmt.Printf("boolMap: %v\n", boolMap)
}

func mapOperationsDemo() {
	fmt.Println("\n--- Map Operations ---")

	// Create a map
	inventory := map[string]int{
		"apples":  10,
		"bananas": 5,
		"oranges": 8,
	}
	fmt.Printf("Initial inventory: %v\n", inventory)

	// Add/Update elements
	inventory["grapes"] = 15
	inventory["apples"] = 12 // Update existing
	fmt.Printf("After adding/updating: %v\n", inventory)

	// Access elements
	appleCount := inventory["apples"]
	fmt.Printf("Apple count: %d\n", appleCount)

	// Access non-existent key (returns zero value)
	cherryCount := inventory["cherries"]
	fmt.Printf("Cherry count: %d (zero value)\n", cherryCount)

	// Check if key exists
	if count, exists := inventory["bananas"]; exists {
		fmt.Printf("Bananas exist: %d\n", count)
	} else {
		fmt.Println("Bananas don't exist")
	}

	// Delete elements
	delete(inventory, "oranges")
	fmt.Printf("After deleting oranges: %v\n", inventory)

	// Delete non-existent key (safe operation)
	delete(inventory, "nonexistent")
	fmt.Printf("After deleting nonexistent: %v\n", inventory)

	// Map length
	fmt.Printf("Map length: %d\n", len(inventory))

	// Clear map (set to nil or make new)
	inventory = make(map[string]int)
	fmt.Printf("After clearing: %v (len: %d)\n", inventory, len(inventory))
}

func mapIterationDemo() {
	fmt.Println("\n--- Map Iteration ---")

	// Create a map
	colors := map[string]string{
		"red":    "#FF0000",
		"green":  "#00FF00",
		"blue":   "#0000FF",
		"yellow": "#FFFF00",
		"purple": "#800080",
	}

	// Iterate over key-value pairs
	fmt.Println("All colors:")
	for color, hex := range colors {
		fmt.Printf("  %s: %s\n", color, hex)
	}

	// Iterate over keys only
	fmt.Println("Color names:")
	for color := range colors {
		fmt.Printf("  %s\n", color)
	}

	// Iterate over values only
	fmt.Println("Hex codes:")
	for _, hex := range colors {
		fmt.Printf("  %s\n", hex)
	}

	// Note: Map iteration order is not guaranteed in Go
	fmt.Println("Iteration order is random:")
	for i := 0; i < 3; i++ {
		fmt.Printf("  Iteration %d: ", i+1)
		for color := range colors {
			fmt.Printf("%s ", color)
		}
		fmt.Println()
	}
}

func mapValueTypesDemo() {
	fmt.Println("\n--- Maps with Different Value Types ---")

	// Map with slice values
	studentGrades := map[string][]int{
		"Alice": {85, 90, 78},
		"Bob":   {92, 88, 95},
		"Carol": {76, 82, 89},
	}
	fmt.Printf("Student grades: %v\n", studentGrades)

	// Map with map values (nested maps)
	companyEmployees := map[string]map[string]string{
		"Engineering": {
			"manager": "John",
			"lead":    "Sarah",
		},
		"Marketing": {
			"manager": "Mike",
			"lead":    "Lisa",
		},
	}
	fmt.Printf("Company structure: %v\n", companyEmployees)

	// Map with struct values
	type Person struct {
		Name string
		Age  int
	}

	people := map[int]Person{
		1: {Name: "Alice", Age: 25},
		2: {Name: "Bob", Age: 30},
		3: {Name: "Carol", Age: 35},
	}
	fmt.Printf("People: %v\n", people)

	// Map with interface{} values (can hold any type)
	anyMap := map[string]interface{}{
		"name":   "John",
		"age":    30,
		"active": true,
		"scores": []int{85, 90, 78},
	}
	fmt.Printf("Any type map: %v\n", anyMap)
}

func mapAsParameterDemo() {
	fmt.Println("\n--- Maps as Function Parameters ---")

	// Maps are reference types - modifications affect the original
	scores := map[string]int{
		"Alice": 85,
		"Bob":   90,
		"Carol": 78,
	}

	fmt.Printf("Before modification: %v\n", scores)
	modifyMap(scores)
	fmt.Printf("After modification: %v\n", scores)

	// Create a copy of a map
	scoresCopy := copyMap(scores)
	fmt.Printf("Original: %v\n", scores)
	fmt.Printf("Copy: %v\n", scoresCopy)

	// Modify the copy
	scoresCopy["David"] = 95
	fmt.Printf("After modifying copy:\n")
	fmt.Printf("Original: %v\n", scores)
	fmt.Printf("Copy: %v\n", scoresCopy)
}

func modifyMap(m map[string]int) {
	m["David"] = 88
	m["Alice"] = 90
}

func copyMap(original map[string]int) map[string]int {
	copy := make(map[string]int)
	for k, v := range original {
		copy[k] = v
	}
	return copy
}

func mapPatternsDemo() {
	fmt.Println("\n--- Map Patterns and Best Practices ---")

	// 1. Counting occurrences
	text := "hello world hello go world"
	words := []string{"hello", "world", "hello", "go", "world"}
	wordCount := make(map[string]int)

	for _, word := range words {
		wordCount[word]++
	}
	fmt.Printf("Word count: %v\n", wordCount)

	// 2. Grouping
	students := []struct {
		Name  string
		Grade string
	}{
		{"Alice", "A"},
		{"Bob", "B"},
		{"Carol", "A"},
		{"David", "C"},
		{"Eve", "B"},
	}

	gradeGroups := make(map[string][]string)
	for _, student := range students {
		gradeGroups[student.Grade] = append(gradeGroups[student.Grade], student.Name)
	}
	fmt.Printf("Students by grade: %v\n", gradeGroups)

	// 3. Set implementation using map
	set := make(map[string]bool)
	items := []string{"apple", "banana", "apple", "orange", "banana"}

	for _, item := range items {
		set[item] = true
	}
	fmt.Printf("Unique items: ")
	for item := range set {
		fmt.Printf("%s ", item)
	}
	fmt.Println()

	// 4. Default values pattern
	config := map[string]string{
		"host": "localhost",
		"port": "8080",
	}

	// Get with default
	host := getWithDefault(config, "host", "127.0.0.1")
	timeout := getWithDefault(config, "timeout", "30s")
	fmt.Printf("Host: %s, Timeout: %s\n", host, timeout)

	// 5. Map of functions
	operations := map[string]func(int, int) int{
		"add": func(a, b int) int { return a + b },
		"sub": func(a, b int) int { return a - b },
		"mul": func(a, b int) int { return a * b },
		"div": func(a, b int) int { return a / b },
	}

	result := operations["add"](5, 3)
	fmt.Printf("5 + 3 = %d\n", result)
}

func getWithDefault(m map[string]string, key, defaultValue string) string {
	if value, exists := m[key]; exists {
		return value
	}
	return defaultValue
}


