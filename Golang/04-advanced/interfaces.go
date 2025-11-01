package main

import (
	"fmt"
	"math"
)

/*
===========================================
INTERVIEW QUESTIONS & ANSWERS - Interfaces
===========================================

Q1: What is an interface in Go and how is it different from other languages?
A: An interface in Go is a type that specifies a set of method signatures. Key differences:
   - Implicit implementation: No explicit "implements" keyword needed
   - A type satisfies an interface by implementing all its methods
   - Duck typing: "If it walks like a duck and quacks like a duck, it's a duck"
   - This allows for flexible, decoupled code design

Q2: What is the empty interface and when would you use it?
A: The empty interface (interface{} or any in Go 1.18+) can hold values of any type because
   every type implements zero methods.
   Use cases:
   - Generic containers before generics (Go < 1.18)
   - Working with unknown types (JSON unmarshaling, reflection)
   - Printf-style functions
   Caution: Use sparingly as it sacrifices type safety

Q3: What is a type assertion and how do you use it safely?
A: Type assertion extracts the concrete value from an interface.
   Syntax:
   - value := i.(Type)           // Panics if wrong type
   - value, ok := i.(Type)       // Safe version, ok is false if wrong type
   Always use the safe version in production code to avoid panics.

Q4: What is a type switch?
A: A type switch is used to determine the type of an interface value:
   switch v := i.(type) {
   case int:
       // v is int
   case string:
       // v is string
   default:
       // unknown type
   }
   Note: The type keyword is used, not the actual type.

Q5: What are the best practices for designing interfaces?
A: - Keep interfaces small (single method is ideal)
   - Define interfaces where they're used, not where types are defined
   - Accept interfaces, return concrete types
   - Name single-method interfaces with "-er" suffix (Reader, Writer, Closer)
   - Compose small interfaces into larger ones when needed
   - Don't overuse empty interface

Q6: Can you explain interface composition?
A: Interface composition allows building larger interfaces from smaller ones:
   type Reader interface { Read([]byte) (int, error) }
   type Writer interface { Write([]byte) (int, error) }
   type ReadWriter interface { Reader; Writer }
   Benefits: Modularity, reusability, single responsibility principle

Q7: What is the difference between value receivers and pointer receivers for interface methods?
A: - Value receiver: Method can be called on values and pointers
   - Pointer receiver: Method can only be called on pointers
   If an interface method has a pointer receiver, only pointer types satisfy that interface.
   Example: If type T has method with *T receiver, only *T satisfies the interface, not T.

Q8: How are interfaces implemented internally in Go?
A: Interfaces are represented as a pair (type, value):
   - For non-empty interface: (type descriptor, value)
   - For empty interface: (type info, value)
   An interface is nil only if both type and value are nil.
   An interface with a nil value but non-nil type is not nil.

Q9: What is the Stringer interface and why is it useful?
A: Stringer is a built-in interface in the fmt package:
   type Stringer interface {
       String() string
   }
   Types implementing Stringer control how they're printed by fmt functions.
   Similar to toString() in other languages.

Q10: Can you have an interface with no methods besides the empty interface?
A: Yes, you can define custom marker interfaces (interfaces with zero methods) to:
   - Create semantic meaning (e.g., type assertions)
   - Document intent
   - Type-level constraints
   However, they're essentially equivalent to interface{} functionality-wise.
   In modern Go, consider using type constraints with generics instead.
*/

// Interfaces in Go
func main() {
	fmt.Println("=== Interfaces in Go ===")
	
	// 1. Basic interface usage
	basicInterfaceDemo()
	
	// 2. Interface implementation
	interfaceImplementationDemo()
	
	// 3. Empty interface
	emptyInterfaceDemo()
	
	// 4. Type assertions
	typeAssertionsDemo()
	
	// 5. Interface composition
	interfaceCompositionDemo()
	
	// 6. Interface best practices
	interfaceBestPracticesDemo()
}

// Basic interface definition
type Shape interface {
	Area() float64
	Perimeter() float64
}

type Drawable interface {
	Draw()
}

// Concrete types implementing the interface
type Rectangle struct {
	Width, Height float64
}

func (r Rectangle) Area() float64 {
	return r.Width * r.Height
}

