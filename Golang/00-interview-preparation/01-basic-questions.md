# Basic Go Interview Questions

## Language Fundamentals

### 1. What is Go and what are its key features?

**Answer:**
Go is a statically typed, compiled programming language designed by Google. Key features:

- **Simplicity**: Clean, readable syntax
- **Performance**: Compiled language with fast execution
- **Concurrency**: Built-in support with goroutines and channels
- **Garbage Collection**: Automatic memory management
- **Cross-platform**: Write once, run anywhere
- **Fast compilation**: Quick build times
- **Static typing**: Type safety at compile time

### 2. What is the difference between `var` and `:=` in Go?

**Answer:**

- `var` declares a variable with explicit type: `var name string`
- `:=` is short variable declaration with type inference: `name := "John"`
- `var` can be used at package level, `:=` only inside functions
- `var` allows zero value initialization, `:=` requires an initial value

```go
var name string        // Zero value: ""
age := 25             // Type inferred as int
var count int = 10    // Explicit type and value
```

### 3. What are the zero values in Go?

**Answer:**
Zero values are default values assigned to variables when no explicit initialization is provided:

- **Numeric types**: `0`
- **Boolean**: `false`
- **String**: `""` (empty string)
- **Pointers, slices, maps, channels, functions, interfaces**: `nil`

```go
var i int           // 0
var f float64       // 0.0
var b bool          // false
var s string        // ""
var p *int          // nil
var slice []int     // nil
var m map[string]int // nil
```

### 4. Explain the difference between arrays and slices in Go.

**Answer:**
**Arrays:**

- Fixed size: `var arr [5]int`
- Value type (copied when passed to functions)
- Size is part of the type
- Zero value is array with zero values

**Slices:**

- Dynamic size: `var slice []int`
- Reference type (points to underlying array)
- Can grow and shrink
- Zero value is `nil`

```go
// Array
var arr [3]int = [3]int{1, 2, 3}

// Slice
slice := []int{1, 2, 3}
slice = append(slice, 4) // Can grow
```

### 5. What is the difference between `make()` and `new()`?

**Answer:**

- `new(T)` allocates memory and returns a pointer to the zero value of type T
- `make(T, args)` creates and initializes slices, maps, or channels

```go
// new() - returns pointer to zero value
p := new(int)        // *int pointing to 0
s := new([]int)      // *[]int pointing to nil slice

// make() - creates and initializes
slice := make([]int, 5)     // slice with length 5
m := make(map[string]int)   // empty map
ch := make(chan int)        // unbuffered channel
```

## Functions and Methods

### 6. What is the difference between a function and a method in Go?

**Answer:**

- **Function**: Standalone code block that can be called independently
- **Method**: Function associated with a specific type (receiver)

```go
// Function
func Add(a, b int) int {
    return a + b
}

// Method
type Rectangle struct {
    Width, Height float64
}

func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}
```

### 7. What are the different ways to pass parameters to functions in Go?

**Answer:**

1. **Pass by value**: Copy of the value is passed
2. **Pass by reference**: Pointer to the value is passed
3. **Variadic parameters**: Variable number of arguments

```go
// Pass by value
func byValue(x int) {
    x = 100 // Doesn't affect original
}

// Pass by reference
func byReference(x *int) {
    *x = 100 // Affects original
}

// Variadic
func sum(nums ...int) int {
    total := 0
    for _, num := range nums {
        total += num
    }
    return total
}
```

### 8. What is a closure in Go?

**Answer:**
A closure is a function that captures variables from its surrounding scope. The function can access and modify these variables even after the outer function returns.

```go
func createCounter() func() int {
    count := 0
    return func() int {
        count++
        return count
    }
}

counter := createCounter()
fmt.Println(counter()) // 1
fmt.Println(counter()) // 2
fmt.Println(counter()) // 3
```

## Error Handling

### 9. How does error handling work in Go?

**Answer:**
Go uses explicit error handling with the `error` interface. Functions return errors as a second return value.

```go
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

// Usage
result, err := divide(10, 0)
if err != nil {
    log.Fatal(err)
}
```

### 10. What is the difference between `panic` and `error`?

**Answer:**

- **Error**: Expected failure that should be handled gracefully
- **Panic**: Unexpected error that stops program execution

```go
// Error - expected failure
func readFile(filename string) ([]byte, error) {
    if filename == "" {
        return nil, errors.New("filename cannot be empty")
    }
    // ... file reading logic
}

// Panic - unexpected error
func mustReadFile(filename string) []byte {
    data, err := readFile(filename)
    if err != nil {
        panic(err) // Program stops
    }
    return data
}
```

## Data Structures

### 11. How do you create and use maps in Go?

**Answer:**
Maps are key-value pairs. They must be initialized before use.

