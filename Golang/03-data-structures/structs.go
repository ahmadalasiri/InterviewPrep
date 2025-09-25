package main

import "fmt"

// Structs in Go
func main() {
	fmt.Println("=== Structs in Go ===")

	// 1. Basic struct definition and usage
	basicStructDemo()

	// 2. Struct methods
	structMethodsDemo()

	// 3. Struct embedding (composition)
	structEmbeddingDemo()

	// 4. Struct tags
	structTagsDemo()

	// 5. Anonymous structs
	anonymousStructDemo()

	// 6. Struct comparison
	structComparisonDemo()

	// 7. Struct patterns
	structPatternsDemo()
}

// Basic struct definition
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
	Zip    string
}

func basicStructDemo() {
	fmt.Println("\n--- Basic Struct Definition and Usage ---")

	// Method 1: Zero value initialization
	var person1 Person
	fmt.Printf("Zero value person: %+v\n", person1)

	// Method 2: Literal initialization
	person2 := Person{
		Name:  "Alice",
		Age:   25,
		Email: "alice@example.com",
		Address: Address{
			Street: "123 Main St",
			City:   "New York",
			State:  "NY",
			Zip:    "10001",
		},
	}
	fmt.Printf("Person 2: %+v\n", person2)

	// Method 3: Field initialization (order matters)
	person3 := Person{"Bob", 30, "bob@example.com", Address{"456 Oak Ave", "Los Angeles", "CA", "90210"}}
	fmt.Printf("Person 3: %+v\n", person3)

	// Method 4: Partial initialization
	person4 := Person{
		Name: "Carol",
		Age:  35,
		// Email and Address will be zero values
	}
	fmt.Printf("Person 4: %+v\n", person4)

	// Accessing and modifying fields
	person1.Name = "David"
	person1.Age = 28
	person1.Email = "david@example.com"
	fmt.Printf("Modified person1: %+v\n", person1)

	// Nested struct access
	person2.Address.City = "San Francisco"
	fmt.Printf("Person 2 after address change: %+v\n", person2)
}

// Methods on structs
func (p Person) GetFullInfo() string {
	return fmt.Sprintf("%s (%d years old) - %s", p.Name, p.Age, p.Email)
}

func (p Person) IsAdult() bool {
	return p.Age >= 18
}

// Method with pointer receiver (can modify the struct)
func (p *Person) HaveBirthday() {
	p.Age++
}

func (p *Person) ChangeEmail(newEmail string) {
	p.Email = newEmail
}

func structMethodsDemo() {
	fmt.Println("\n--- Struct Methods ---")

	person := Person{
		Name:  "Eve",
		Age:   17,
		Email: "eve@example.com",
	}

	// Value receiver methods
	fmt.Printf("Full info: %s\n", person.GetFullInfo())
	fmt.Printf("Is adult: %t\n", person.IsAdult())

	// Pointer receiver methods
	fmt.Printf("Age before birthday: %d\n", person.Age)
	person.HaveBirthday()
	fmt.Printf("Age after birthday: %d\n", person.Age)

	person.ChangeEmail("eve.new@example.com")
	fmt.Printf("New email: %s\n", person.Email)

	// Method on pointer vs value
	personPtr := &person
	personPtr.HaveBirthday()
	fmt.Printf("Age after pointer method: %d\n", person.Age)
}

// Embedded structs (composition)
type Employee struct {
	Person
	EmployeeID string
	Department string
	Salary     float64
}

type Manager struct {
	Employee
	TeamSize int
}

func structEmbeddingDemo() {
	fmt.Println("\n--- Struct Embedding (Composition) ---")

	// Create an employee
	employee := Employee{
		Person: Person{
			Name:  "Frank",
			Age:   32,
			Email: "frank@company.com",
		},
		EmployeeID: "EMP001",
		Department: "Engineering",
		Salary:     75000.0,
	}

	fmt.Printf("Employee: %+v\n", employee)

	// Access embedded fields directly
	fmt.Printf("Employee name: %s\n", employee.Name) // Direct access to embedded field
	fmt.Printf("Employee department: %s\n", employee.Department)

	// Create a manager
	manager := Manager{
		Employee: Employee{
			Person: Person{
				Name:  "Grace",
				Age:   40,
				Email: "grace@company.com",
			},
			EmployeeID: "MGR001",
			Department: "Engineering",
			Salary:     95000.0,
		},
		TeamSize: 8,
	}

	fmt.Printf("Manager: %+v\n", manager)
	fmt.Printf("Manager team size: %d\n", manager.TeamSize)

	// Method promotion from embedded struct
	fmt.Printf("Manager full info: %s\n", manager.GetFullInfo())
}

// Struct with tags
type User struct {
	ID       int    `json:"id" db:"user_id"`
	Username string `json:"username" db:"username" validate:"required"`
	Email    string `json:"email" db:"email" validate:"required,email"`
	Password string `json:"-" db:"password_hash"` // Hidden in JSON
	Active   bool   `json:"active" db:"is_active"`
}

