# Go Programming Language - Complete Learning Guide

This repository contains a comprehensive guide to learning Go programming language with practical examples and explanations.

## Table of Contents

### 1. Basic Syntax & Fundamentals

- [Variables and Constants](01-basic-syntax/variables.go) - Declaration, initialization, and scoping
- [Data Types](01-basic-syntax/data-types.go) - Primitive types, type conversion, and type assertions
- [Functions](01-basic-syntax/functions.go) - Function declaration, parameters, return values, and variadic functions
- [Packages and Imports](01-basic-syntax/packages.go) - Package structure, imports, and visibility

### 2. Control Flow

- [Conditional Statements](02-control-flow/conditionals.go) - if/else statements and logical operators
- [Loops](02-control-flow/loops.go) - for loops, range loops, and loop control
- [Switch Statements](02-control-flow/switch.go) - switch expressions and type switches

### 3. Data Structures

- [Arrays and Slices](03-data-structures/arrays-slices.go) - Fixed arrays and dynamic slices
- [Maps](03-data-structures/maps.go) - Hash maps and key-value pairs
- [Structs](03-data-structures/structs.go) - Custom types and methods
- [Pointers](03-data-structures/pointers.go) - Memory addresses and dereferencing

### 4. Advanced Concepts

- [Interfaces](04-advanced/interfaces.go) - Interface definition and implementation
- [Goroutines](04-advanced/goroutines.go) - Concurrent programming with goroutines
- [Channels](04-advanced/channels.go) - Communication between goroutines
- [Select Statement](04-advanced/select.go) - Channel multiplexing

### 5. Error Handling

- [Error Handling](05-error-handling/errors.go) - Error types, custom errors, and best practices
- [Panic and Recover](05-error-handling/panic-recover.go) - Exception handling in Go

### 6. File Operations & I/O

- [File Operations](06-io/file-operations.go) - Reading and writing files
- [JSON Handling](06-io/json.go) - JSON marshaling and unmarshaling
- [HTTP Client](06-io/http-client.go) - Making HTTP requests

### 7. Testing

- [Unit Testing](07-testing/testing.go) - Writing and running tests
- [Benchmarking](07-testing/benchmarking.go) - Performance testing

## Getting Started

1. Install Go from [golang.org](https://golang.org/dl/)
2. Set up your Go workspace
3. Navigate to each topic folder and run the examples:
   ```bash
   go run filename.go
   ```

## Key Go Concepts

### Why Go?

- **Simplicity**: Clean, readable syntax
- **Performance**: Compiled language with fast execution
- **Concurrency**: Built-in support for concurrent programming
- **Cross-platform**: Write once, run anywhere
- **Garbage Collection**: Automatic memory management

### Go Philosophy

- **Simplicity over complexity**
- **Explicit over implicit**
- **Composition over inheritance**
- **Concurrency as a first-class citizen**

## Best Practices

1. **Naming Conventions**: Use camelCase for private, PascalCase for public
2. **Error Handling**: Always handle errors explicitly
3. **Package Organization**: Keep related functionality together
4. **Documentation**: Use godoc comments for public APIs
5. **Testing**: Write tests for your code

## Resources

- [Official Go Documentation](https://golang.org/doc/)
- [Go by Example](https://gobyexample.com/)
- [Effective Go](https://golang.org/doc/effective_go.html)
- [Go Tour](https://tour.golang.org/)

---

Happy coding in Go! 🚀