```go
// Declaration and initialization
ages := make(map[string]int)
ages["Alice"] = 25
ages["Bob"] = 30

// Literal initialization
colors := map[string]string{
    "red":   "#FF0000",
    "green": "#00FF00",
    "blue":  "#0000FF",
}

// Check if key exists
if age, exists := ages["Charlie"]; exists {
    fmt.Println("Charlie's age:", age)
} else {
    fmt.Println("Charlie not found")
}

// Delete key
delete(ages, "Alice")
```

### 12. What are structs and how do you use them?

**Answer:**
Structs are user-defined types that group related data together.

```go
type Person struct {
    Name    string
    Age     int
    Email   string
    Address Address
}

type Address struct {
    Street string
    City   string
    State  string
}

// Create struct
person := Person{
    Name:  "John Doe",
    Age:   30,
    Email: "john@example.com",
    Address: Address{
        Street: "123 Main St",
        City:   "New York",
        State:  "NY",
    },
}

// Access fields
fmt.Println(person.Name)
fmt.Println(person.Address.City)
```

### 13. What is struct embedding in Go?

**Answer:**
Struct embedding allows one struct to include another struct, inheriting its fields and methods.

```go
type Animal struct {
    Name string
    Age  int
}

func (a Animal) Speak() {
    fmt.Println("Some sound")
}

type Dog struct {
    Animal        // Embedded struct
    Breed  string
}

// Usage
dog := Dog{
    Animal: Animal{Name: "Buddy", Age: 3},
    Breed:  "Golden Retriever",
}

fmt.Println(dog.Name)  // Access embedded field
dog.Speak()            // Call embedded method
```

## Package System

### 14. How does the package system work in Go?

**Answer:**

- Every Go file belongs to a package
- `main` package creates an executable
- Package name determines visibility (uppercase = exported, lowercase = private)
- Import paths are URLs to the package location

```go
// In file: math/calculator.go
package math

// Exported function (uppercase)
func Add(a, b int) int {
    return a + b
}

// Private function (lowercase)
func multiply(a, b int) int {
    return a * b
}

// In another file
import "yourproject/math"

result := math.Add(5, 3) // Can access exported function
```

### 15. What is the `init()` function?

**Answer:**
The `init()` function is called automatically when a package is imported. It's used for package initialization.

```go
package main

import "fmt"

var globalVar string

func init() {
    globalVar = "Initialized in init()"
    fmt.Println("Package initialized")
}

func main() {
    fmt.Println("Main function")
    fmt.Println(globalVar)
}
```

## Type System

### 16. What is type assertion in Go?

**Answer:**
Type assertion is used to extract the concrete value from an interface.

```go
var i interface{} = "hello"

// Safe type assertion
s, ok := i.(string)
if ok {
    fmt.Println("String:", s)
}

// Type assertion that might panic
s2 := i.(string)
fmt.Println("String:", s2)

// Type switch
switch v := i.(type) {
case string:
    fmt.Println("String:", v)
case int:
    fmt.Println("Integer:", v)
default:
    fmt.Println("Unknown type")
}
```

### 17. What are interfaces in Go?

**Answer:**
Interfaces define a set of methods. A type implements an interface implicitly if it has all the required methods.

```go
type Writer interface {
    Write([]byte) (int, error)
}

type File struct {
    name string
}

func (f File) Write(data []byte) (int, error) {
    // Implementation
    return len(data), nil
}

// File implements Writer interface implicitly
var w Writer = File{name: "test.txt"}
```

## Memory Management

### 18. How does garbage collection work in Go?

**Answer:**
Go uses a concurrent, tri-color mark-and-sweep garbage collector:

- **Concurrent**: Runs alongside the program
- **Low latency**: Minimal pause times
- **Automatic**: No manual memory management needed
- **Generational**: Optimized for short-lived objects

### 19. What is the difference between stack and heap in Go?

**Answer:**

- **Stack**: Fast, automatic cleanup, limited size, for local variables
- **Heap**: Slower, garbage collected, larger size, for dynamically allocated memory

Go compiler decides where to allocate memory based on escape analysis.

## Best Practices

### 20. What are some Go best practices?

**Answer:**

- **Error handling**: Always check errors explicitly
- **Naming**: Use camelCase for private, PascalCase for public
- **Package organization**: Keep related functionality together
- **Documentation**: Use godoc comments for public APIs
- **Testing**: Write tests for your code
- **Simplicity**: Prefer simple, readable code over clever code
- **Composition**: Use composition over inheritance
- **Concurrency**: Use channels for communication, mutexes for sharing

---

## Quick Practice Questions

1. **What will this code output?**

```go
package main
import "fmt"

func main() {
    var x int
    fmt.Println(x)
}
```

2. **What's wrong with this code?**

```go
func main() {
    var m map[string]int
    m["key"] = 1
}
```

3. **What will this code output?**

```go
func main() {
    s := []int{1, 2, 3}
    modify(s)
    fmt.Println(s)
}

func modify(s []int) {
    s[0] = 100
}
```

**Answers:**

1. `0` (zero value for int)
2. Panic - map is nil, need to initialize with `make()`
3. `[100 2 3]` (slices are reference types)