func structTagsDemo() {
	fmt.Println("\n--- Struct Tags ---")

	user := User{
		ID:       1,
		Username: "john_doe",
		Email:    "john@example.com",
		Password: "secret123",
		Active:   true,
	}

	fmt.Printf("User: %+v\n", user)
	fmt.Println("Note: Struct tags are used by packages like json, database drivers, etc.")
	fmt.Println("Tags provide metadata about struct fields for serialization, validation, etc.")
}

func anonymousStructDemo() {
	fmt.Println("\n--- Anonymous Structs ---")

	// Anonymous struct
	config := struct {
		Host     string
		Port     int
		Database string
		SSL      bool
	}{
		Host:     "localhost",
		Port:     5432,
		Database: "myapp",
		SSL:      true,
	}

	fmt.Printf("Config: %+v\n", config)

	// Anonymous struct in slice
	users := []struct {
		Name  string
		Email string
		Age   int
	}{
		{"Alice", "alice@example.com", 25},
		{"Bob", "bob@example.com", 30},
		{"Carol", "carol@example.com", 35},
	}

	fmt.Printf("Users: %+v\n", users)

	// Anonymous struct as map value
	settings := map[string]struct {
		Value interface{}
		Type  string
	}{
		"timeout": {Value: 30, Type: "int"},
		"debug":   {Value: true, Type: "bool"},
		"name":    {Value: "MyApp", Type: "string"},
	}

	fmt.Printf("Settings: %+v\n", settings)
}

func structComparisonDemo() {
	fmt.Println("\n--- Struct Comparison ---")

	// Structs are comparable if all their fields are comparable
	point1 := struct {
		X, Y int
	}{1, 2}

	point2 := struct {
		X, Y int
	}{1, 2}

	point3 := struct {
		X, Y int
	}{2, 3}

	fmt.Printf("point1 == point2: %t\n", point1 == point2)
	fmt.Printf("point1 == point3: %t\n", point1 == point3)

	// Structs with slices are not comparable
	// This would cause a compile error:
	// structWithSlice := struct {
	//     Name string
	//     Tags []string
	// }{"test", []string{"a", "b"}}

	// But we can compare individual fields
	person1 := Person{Name: "Alice", Age: 25}
	person2 := Person{Name: "Alice", Age: 25}
	person3 := Person{Name: "Bob", Age: 25}

	fmt.Printf("person1 == person2: %t\n", person1 == person2)
	fmt.Printf("person1 == person3: %t\n", person1 == person3)
}

func structPatternsDemo() {
	fmt.Println("\n--- Struct Patterns ---")

	// 1. Builder pattern
	user := NewUser().
		SetName("John").
		SetEmail("john@example.com").
		SetAge(30).
		Build()

	fmt.Printf("Built user: %+v\n", user)

	// 2. Factory pattern
	admin := CreateUser("admin", "admin@example.com", 25, "admin")
	guest := CreateUser("guest", "guest@example.com", 0, "guest")

	fmt.Printf("Admin user: %+v\n", admin)
	fmt.Printf("Guest user: %+v\n", guest)

	// 3. Options pattern
	server := NewServer(
		WithHost("localhost"),
		WithPort(8080),
		WithSSL(true),
	)

	fmt.Printf("Server config: %+v\n", server)
}

// Builder pattern implementation
type UserBuilder struct {
	user User
}

func NewUser() *UserBuilder {
	return &UserBuilder{}
}

func (ub *UserBuilder) SetName(name string) *UserBuilder {
	ub.user.Name = name
	return ub
}

func (ub *UserBuilder) SetEmail(email string) *UserBuilder {
	ub.user.Email = email
	return ub
}

func (ub *UserBuilder) SetAge(age int) *UserBuilder {
	ub.user.Age = age
	return ub
}

func (ub *UserBuilder) Build() User {
	return ub.user
}

// Factory pattern
type UserType string

const (
	AdminType UserType = "admin"
	GuestType UserType = "guest"
	UserType  UserType = "user"
)

type UserWithType struct {
	Person
	Type UserType
}

func CreateUser(name, email string, age int, userType string) UserWithType {
	return UserWithType{
		Person: Person{
			Name:  name,
			Email: email,
			Age:   age,
		},
		Type: UserType(userType),
	}
}

// Options pattern
type Server struct {
	Host string
	Port int
	SSL  bool
}

type ServerOption func(*Server)

func WithHost(host string) ServerOption {
	return func(s *Server) {
		s.Host = host
	}
}

func WithPort(port int) ServerOption {
	return func(s *Server) {
		s.Port = port
	}
}

func WithSSL(ssl bool) ServerOption {
	return func(s *Server) {
		s.SSL = ssl
	}
}

func NewServer(options ...ServerOption) *Server {
	server := &Server{
		Host: "localhost",
		Port: 3000,
		SSL:  false,
	}

	for _, option := range options {
		option(server)
	}

	return server
}


