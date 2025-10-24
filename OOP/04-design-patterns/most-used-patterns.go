package main

import (
	"fmt"
	"sync"
	"time"
)

/**
 * MOST COMMONLY USED DESIGN PATTERNS IN GOLANG
 *
 * This file contains practical implementations of the most frequently used
 * design patterns in real-world Go applications.
 */

// ============================================================================
// 1. SINGLETON PATTERN
// ============================================================================
// Ensures a class has only one instance and provides global access to it
// Use Case: Database connections, configuration managers, logging services

type Logger struct {
	logs []string
}

var (
	loggerInstance *Logger
	loggerOnce     sync.Once
)

func GetLoggerInstance() *Logger {
	loggerOnce.Do(func() {
		loggerInstance = &Logger{
			logs: make([]string, 0),
		}
	})
	return loggerInstance
}

func (l *Logger) Log(message string) {
	timestamp := time.Now().Format(time.RFC3339)
	logEntry := fmt.Sprintf("[%s] %s", timestamp, message)
	l.logs = append(l.logs, logEntry)
	fmt.Println(logEntry)
}

func (l *Logger) GetLogs() []string {
	return l.logs
}

// Usage example:
func exampleSingleton() {
	logger1 := GetLoggerInstance()
	logger2 := GetLoggerInstance()
	fmt.Println(logger1 == logger2) // true - same instance

	logger1.Log("Application started")
	logger2.Log("Processing request")
}

// ============================================================================
// 2. FACTORY PATTERN
// ============================================================================
// Creates objects without specifying the exact class to create
// Use Case: Creating different types of objects based on conditions

type Payment interface {
	ProcessPayment(amount float64)
}

type CreditCardPayment struct{}

func (c *CreditCardPayment) ProcessPayment(amount float64) {
	fmt.Printf("Processing credit card payment of $%.2f\n", amount)
}

type PayPalPayment struct{}

func (p *PayPalPayment) ProcessPayment(amount float64) {
	fmt.Printf("Processing PayPal payment of $%.2f\n", amount)
}

type CryptoPayment struct{}

func (c *CryptoPayment) ProcessPayment(amount float64) {
	fmt.Printf("Processing crypto payment of $%.2f\n", amount)
}

type PaymentFactory struct{}

func (pf *PaymentFactory) CreatePayment(paymentType string) Payment {
	switch paymentType {
	case "credit":
		return &CreditCardPayment{}
	case "paypal":
		return &PayPalPayment{}
	case "crypto":
		return &CryptoPayment{}
	default:
		return nil
	}
}

// Usage example:
func exampleFactory() {
	factory := &PaymentFactory{}
	payment := factory.CreatePayment("paypal")
	payment.ProcessPayment(100.50)
}

// ============================================================================
// 3. BUILDER PATTERN
// ============================================================================
// Constructs complex objects step by step
// Use Case: Creating objects with many optional parameters

type User struct {
	Name    string
	Email   string
	Age     int
	Phone   string
	Address string
	Role    string
}

type UserBuilder struct {
	name    string
	email   string
	age     int
	phone   string
	address string
	role    string
}

func NewUserBuilder() *UserBuilder {
	return &UserBuilder{}
}

func (ub *UserBuilder) SetName(name string) *UserBuilder {
	ub.name = name
	return ub
}

func (ub *UserBuilder) SetEmail(email string) *UserBuilder {
	ub.email = email
	return ub
}

func (ub *UserBuilder) SetAge(age int) *UserBuilder {
	ub.age = age
	return ub
}

func (ub *UserBuilder) SetPhone(phone string) *UserBuilder {
	ub.phone = phone
	return ub
}

func (ub *UserBuilder) SetAddress(address string) *UserBuilder {
	ub.address = address
	return ub
}

func (ub *UserBuilder) SetRole(role string) *UserBuilder {
	ub.role = role
	return ub
}

func (ub *UserBuilder) Build() *User {
	return &User{
		Name:    ub.name,
		Email:   ub.email,
		Age:     ub.age,
		Phone:   ub.phone,
		Address: ub.address,
		Role:    ub.role,
	}
}

// Usage example:
func exampleBuilder() {
	user := NewUserBuilder().
		SetName("John Doe").
		SetEmail("john@example.com").
		SetAge(30).
		SetRole("admin").
		Build()

	fmt.Printf("User: %+v\n", user)
}

