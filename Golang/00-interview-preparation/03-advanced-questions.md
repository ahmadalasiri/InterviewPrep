# Advanced Go Interview Questions

## Interfaces and Type System

### 1. What is the empty interface and when should you use it?

**Answer:**
The empty interface `interface{}` can hold values of any type. It's useful for:

- Generic containers
- JSON unmarshaling
- Function parameters that accept any type

```go
// Empty interface
var i interface{}
i = 42
i = "hello"
i = []int{1, 2, 3}

// Type assertion
if str, ok := i.(string); ok {
    fmt.Println("String:", str)
}

// Type switch
switch v := i.(type) {
case int:
    fmt.Println("Integer:", v)
case string:
    fmt.Println("String:", v)
default:
    fmt.Println("Unknown type")
}
```

**When to use:**

- When you need to store values of unknown types
- For generic data structures
- When interfacing with external systems

**When NOT to use:**

- When you know the specific types
- For performance-critical code
- When type safety is important

### 2. How do you implement interface composition in Go?

**Answer:**
Interface composition allows you to combine multiple interfaces:

```go
// Base interfaces
type Reader interface {
    Read([]byte) (int, error)
}

type Writer interface {
    Write([]byte) (int, error)
}

type Closer interface {
    Close() error
}

// Composed interface
type ReadWriteCloser interface {
    Reader
    Writer
    Closer
}

// Implementation
type File struct {
    name string
}

func (f File) Read(data []byte) (int, error) {
    // Implementation
    return len(data), nil
}

func (f File) Write(data []byte) (int, error) {
    // Implementation
    return len(data), nil
}

func (f File) Close() error {
    // Implementation
    return nil
}

// File implements ReadWriteCloser automatically
```

### 3. What is the difference between type assertion and type switch?

**Answer:**
Both are used to extract concrete types from interfaces, but with different use cases:

**Type Assertion:**

```go
var i interface{} = "hello"

// Safe assertion
s, ok := i.(string)
if ok {
    fmt.Println("String:", s)
}

// Unsafe assertion (panics if wrong type)
s2 := i.(string)
```

**Type Switch:**

```go
var i interface{} = 42

switch v := i.(type) {
case string:
    fmt.Println("String:", v)
case int:
    fmt.Println("Integer:", v)
case bool:
    fmt.Println("Boolean:", v)
default:
    fmt.Println("Unknown type")
}
```

**When to use:**

- Type assertion: When you expect a specific type
- Type switch: When you need to handle multiple possible types

## Reflection

### 4. What is reflection in Go and when should you use it?

**Answer:**
Reflection allows you to examine and manipulate types and values at runtime:

```go
import "reflect"

type Person struct {
    Name string `json:"name"`
    Age  int    `json:"age"`
}

func inspectStruct(v interface{}) {
    t := reflect.TypeOf(v)
    val := reflect.ValueOf(v)

    for i := 0; i < t.NumField(); i++ {
        field := t.Field(i)
        value := val.Field(i)

        fmt.Printf("Field: %s, Type: %s, Value: %v, Tag: %s\n",
            field.Name, field.Type, value, field.Tag.Get("json"))
    }
}

// Usage
p := Person{Name: "John", Age: 30}
inspectStruct(p)
```

**When to use:**

- JSON/XML marshaling/unmarshaling
- ORM libraries
- Configuration systems
- Generic programming

**When NOT to use:**

- Performance-critical code
- When compile-time type safety is preferred
- Simple use cases where direct access is possible

### 5. How do you create a generic function using reflection?

**Answer:**
Using reflection to create functions that work with different types:

```go
func DeepEqual(a, b interface{}) bool {
    return reflect.DeepEqual(a, b)
}

func CopySlice(src interface{}) interface{} {
    srcVal := reflect.ValueOf(src)
    if srcVal.Kind() != reflect.Slice {
        panic("src must be a slice")
    }

    dst := reflect.MakeSlice(srcVal.Type(), srcVal.Len(), srcVal.Cap())
    reflect.Copy(dst, srcVal)
    return dst.Interface()
}

func SetField(obj interface{}, fieldName string, value interface{}) error {
    objVal := reflect.ValueOf(obj)
    if objVal.Kind() != reflect.Ptr {
        return errors.New("obj must be a pointer")
    }

    field := objVal.Elem().FieldByName(fieldName)
    if !field.IsValid() {
        return errors.New("field not found")
    }

    if !field.CanSet() {
        return errors.New("field cannot be set")
    }

    field.Set(reflect.ValueOf(value))
    return nil
}
```