func (r Rectangle) Perimeter() float64 {
	return 2 * (r.Width + r.Height)
}

func (r Rectangle) Draw() {
	fmt.Printf("Drawing a rectangle with width %.2f and height %.2f\n", r.Width, r.Height)
}

type Circle struct {
	Radius float64
}

func (c Circle) Area() float64 {
	return math.Pi * c.Radius * c.Radius
}

func (c Circle) Perimeter() float64 {
	return 2 * math.Pi * c.Radius
}

func (c Circle) Draw() {
	fmt.Printf("Drawing a circle with radius %.2f\n", c.Radius)
}

type Triangle struct {
	Base, Height float64
}

func (t Triangle) Area() float64 {
	return 0.5 * t.Base * t.Height
}

func (t Triangle) Perimeter() float64 {
	// Simplified - assuming right triangle
	hypotenuse := math.Sqrt(t.Base*t.Base + t.Height*t.Height)
	return t.Base + t.Height + hypotenuse
}

// basicInterfaceDemo demonstrates basic interface usage with polymorphism
// Shows how different types can satisfy the same interface
func basicInterfaceDemo() {
	fmt.Println("\n--- Basic Interface Usage ---")
	
	// Create shapes
	shapes := []Shape{
		Rectangle{Width: 5, Height: 3},
		Circle{Radius: 4},
		Triangle{Base: 6, Height: 4},
	}
	
	// Use interface methods
	for i, shape := range shapes {
		fmt.Printf("Shape %d:\n", i+1)
		fmt.Printf("  Area: %.2f\n", shape.Area())
		fmt.Printf("  Perimeter: %.2f\n", shape.Perimeter())
		fmt.Println()
	}
	
	// Interface as function parameter
	printShapeInfo(Rectangle{Width: 10, Height: 5})
	printShapeInfo(Circle{Radius: 3})
}

// printShapeInfo accepts any type that implements the Shape interface
// Demonstrates interface as a function parameter for polymorphism
func printShapeInfo(s Shape) {
	fmt.Printf("Shape info - Area: %.2f, Perimeter: %.2f\n", s.Area(), s.Perimeter())
}

// interfaceImplementationDemo shows implicit interface implementation
// Go doesn't require explicit "implements" keyword - types automatically satisfy interfaces
func interfaceImplementationDemo() {
	fmt.Println("\n--- Interface Implementation ---")
	
	// Go uses implicit interface implementation
	// A type implements an interface if it has all the required methods
	
	var shape Shape
	var drawable Drawable
	
	// Rectangle implements both Shape and Drawable
	rect := Rectangle{Width: 4, Height: 6}
	shape = rect
	drawable = rect
	
	fmt.Printf("Rectangle as Shape: Area = %.2f\n", shape.Area())
	drawable.Draw()
	
	// Circle also implements both interfaces
	circle := Circle{Radius: 5}
	shape = circle
	drawable = circle
	
	fmt.Printf("Circle as Shape: Area = %.2f\n", shape.Area())
	drawable.Draw()
	
	// Triangle only implements Shape (no Draw method)
	triangle := Triangle{Base: 8, Height: 6}
	shape = triangle
	// drawable = triangle // This would cause a compile error
	
	fmt.Printf("Triangle as Shape: Area = %.2f\n", shape.Area())
}

// emptyInterfaceDemo demonstrates interface{} which can hold any type
// The empty interface is satisfied by all types since it has zero methods
func emptyInterfaceDemo() {
	fmt.Println("\n--- Empty Interface ---")
	
	// Empty interface can hold any type
	var anything interface{}
	
	// Can hold different types
	anything = 42
	fmt.Printf("Integer: %v (type: %T)\n", anything, anything)
	
	anything = "Hello, World!"
	fmt.Printf("String: %v (type: %T)\n", anything, anything)
	
	anything = []int{1, 2, 3}
	fmt.Printf("Slice: %v (type: %T)\n", anything, anything)
	
	anything = Rectangle{Width: 5, Height: 3}
	fmt.Printf("Struct: %v (type: %T)\n", anything, anything)
	
	// Function that accepts any type
	printAnyType(42)
	printAnyType("Go is awesome!")
	printAnyType([]string{"a", "b", "c"})
	printAnyType(map[string]int{"one": 1, "two": 2})
}