// ============================================================================
// 4. OBSERVER PATTERN (PUB/SUB)
// ============================================================================
// Defines a one-to-many dependency between objects
// Use Case: Event handling, state management, real-time updates

type Observer interface {
	Update(data string)
}

type Subject struct {
	observers []Observer
}

func (s *Subject) Subscribe(observer Observer) {
	s.observers = append(s.observers, observer)
}

func (s *Subject) Unsubscribe(observer Observer) {
	for i, obs := range s.observers {
		if obs == observer {
			s.observers = append(s.observers[:i], s.observers[i+1:]...)
			break
		}
	}
}

func (s *Subject) Notify(data string) {
	for _, observer := range s.observers {
		observer.Update(data)
	}
}

type EmailNotification struct{}

func (e *EmailNotification) Update(data string) {
	fmt.Printf("📧 Email notification: %s\n", data)
}

type SMSNotification struct{}

func (s *SMSNotification) Update(data string) {
	fmt.Printf("📱 SMS notification: %s\n", data)
}

type PushNotification struct{}

func (p *PushNotification) Update(data string) {
	fmt.Printf("🔔 Push notification: %s\n", data)
}

// Usage example:
func exampleObserver() {
	orderSubject := &Subject{}

	emailNotif := &EmailNotification{}
	smsNotif := &SMSNotification{}
	pushNotif := &PushNotification{}

	orderSubject.Subscribe(emailNotif)
	orderSubject.Subscribe(smsNotif)
	orderSubject.Subscribe(pushNotif)

	orderSubject.Notify("Order #1234 has been shipped!")
}

// ============================================================================
// 5. STRATEGY PATTERN
// ============================================================================
// Defines a family of algorithms and makes them interchangeable
// Use Case: Different sorting algorithms, validation strategies, pricing strategies

type PricingStrategy interface {
	CalculatePrice(basePrice float64) float64
}

type RegularPricing struct{}

func (r *RegularPricing) CalculatePrice(basePrice float64) float64 {
	return basePrice
}

type SeasonalDiscount struct{}

func (s *SeasonalDiscount) CalculatePrice(basePrice float64) float64 {
	return basePrice * 0.9 // 10% off
}

type BlackFridayDiscount struct{}

func (b *BlackFridayDiscount) CalculatePrice(basePrice float64) float64 {
	return basePrice * 0.5 // 50% off
}

type PriceCalculator struct {
	strategy PricingStrategy
}

func NewPriceCalculator(strategy PricingStrategy) *PriceCalculator {
	return &PriceCalculator{strategy: strategy}
}

func (pc *PriceCalculator) SetStrategy(strategy PricingStrategy) {
	pc.strategy = strategy
}

func (pc *PriceCalculator) Calculate(basePrice float64) float64 {
	return pc.strategy.CalculatePrice(basePrice)
}

// Usage example:
func exampleStrategy() {
	calculator := NewPriceCalculator(&RegularPricing{})
	fmt.Printf("Regular price: $%.2f\n", calculator.Calculate(100))

	calculator.SetStrategy(&BlackFridayDiscount{})
	fmt.Printf("Black Friday price: $%.2f\n", calculator.Calculate(100))
}

// ============================================================================
// 6. DECORATOR PATTERN
// ============================================================================
// Adds new functionality to objects without altering their structure
// Use Case: Adding features to objects dynamically, middleware

type Coffee interface {
	Cost() float64
	Description() string
}

type SimpleCoffee struct{}

func (s *SimpleCoffee) Cost() float64 {
	return 5.0
}

func (s *SimpleCoffee) Description() string {
	return "Simple coffee"
}

type MilkDecorator struct {
	coffee Coffee
}

func (m *MilkDecorator) Cost() float64 {
	return m.coffee.Cost() + 2.0
}

func (m *MilkDecorator) Description() string {
	return m.coffee.Description() + ", milk"
}

type SugarDecorator struct {
	coffee Coffee
}

func (s *SugarDecorator) Cost() float64 {
	return s.coffee.Cost() + 1.0
}

func (s *SugarDecorator) Description() string {
	return s.coffee.Description() + ", sugar"
}

type WhipCreamDecorator struct {
	coffee Coffee
}

func (w *WhipCreamDecorator) Cost() float64 {
	return w.coffee.Cost() + 3.0
}

func (w *WhipCreamDecorator) Description() string {
	return w.coffee.Description() + ", whip cream"
}