## Generics (Go 1.18+)

### 6. How do you use generics in Go?

**Answer:**
Generics allow you to write code that works with multiple types:

```go
// Generic function
func Max[T comparable](a, b T) T {
    if a > b {
        return a
    }
    return b
}

// Generic type
type Stack[T any] struct {
    items []T
}

func (s *Stack[T]) Push(item T) {
    s.items = append(s.items, item)
}

func (s *Stack[T]) Pop() (T, bool) {
    if len(s.items) == 0 {
        var zero T
        return zero, false
    }

    item := s.items[len(s.items)-1]
    s.items = s.items[:len(s.items)-1]
    return item, true
}

// Usage
intStack := &Stack[int]{}
intStack.Push(1)
intStack.Push(2)

stringStack := &Stack[string]{}
stringStack.Push("hello")
stringStack.Push("world")
```

### 7. What are type constraints in Go generics?

**Answer:**
Type constraints limit which types can be used with generics:

```go
// Built-in constraints
func Print[T any](value T) {
    fmt.Println(value)
}

func Compare[T comparable](a, b T) bool {
    return a == b
}

// Custom constraint
type Numeric interface {
    ~int | ~float64 | ~int64
}

func Sum[T Numeric](values []T) T {
    var sum T
    for _, v := range values {
        sum += v
    }
    return sum
}

// Interface constraint
type Stringer interface {
    String() string
}

func PrintString[T Stringer](value T) {
    fmt.Println(value.String())
}
```

## Memory Management

### 8. How does Go's garbage collector work?

**Answer:**
Go uses a concurrent, tri-color mark-and-sweep garbage collector:

**Phases:**

1. **Mark**: Identifies reachable objects
2. **Sweep**: Frees unreachable objects
3. **Concurrent**: Runs alongside the program

**Key features:**

- **Low latency**: Minimal pause times
- **Concurrent**: Doesn't stop the program
- **Generational**: Optimized for short-lived objects
- **Write barriers**: Tracks pointer writes during GC

```go
// Force garbage collection (usually not needed)
runtime.GC()

// Get memory stats
var m runtime.MemStats
runtime.ReadMemStats(&m)
fmt.Printf("Heap size: %d bytes\n", m.HeapAlloc)
```

### 9. What is escape analysis in Go?

**Answer:**
Escape analysis determines whether variables should be allocated on the stack or heap:

```go
// Stack allocation (local variable)
func stackAllocation() int {
    x := 42 // Allocated on stack
    return x
}

// Heap allocation (escapes to caller)
func heapAllocation() *int {
    x := 42 // Allocated on heap (escapes)
    return &x
}

// Heap allocation (interface)
func interfaceAllocation() interface{} {
    x := 42 // Allocated on heap (interface{} can hold any type)
    return x
}
```

**View escape analysis:**

```bash
go build -gcflags="-m" your_file.go
```

## Performance Optimization

### 10. How do you profile Go applications?

**Answer:**
Go provides built-in profiling tools:

```go
import _ "net/http/pprof"

func main() {
    go func() {
        log.Println(http.ListenAndServe("localhost:6060", nil))
    }()

    // Your application code
}

// Profile types:
// - CPU: go tool pprof http://localhost:6060/debug/pprof/profile
// - Memory: go tool pprof http://localhost:6060/debug/pprof/heap
// - Goroutines: go tool pprof http://localhost:6060/debug/pprof/goroutine
// - Blocking: go tool pprof http://localhost:6060/debug/pprof/block
```

### 11. How do you optimize Go code performance?

**Answer:**
Performance optimization strategies:

**1. Use appropriate data structures**

```go
// Use slices instead of arrays when size varies
// Use maps for O(1) lookups
// Use sync.Pool for object reuse
```

**2. Avoid unnecessary allocations**

