package main

import (
	"encoding/json"
	"fmt"
	"os"
)

// JSON Handling in Go
func main() {
	fmt.Println("=== JSON Handling ===")

	// 1. Basic JSON marshaling
	basicJSONDemo()

	// 2. JSON unmarshaling
	jsonUnmarshalingDemo()

	// 3. Custom JSON tags
	customJSONTagsDemo()

	// 4. JSON with nested structures
	nestedJSONDemo()

	// 5. JSON arrays
	jsonArraysDemo()

	// 6. JSON streaming
	jsonStreamingDemo()
}

func basicJSONDemo() {
	fmt.Println("\n--- Basic JSON Marshaling ---")

	// Simple struct
	type Person struct {
		Name string `json:"name"`
		Age  int    `json:"age"`
		City string `json:"city"`
	}

	person := Person{
		Name: "John Doe",
		Age:  30,
		City: "New York",
	}

	// Marshal to JSON
	jsonData, err := json.Marshal(person)
	if err != nil {
		fmt.Printf("Error marshaling JSON: %v\n", err)
		return
	}

	fmt.Printf("JSON data: %s\n", string(jsonData))

	// Marshal with indentation
	jsonData, err = json.MarshalIndent(person, "", "  ")
	if err != nil {
		fmt.Printf("Error marshaling JSON: %v\n", err)
		return
	}

	fmt.Printf("Pretty JSON:\n%s\n", string(jsonData))
}

func jsonUnmarshalingDemo() {
	fmt.Println("\n--- JSON Unmarshaling ---")

	type Person struct {
		Name string `json:"name"`
		Age  int    `json:"age"`
		City string `json:"city"`
	}

	// JSON string
	jsonString := `{"name":"Jane Smith","age":25,"city":"Los Angeles"}`

	var person Person
	err := json.Unmarshal([]byte(jsonString), &person)
	if err != nil {
		fmt.Printf("Error unmarshaling JSON: %v\n", err)
		return
	}

	fmt.Printf("Unmarshaled person: %+v\n", person)

	// JSON with extra fields
	jsonWithExtra := `{"name":"Bob Johnson","age":35,"city":"Chicago","country":"USA","phone":"123-456-7890"}`

	var person2 Person
	err = json.Unmarshal([]byte(jsonWithExtra), &person2)
	if err != nil {
		fmt.Printf("Error unmarshaling JSON: %v\n", err)
		return
	}

	fmt.Printf("Person with extra fields: %+v\n", person2)
}

func customJSONTagsDemo() {
	fmt.Println("\n--- Custom JSON Tags ---")

	type User struct {
		ID       int      `json:"id"`
		Username string   `json:"username"`
		Email    string   `json:"email"`
		Password string   `json:"-"` // Hidden in JSON
		Active   bool     `json:"active"`
		Score    int      `json:"score,omitempty"` // Omit if zero value
		Tags     []string `json:"tags,omitempty"`  // Omit if empty
	}

	user := User{
		ID:       1,
		Username: "johndoe",
		Email:    "john@example.com",
		Password: "secret123",
		Active:   true,
		Score:    0,   // This will be omitted
		Tags:     nil, // This will be omitted
	}

	jsonData, err := json.Marshal(user)
	if err != nil {
		fmt.Printf("Error marshaling JSON: %v\n", err)
		return
	}

	fmt.Printf("User JSON (password hidden, zero values omitted):\n%s\n", string(jsonData))

	// User with all fields
	user2 := User{
		ID:       2,
		Username: "janedoe",
		Email:    "jane@example.com",
		Password: "secret456",
		Active:   false,
		Score:    95,
		Tags:     []string{"admin", "premium"},
	}

	jsonData, err = json.MarshalIndent(user2, "", "  ")
	if err != nil {
		fmt.Printf("Error marshaling JSON: %v\n", err)
		return
	}

	fmt.Printf("User with all fields:\n%s\n", string(jsonData))
}