// printAnyType accepts any type using the empty interface
// Useful for generic functions that need to handle multiple types
func printAnyType(value interface{}) {
	fmt.Printf("Value: %v, Type: %T\n", value, value)
}

// typeAssertionsDemo demonstrates type assertions and type switches
// Shows how to extract concrete types from interface values
func typeAssertionsDemo() {
	fmt.Println("\n--- Type Assertions ---")
	
	// Type assertion with interface{}
	var value interface{} = "Hello, Go!"
	
	// Safe type assertion
	if str, ok := value.(string); ok {
		fmt.Printf("It's a string: %s\n", str)
	} else {
		fmt.Println("Not a string")
	}
	
	// Type assertion that might panic
	str := value.(string)
	fmt.Printf("Direct assertion: %s\n", str)
	
	// Type switch
	values := []interface{}{42, "hello", 3.14, true, []int{1, 2, 3}}
	
	for _, v := range values {
		switch val := v.(type) {
		case int:
			fmt.Printf("Integer: %d\n", val)
		case string:
			fmt.Printf("String: %s\n", val)
		case float64:
			fmt.Printf("Float: %.2f\n", val)
		case bool:
			fmt.Printf("Boolean: %t\n", val)
		case []int:
			fmt.Printf("Int slice: %v\n", val)
		default:
			fmt.Printf("Unknown type: %T\n", val)
		}
	}
}

// interfaceCompositionDemo demonstrates composing larger interfaces from smaller ones
// Shows how to build complex interfaces using interface embedding
func interfaceCompositionDemo() {
	fmt.Println("\n--- Interface Composition ---")
	
	// Compose interfaces
	type Readable interface {
		Read() string
	}
	
	type Writable interface {
		Write(string)
	}
	
	type ReadWriter interface {
		Readable
		Writable
	}
	
	// File implements ReadWriter
	type File struct {
		content string
	}
	
	func (f *File) Read() string {
		return f.content
	}
	
	func (f *File) Write(data string) {
		f.content = data
	}
	
	// Use composed interface
	file := &File{content: "Initial content"}
	var rw ReadWriter = file
	
	fmt.Printf("Read: %s\n", rw.Read())
	rw.Write("New content")
	fmt.Printf("After write: %s\n", rw.Read())
	
	// Interface embedding in structs
	type Document struct {
		ReadWriter
		Title string
	}
	
	doc := Document{
		ReadWriter: &File{content: "Document content"},
		Title:      "My Document",
	}
	
	fmt.Printf("Document title: %s\n", doc.Title)
	fmt.Printf("Document content: %s\n", doc.Read())
}

// interfaceBestPracticesDemo showcases recommended interface design patterns
// Demonstrates the principles: small interfaces, composition, and proper naming
func interfaceBestPracticesDemo() {
	fmt.Println("\n--- Interface Best Practices ---")
	
	// 1. Keep interfaces small (prefer many small interfaces)
	type Reader interface {
		Read([]byte) (int, error)
	}
	
	type Writer interface {
		Write([]byte) (int, error)
	}
	
	type Closer interface {
		Close() error
	}
	
	// Compose when needed
	type ReadWriteCloser interface {
		Reader
		Writer
		Closer
	}
	
	// 2. Accept interfaces, return concrete types
	processor := NewProcessor()
	processor.Process("Hello, World!")
	
	// 3. Interface naming conventions
	// - Single method interfaces often end with "-er"
	// - Examples: Reader, Writer, Closer, Stringer
	
	// 4. Use interface{} sparingly
	// Prefer specific interfaces when possible
	
	fmt.Println("Best practices demonstrated!")
}

// Example of accepting interfaces, returning concrete types
type Processor struct {
	name string
}

// NewProcessor creates and returns a concrete Processor type
// Demonstrates "accept interfaces, return concrete types" pattern
func NewProcessor() *Processor {
	return &Processor{name: "Default Processor"}
}

// Process method demonstrates accepting interface-typed parameters
func (p *Processor) Process(data string) {
	fmt.Printf("Processing '%s' with %s\n", data, p.name)
}

// String implements the Stringer interface for custom string representation
// This method is automatically called by fmt.Print* functions
func (p Processor) String() string {
	return fmt.Sprintf("Processor: %s", p.name)
}