```go
// Bad: Creates new slice each time
func process(data []int) []int {
    result := make([]int, 0)
    for _, v := range data {
        result = append(result, v*2)
    }
    return result
}

// Good: Pre-allocate with known size
func process(data []int) []int {
    result := make([]int, len(data))
    for i, v := range data {
        result[i] = v * 2
    }
    return result
}
```

**3. Use string builders for string concatenation**

```go
// Bad: Creates new string each time
func buildString(parts []string) string {
    result := ""
    for _, part := range parts {
        result += part
    }
    return result
}

// Good: Use strings.Builder
func buildString(parts []string) string {
    var builder strings.Builder
    for _, part := range parts {
        builder.WriteString(part)
    }
    return builder.String()
}
```

## Advanced Patterns

### 12. How do you implement the Builder pattern in Go?

**Answer:**
Builder pattern for constructing complex objects:

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

type PersonBuilder struct {
    person Person
}

func NewPersonBuilder() *PersonBuilder {
    return &PersonBuilder{}
}

func (pb *PersonBuilder) SetName(name string) *PersonBuilder {
    pb.person.Name = name
    return pb
}

func (pb *PersonBuilder) SetAge(age int) *PersonBuilder {
    pb.person.Age = age
    return pb
}

func (pb *PersonBuilder) SetEmail(email string) *PersonBuilder {
    pb.person.Email = email
    return pb
}

func (pb *PersonBuilder) SetAddress(street, city, state string) *PersonBuilder {
    pb.person.Address = Address{
        Street: street,
        City:   city,
        State:  state,
    }
    return pb
}

func (pb *PersonBuilder) Build() Person {
    return pb.person
}

// Usage
person := NewPersonBuilder().
    SetName("John Doe").
    SetAge(30).
    SetEmail("john@example.com").
    SetAddress("123 Main St", "New York", "NY").
    Build()
```

### 13. How do you implement the Observer pattern in Go?

**Answer:**
Observer pattern for event-driven programming:

```go
type Event struct {
    Type string
    Data interface{}
}

type Observer interface {
    Notify(event Event)
}

type Subject struct {
    observers []Observer
    mu        sync.RWMutex
}

func (s *Subject) Subscribe(observer Observer) {
    s.mu.Lock()
    defer s.mu.Unlock()
    s.observers = append(s.observers, observer)
}

func (s *Subject) Unsubscribe(observer Observer) {
    s.mu.Lock()
    defer s.mu.Unlock()
    for i, obs := range s.observers {
        if obs == observer {
            s.observers = append(s.observers[:i], s.observers[i+1:]...)
            break
        }
    }
}

func (s *Subject) NotifyObservers(event Event) {
    s.mu.RLock()
    observers := make([]Observer, len(s.observers))
    copy(observers, s.observers)
    s.mu.RUnlock()

    for _, observer := range observers {
        go observer.Notify(event)
    }
}

// Concrete observer
type Logger struct {
    name string
}

func (l Logger) Notify(event Event) {
    fmt.Printf("[%s] Event: %s, Data: %v\n", l.name, event.Type, event.Data)
}
```

### 14. How do you implement dependency injection in Go?

**Answer:**
Dependency injection for loose coupling:

```go
// Interfaces
type Database interface {
    Save(data interface{}) error
    Find(id string) (interface{}, error)
}

type Logger interface {
    Log(message string)
}

// Concrete implementations
type MySQLDatabase struct{}

func (m MySQLDatabase) Save(data interface{}) error {
    // Implementation
    return nil
}

func (m MySQLDatabase) Find(id string) (interface{}, error) {
    // Implementation
    return nil, nil
}

type FileLogger struct{}

func (f FileLogger) Log(message string) {
    fmt.Println("Log:", message)
}

// Service with dependencies
type UserService struct {
    db     Database
    logger Logger
}

func NewUserService(db Database, logger Logger) *UserService {
    return &UserService{
        db:     db,
        logger: logger,
    }
}

func (s *UserService) CreateUser(user interface{}) error {
    s.logger.Log("Creating user")
    return s.db.Save(user)
}

