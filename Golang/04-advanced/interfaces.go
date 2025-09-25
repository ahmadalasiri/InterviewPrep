package main

import (
	"fmt"
	"math"
)

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

func printShapeInfo(s Shape) {
	fmt.Printf("Shape info - Area: %.2f, Perimeter: %.2f\n", s.Area(), s.Perimeter())
}

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

func printAnyType(value interface{}) {
	fmt.Printf("Value: %v, Type: %T\n", value, value)
}

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

func NewProcessor() *Processor {
	return &Processor{name: "Default Processor"}
}

func (p *Processor) Process(data string) {
	fmt.Printf("Processing '%s' with %s\n", data, p.name)
}

// Stringer interface (built-in)
func (p Processor) String() string {
	return fmt.Sprintf("Processor: %s", p.name)
}