// Usage example:
func exampleDecorator() {
	var coffee Coffee = &SimpleCoffee{}
	fmt.Printf("%s: $%.2f\n", coffee.Description(), coffee.Cost())

	coffee = &MilkDecorator{coffee: coffee}
	coffee = &SugarDecorator{coffee: coffee}
	coffee = &WhipCreamDecorator{coffee: coffee}
	fmt.Printf("%s: $%.2f\n", coffee.Description(), coffee.Cost())
}

// ============================================================================
// 7. ADAPTER PATTERN
// ============================================================================
// Allows incompatible interfaces to work together
// Use Case: Integrating third-party libraries, legacy code integration

type ModernPaymentProcessor interface {
	ProcessPayment(amount float64, currency string) bool
}

type LegacyPaymentSystem struct{}

func (l *LegacyPaymentSystem) MakePayment(dollars float64) string {
	fmt.Printf("Processing $%.2f through legacy system\n", dollars)
	return "SUCCESS"
}

type PaymentAdapter struct {
	legacySystem *LegacyPaymentSystem
}

func NewPaymentAdapter(legacySystem *LegacyPaymentSystem) *PaymentAdapter {
	return &PaymentAdapter{legacySystem: legacySystem}
}

func (pa *PaymentAdapter) ProcessPayment(amount float64, currency string) bool {
	// Convert currency if needed (simplified)
	dollars := amount
	if currency != "USD" {
		dollars = amount * 1.2
	}
	result := pa.legacySystem.MakePayment(dollars)
	return result == "SUCCESS"
}

// Usage example:
func exampleAdapter() {
	legacySystem := &LegacyPaymentSystem{}
	modernAdapter := NewPaymentAdapter(legacySystem)
	success := modernAdapter.ProcessPayment(100, "USD")
	fmt.Printf("Payment successful: %v\n", success)
}

// ============================================================================
// 8. FACADE PATTERN
// ============================================================================
// Provides a simplified interface to a complex subsystem
// Use Case: Simplifying complex APIs, hiding implementation details

type CPU struct{}

func (c *CPU) Freeze() {
	fmt.Println("CPU frozen")
}

func (c *CPU) Jump(position int) {
	fmt.Printf("CPU jumped to position %d\n", position)
}

func (c *CPU) Execute() {
	fmt.Println("CPU executing")
}

type Memory struct{}

func (m *Memory) Load(position int, data string) {
	fmt.Printf("Memory loaded %s at position %d\n", data, position)
}

type HardDrive struct{}

func (h *HardDrive) Read(sector int, size int) string {
	fmt.Printf("HardDrive reading %d bytes from sector %d\n", size, sector)
	return "boot data"
}

type ComputerFacade struct {
	cpu       *CPU
	memory    *Memory
	hardDrive *HardDrive
}

func NewComputerFacade() *ComputerFacade {
	return &ComputerFacade{
		cpu:       &CPU{},
		memory:    &Memory{},
		hardDrive: &HardDrive{},
	}
}

func (cf *ComputerFacade) Start() {
	fmt.Println("Starting computer...")
	cf.cpu.Freeze()
	bootData := cf.hardDrive.Read(0, 1024)
	cf.memory.Load(0, bootData)
	cf.cpu.Jump(0)
	cf.cpu.Execute()
	fmt.Println("Computer started!")
}

// Usage example:
func exampleFacade() {
	computer := NewComputerFacade()
	computer.Start()
}

// ============================================================================
// 9. REPOSITORY PATTERN
// ============================================================================
// Mediates between domain and data mapping layers
// Use Case: Database abstraction, data access layer

type UserRepository interface {
	FindByID(id string) (*User, error)
	FindAll() ([]*User, error)
	Create(user *User) (*User, error)
	Update(id string, user *User) (*User, error)
	Delete(id string) error
}

type InMemoryUserRepository struct {
	users map[string]*User
	mu    sync.RWMutex
}

func NewInMemoryUserRepository() *InMemoryUserRepository {
	return &InMemoryUserRepository{
		users: make(map[string]*User),
	}
}

func (r *InMemoryUserRepository) FindByID(id string) (*User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	user, exists := r.users[id]
	if !exists {
		return nil, fmt.Errorf("user not found")
	}
	return user, nil
}

func (r *InMemoryUserRepository) FindAll() ([]*User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	users := make([]*User, 0, len(r.users))
	for _, user := range r.users {
		users = append(users, user)
	}
	return users, nil
}

func (r *InMemoryUserRepository) Create(user *User) (*User, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	id := fmt.Sprintf("user_%d", len(r.users)+1)
	r.users[id] = user
	return user, nil
}