// Usage
db := MySQLDatabase{}
logger := FileLogger{}
userService := NewUserService(db, logger)
```

## Testing and Quality

### 15. How do you write comprehensive tests in Go?

**Answer:**
Comprehensive testing strategies:

```go
// Unit tests
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a        int
        b        int
        expected int
    }{
        {"positive numbers", 2, 3, 5},
        {"negative numbers", -2, -3, -5},
        {"zero", 0, 5, 5},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := Add(tt.a, tt.b)
            if result != tt.expected {
                t.Errorf("Add(%d, %d) = %d; expected %d",
                    tt.a, tt.b, result, tt.expected)
            }
        })
    }
}

// Integration tests
func TestDatabaseIntegration(t *testing.T) {
    // Setup test database
    db := setupTestDB(t)
    defer cleanupTestDB(t, db)

    // Test database operations
    user := User{Name: "Test User"}
    err := db.Save(user)
    if err != nil {
        t.Fatalf("Failed to save user: %v", err)
    }

    found, err := db.Find(user.ID)
    if err != nil {
        t.Fatalf("Failed to find user: %v", err)
    }

    if found.Name != user.Name {
        t.Errorf("Expected %s, got %s", user.Name, found.Name)
    }
}

// Benchmark tests
func BenchmarkStringConcatenation(b *testing.B) {
    for i := 0; i < b.N; i++ {
        _ = strings.Join([]string{"a", "b", "c"}, "")
    }
}
```

### 16. How do you handle errors in Go applications?

**Answer:**
Comprehensive error handling strategies:

```go
// Custom error types
type ValidationError struct {
    Field   string
    Message string
}

func (e ValidationError) Error() string {
    return fmt.Sprintf("validation error on field '%s': %s", e.Field, e.Message)
}

// Error wrapping
func processFile(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return fmt.Errorf("failed to process file '%s': %w", filename, err)
    }
    defer file.Close()

    // Process file
    return nil
}

// Error aggregation
type MultiError struct {
    Errors []error
}

func (me MultiError) Error() string {
    var messages []string
    for _, err := range me.Errors {
        messages = append(messages, err.Error())
    }
    return strings.Join(messages, "; ")
}

func (me *MultiError) Add(err error) {
    if err != nil {
        me.Errors = append(me.Errors, err)
    }
}

func (me MultiError) HasErrors() bool {
    return len(me.Errors) > 0
}
```

## Practice Questions

### 17. What will this code output?

```go
func main() {
    var i interface{} = 42
    switch v := i.(type) {
    case int:
        fmt.Println("int:", v)
    case string:
        fmt.Println("string:", v)
    default:
        fmt.Println("unknown")
    }
}
```

### 18. How would you implement a generic cache?

```go
type Cache[K comparable, V any] struct {
    mu    sync.RWMutex
    items map[K]V
}

func NewCache[K comparable, V any]() *Cache[K, V] {
    return &Cache[K, V]{
        items: make(map[K]V),
    }
}

func (c *Cache[K, V]) Set(key K, value V) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.items[key] = value
}

func (c *Cache[K, V]) Get(key K) (V, bool) {
    c.mu.RLock()
    defer c.mu.RUnlock()
    value, exists := c.items[key]
    return value, exists
}
```

### 19. What's the difference between these two approaches?

```go
// Approach 1
func process(data []int) []int {
    result := make([]int, 0)
    for _, v := range data {
        result = append(result, v*2)
    }
    return result
}

// Approach 2
func process(data []int) []int {
    result := make([]int, len(data))
    for i, v := range data {
        result[i] = v * 2
    }
    return result
}
```

**Answer:** Approach 2 is more efficient because it pre-allocates the slice with the exact size needed, avoiding multiple reallocations that happen with `append()`.

---

## Key Takeaways

1. **Interfaces are powerful** - Use them for abstraction and testability
2. **Reflection has a cost** - Use it judiciously and consider alternatives
3. **Generics provide type safety** - Use them for reusable, type-safe code
4. **Memory management matters** - Understand allocation patterns
5. **Profile before optimizing** - Measure performance bottlenecks
6. **Test comprehensively** - Unit, integration, and benchmark tests
7. **Handle errors explicitly** - Don't ignore or panic unnecessarily