func nestedJSONDemo() {
	fmt.Println("\n--- Nested JSON Structures ---")

	type Address struct {
		Street  string `json:"street"`
		City    string `json:"city"`
		State   string `json:"state"`
		ZipCode string `json:"zip_code"`
	}

	type Company struct {
		Name    string  `json:"name"`
		Address Address `json:"address"`
	}

	type Employee struct {
		ID      int     `json:"id"`
		Name    string  `json:"name"`
		Company Company `json:"company"`
		Salary  float64 `json:"salary"`
	}

	employee := Employee{
		ID:   1,
		Name: "Alice Johnson",
		Company: Company{
			Name: "Tech Corp",
			Address: Address{
				Street:  "123 Tech Street",
				City:    "San Francisco",
				State:   "CA",
				ZipCode: "94105",
			},
		},
		Salary: 75000.50,
	}

	jsonData, err := json.MarshalIndent(employee, "", "  ")
	if err != nil {
		fmt.Printf("Error marshaling JSON: %v\n", err)
		return
	}

	fmt.Printf("Nested JSON structure:\n%s\n", string(jsonData))

	// Unmarshal nested JSON
	jsonString := `{
		"id": 2,
		"name": "Bob Smith",
		"company": {
			"name": "Data Inc",
			"address": {
				"street": "456 Data Ave",
				"city": "Seattle",
				"state": "WA",
				"zip_code": "98101"
			}
		},
		"salary": 82000.75
	}`

	var employee2 Employee
	err = json.Unmarshal([]byte(jsonString), &employee2)
	if err != nil {
		fmt.Printf("Error unmarshaling JSON: %v\n", err)
		return
	}

	fmt.Printf("Unmarshaled employee: %+v\n", employee2)
}

func jsonArraysDemo() {
	fmt.Println("\n--- JSON Arrays ---")

	type Product struct {
		ID    int     `json:"id"`
		Name  string  `json:"name"`
		Price float64 `json:"price"`
	}

	products := []Product{
		{ID: 1, Name: "Laptop", Price: 999.99},
		{ID: 2, Name: "Mouse", Price: 29.99},
		{ID: 3, Name: "Keyboard", Price: 79.99},
	}

	jsonData, err := json.MarshalIndent(products, "", "  ")
	if err != nil {
		fmt.Printf("Error marshaling JSON: %v\n", err)
		return
	}

	fmt.Printf("Products array:\n%s\n", string(jsonData))

	// Unmarshal JSON array
	jsonArrayString := `[
		{"id": 4, "name": "Monitor", "price": 299.99},
		{"id": 5, "name": "Headphones", "price": 149.99}
	]`

	var products2 []Product
	err = json.Unmarshal([]byte(jsonArrayString), &products2)
	if err != nil {
		fmt.Printf("Error unmarshaling JSON: %v\n", err)
		return
	}

	fmt.Printf("Unmarshaled products: %+v\n", products2)

	// Array of mixed types
	mixedArray := []interface{}{
		"string",
		42,
		true,
		[]string{"a", "b", "c"},
		map[string]interface{}{
			"key": "value",
			"num": 123,
		},
	}

	jsonData, err = json.MarshalIndent(mixedArray, "", "  ")
	if err != nil {
		fmt.Printf("Error marshaling JSON: %v\n", err)
		return
	}

	fmt.Printf("Mixed array:\n%s\n", string(jsonData))
}

func jsonStreamingDemo() {
	fmt.Println("\n--- JSON Streaming ---")

	type LogEntry struct {
		Timestamp string `json:"timestamp"`
		Level     string `json:"level"`
		Message   string `json:"message"`
	}

	// Create a file for streaming
	file, err := os.Create("log.json")
	if err != nil {
		fmt.Printf("Error creating file: %v\n", err)
		return
	}
	defer file.Close()
	defer os.Remove("log.json")

	// Create JSON encoder
	encoder := json.NewEncoder(file)

	// Stream multiple log entries
	logEntries := []LogEntry{
		{Timestamp: "2023-01-01T10:00:00Z", Level: "INFO", Message: "Application started"},
		{Timestamp: "2023-01-01T10:01:00Z", Level: "WARN", Message: "High memory usage"},
		{Timestamp: "2023-01-01T10:02:00Z", Level: "ERROR", Message: "Database connection failed"},
		{Timestamp: "2023-01-01T10:03:00Z", Level: "INFO", Message: "Application stopped"},
	}

	for _, entry := range logEntries {
		err = encoder.Encode(entry)
		if err != nil {
			fmt.Printf("Error encoding JSON: %v\n", err)
			return
		}
	}

	fmt.Println("JSON streamed to file successfully")

	// Read and decode the streamed JSON
	file, err = os.Open("log.json")
	if err != nil {
		fmt.Printf("Error opening file: %v\n", err)
		return
	}
	defer file.Close()

	decoder := json.NewDecoder(file)

	fmt.Println("Reading streamed JSON:")
	for {
		var entry LogEntry
		err = decoder.Decode(&entry)
		if err != nil {
			if err.Error() == "EOF" {
				break
			}
			fmt.Printf("Error decoding JSON: %v\n", err)
			return
		}
		fmt.Printf("  %+v\n", entry)
	}
}