func (r *InMemoryUserRepository) Update(id string, user *User) (*User, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, exists := r.users[id]; !exists {
		return nil, fmt.Errorf("user not found")
	}
	r.users[id] = user
	return user, nil
}

func (r *InMemoryUserRepository) Delete(id string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, exists := r.users[id]; !exists {
		return fmt.Errorf("user not found")
	}
	delete(r.users, id)
	return nil
}

// Usage example:
func exampleRepository() {
	repo := NewInMemoryUserRepository()

	user := &User{
		Name:  "Alice",
		Email: "alice@example.com",
		Age:   28,
	}

	createdUser, _ := repo.Create(user)
	fmt.Printf("Created user: %+v\n", createdUser)

	allUsers, _ := repo.FindAll()
	fmt.Printf("Total users: %d\n", len(allUsers))
}

// ============================================================================
// 10. DEPENDENCY INJECTION PATTERN
// ============================================================================
// Provides objects with their dependencies instead of creating them
// Use Case: Loose coupling, testability, maintainability

type EmailService interface {
	SendEmail(to, subject, body string) error
}

type RealEmailService struct{}

func (r *RealEmailService) SendEmail(to, subject, body string) error {
	fmt.Printf("📧 Sending email to %s: %s\n", to, subject)
	return nil
}

type MockEmailService struct{}

func (m *MockEmailService) SendEmail(to, subject, body string) error {
	fmt.Printf("[MOCK] Email to %s: %s\n", to, subject)
	return nil
}

type UserService struct {
	emailService EmailService
	userRepo     UserRepository
}

func NewUserService(emailService EmailService, userRepo UserRepository) *UserService {
	return &UserService{
		emailService: emailService,
		userRepo:     userRepo,
	}
}

func (us *UserService) RegisterUser(name, email string) error {
	fmt.Printf("Registering user: %s\n", name)

	user := &User{
		Name:  name,
		Email: email,
	}

	_, err := us.userRepo.Create(user)
	if err != nil {
		return err
	}

	// Send welcome email
	return us.emailService.SendEmail(
		email,
		"Welcome!",
		fmt.Sprintf("Hello %s, welcome to our platform!", name),
	)
}

// Usage example:
func exampleDependencyInjection() {
	// Production
	emailService := &RealEmailService{}
	userRepo := NewInMemoryUserRepository()
	userService := NewUserService(emailService, userRepo)
	userService.RegisterUser("John Doe", "john@example.com")

	// Testing
	mockEmailService := &MockEmailService{}
	testUserService := NewUserService(mockEmailService, userRepo)
	testUserService.RegisterUser("Test User", "test@example.com")
}

// ============================================================================
// 11. OPTIONS PATTERN (Go-specific)
// ============================================================================
// Provides a clean way to handle optional parameters
// Use Case: Configuration, flexible constructors

type ServerConfig struct {
	Host    string
	Port    int
	Timeout time.Duration
	MaxConn int
	TLS     bool
}

type ServerOption func(*ServerConfig)

func WithHost(host string) ServerOption {
	return func(c *ServerConfig) {
		c.Host = host
	}
}

func WithPort(port int) ServerOption {
	return func(c *ServerConfig) {
		c.Port = port
	}
}

func WithTimeout(timeout time.Duration) ServerOption {
	return func(c *ServerConfig) {
		c.Timeout = timeout
	}
}

func WithMaxConnections(maxConn int) ServerOption {
	return func(c *ServerConfig) {
		c.MaxConn = maxConn
	}
}

func WithTLS(enabled bool) ServerOption {
	return func(c *ServerConfig) {
		c.TLS = enabled
	}
}

type Server struct {
	config ServerConfig
}

func NewServer(opts ...ServerOption) *Server {
	// Default configuration
	config := ServerConfig{
		Host:    "localhost",
		Port:    8080,
		Timeout: 30 * time.Second,
		MaxConn: 100,
		TLS:     false,
	}

	// Apply options
	for _, opt := range opts {
		opt(&config)
	}

	return &Server{config: config}
}

func (s *Server) Start() {
	fmt.Printf("Starting server on %s:%d (TLS: %v)\n", s.config.Host, s.config.Port, s.config.TLS)
}

// Usage example:
func exampleOptions() {
	server := NewServer(
		WithHost("0.0.0.0"),
		WithPort(3000),
		WithTLS(true),
		WithMaxConnections(500),
	)
	server.Start()
}

// ============================================================================
// 12. PIPELINE PATTERN (Go-specific)
// ============================================================================
// Processes data through a series of stages using channels
// Use Case: Data processing, ETL pipelines

func generator(nums ...int) <-chan int {
	out := make(chan int)
	go func() {
		for _, n := range nums {
			out <- n
		}
		close(out)
	}()
	return out
}

func square(in <-chan int) <-chan int {
	out := make(chan int)
	go func() {
		for n := range in {
			out <- n * n
		}
		close(out)
	}()
	return out
}

func filter(in <-chan int, predicate func(int) bool) <-chan int {
	out := make(chan int)
	go func() {
		for n := range in {
			if predicate(n) {
				out <- n
			}
		}
		close(out)
	}()
	return out
}

// Usage example:
func examplePipeline() {
	// Create pipeline: generate -> square -> filter even numbers
	numbers := generator(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
	squared := square(numbers)
	evens := filter(squared, func(n int) bool { return n%2 == 0 })

	// Consume results
	fmt.Println("Squared even numbers:")
	for n := range evens {
		fmt.Println(n)
	}
}

// ============================================================================
// MAIN FUNCTION - Run all examples
// ============================================================================

func main() {
	fmt.Println("=== 1. SINGLETON PATTERN ===")
	exampleSingleton()

	fmt.Println("\n=== 2. FACTORY PATTERN ===")
	exampleFactory()

	fmt.Println("\n=== 3. BUILDER PATTERN ===")
	exampleBuilder()

	fmt.Println("\n=== 4. OBSERVER PATTERN ===")
	exampleObserver()

	fmt.Println("\n=== 5. STRATEGY PATTERN ===")
	exampleStrategy()

	fmt.Println("\n=== 6. DECORATOR PATTERN ===")
	exampleDecorator()

	fmt.Println("\n=== 7. ADAPTER PATTERN ===")
	exampleAdapter()

	fmt.Println("\n=== 8. FACADE PATTERN ===")
	exampleFacade()

	fmt.Println("\n=== 9. REPOSITORY PATTERN ===")
	exampleRepository()

	fmt.Println("\n=== 10. DEPENDENCY INJECTION ===")
	exampleDependencyInjection()

	fmt.Println("\n=== 11. OPTIONS PATTERN (Go-specific) ===")
	exampleOptions()

	fmt.Println("\n=== 12. PIPELINE PATTERN (Go-specific) ===")
	examplePipeline()
}

/**
 * SUMMARY OF MOST USED PATTERNS IN GO:
 *
 * 1. Singleton - Single instance with sync.Once (Config, Logger)
 * 2. Factory - Object creation without specifying exact type
 * 3. Builder - Complex object construction with many parameters
 * 4. Observer - Event handling and notifications
 * 5. Strategy - Interchangeable algorithms
 * 6. Decorator - Adding functionality dynamically
 * 7. Adapter - Making incompatible interfaces work together
 * 8. Facade - Simplifying complex subsystems
 * 9. Repository - Data access abstraction
 * 10. Dependency Injection - Loose coupling and testability
 * 11. Options Pattern - Flexible configuration (Go-specific)
 * 12. Pipeline Pattern - Concurrent data processing (Go-specific)
 *
 * GO-SPECIFIC PATTERNS:
 * - Options Pattern: Clean way to handle optional parameters
 * - Pipeline Pattern: Concurrent data processing with channels
 * - Context Pattern: Request-scoped values and cancellation
 * - Worker Pool: Concurrent task processing
 *
 * WHEN TO USE EACH:
 * - Singleton: Global state with thread safety (sync.Once)
 * - Factory: Dynamic object creation based on conditions
 * - Builder: Objects with many optional parameters
 * - Observer: Event-driven systems, pub/sub
 * - Strategy: Multiple algorithms for same operation
 * - Decorator: Add features without modifying existing code
 * - Adapter: Integrate third-party or legacy code
 * - Facade: Simplify complex API usage
 * - Repository: Abstract database operations
 * - Dependency Injection: Improve testability
 * - Options: Flexible function/constructor parameters
 * - Pipeline: Process data streams concurrently
 *
 * GO BEST PRACTICES:
 * - Accept interfaces, return structs
 * - Use composition over inheritance
 * - Keep interfaces small (single method is common)
 * - Use sync.Once for thread-safe singleton
 * - Leverage goroutines and channels for concurrency patterns
 * - Use functional options for flexible configuration
 */
