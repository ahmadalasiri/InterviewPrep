package main

/*
This file demonstrates practical examples of packages, modules, and imports.
It's meant to be read alongside packages-modules-guide.md

Note: This is a demonstration file and won't run as-is.
It shows patterns you would use in a real project.
*/

import (
	// Standard library packages
	"context"
	"fmt"
	"log"
	"net/http"
	"time"
	// External packages (would need go get)
	// "github.com/gin-gonic/gin"
	// "github.com/lib/pq"
	// "golang.org/x/crypto/bcrypt"
	// Internal packages (from your module)
	// "github.com/username/myproject/internal/config"
	// "github.com/username/myproject/internal/models"
	// "github.com/username/myproject/pkg/logger"
)

// ============================================================================
// EXAMPLE 1: Package Structure and Visibility
// ============================================================================

// Public struct - can be used outside this package
type User struct {
	ID        int       // Public field
	Name      string    // Public field
	Email     string    // Public field
	password  string    // Private field - only accessible within this package
	createdAt time.Time // Private field
}

// Public function - creates a new User
func NewUser(name, email, password string) (*User, error) {
	if name == "" {
		return nil, fmt.Errorf("name is required")
	}

	hashedPassword, err := hashPassword(password)
	if err != nil {
		return nil, err
	}

	return &User{
		Name:      name,
		Email:     email,
		password:  hashedPassword,
		createdAt: time.Now(),
	}, nil
}

// Private function - only accessible within this package
func hashPassword(password string) (string, error) {
	// In real code: return bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return password, nil // Simplified for example
}

// Public method on User
func (u *User) ValidatePassword(password string) bool {
	// In real code: compare with bcrypt
	return u.password == password
}

// Private method - only accessible within package
func (u *User) isExpired() bool {
	return time.Since(u.createdAt) > 365*24*time.Hour
}

// ============================================================================
// EXAMPLE 2: Init Functions
// ============================================================================

var (
	// Package-level variables initialized by init()
	defaultTimeout time.Duration
	maxRetries     int
)

// init() runs automatically before main()
// Multiple init() functions are allowed
func init() {
	fmt.Println("Initializing package...")
	defaultTimeout = 30 * time.Second
	maxRetries = 3
}

func init() {
	fmt.Println("Second init function...")
	// Could load config, validate environment, etc.
}

// ============================================================================
// EXAMPLE 3: Typical Project Structure Patterns
// ============================================================================

// Repository Pattern - Data Access Layer
type UserRepository interface {
	Create(ctx context.Context, user *User) error
	GetByID(ctx context.Context, id int) (*User, error)
	Update(ctx context.Context, user *User) error
	Delete(ctx context.Context, id int) error
}

// Concrete implementation
type userRepositoryImpl struct {
	// db *sql.DB
}

func NewUserRepository( /* db *sql.DB */ ) UserRepository {
	return &userRepositoryImpl{
		// db: db,
	}
}

func (r *userRepositoryImpl) Create(ctx context.Context, user *User) error {
	// Implementation would interact with database
	log.Printf("Creating user: %s", user.Name)
	return nil
}

func (r *userRepositoryImpl) GetByID(ctx context.Context, id int) (*User, error) {
	// Implementation would query database
	log.Printf("Fetching user with ID: %d", id)
	return &User{ID: id, Name: "Example User"}, nil
}

func (r *userRepositoryImpl) Update(ctx context.Context, user *User) error {
	log.Printf("Updating user: %s", user.Name)
	return nil
}

func (r *userRepositoryImpl) Delete(ctx context.Context, id int) error {
	log.Printf("Deleting user with ID: %d", id)
	return nil
}

// Service Pattern - Business Logic Layer
type UserService struct {
	repo UserRepository
}

func NewUserService(repo UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) RegisterUser(ctx context.Context, name, email, password string) (*User, error) {
	// Business logic
	user, err := NewUser(name, email, password)
	if err != nil {
		return nil, fmt.Errorf("invalid user data: %w", err)
	}

	// Validate business rules
	if err := s.validateBusinessRules(user); err != nil {
		return nil, err
	}

	// Save to repository
	if err := s.repo.Create(ctx, user); err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	return user, nil
}

func (s *UserService) validateBusinessRules(user *User) error {
	// Business validation logic
	if len(user.Name) < 3 {
		return fmt.Errorf("name must be at least 3 characters")
	}
	return nil
}

// Handler Pattern - HTTP Layer
type UserHandler struct {
	service *UserService
}

func NewUserHandler(service *UserService) *UserHandler {
	return &UserHandler{service: service}
}

func (h *UserHandler) HandleRegister(w http.ResponseWriter, r *http.Request) {
	// Parse request
	name := r.FormValue("name")
	email := r.FormValue("email")
	password := r.FormValue("password")

	// Call service
	user, err := h.service.RegisterUser(r.Context(), name, email, password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Return response
	fmt.Fprintf(w, "User created: %s", user.Name)
}

// ============================================================================
// EXAMPLE 4: Dependency Injection Pattern
// ============================================================================

// App struct holds all dependencies
type App struct {
	server      *http.Server
	userHandler *UserHandler
	userService *UserService
	userRepo    UserRepository
}

// NewApp creates and wires up all dependencies
func NewApp() *App {
	// Create dependencies from bottom to top
	repo := NewUserRepository( /* db */ )
	service := NewUserService(repo)
	handler := NewUserHandler(service)

	// Setup HTTP routes
	mux := http.NewServeMux()
	mux.HandleFunc("/register", handler.HandleRegister)

	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	return &App{
		server:      server,
		userHandler: handler,
		userService: service,
		userRepo:    repo,
	}
}

func (a *App) Run() error {
	log.Println("Starting server on :8080")
	return a.server.ListenAndServe()
}

func (a *App) Shutdown(ctx context.Context) error {
	log.Println("Shutting down server...")
	return a.server.Shutdown(ctx)
}

// ============================================================================
// EXAMPLE 5: Configuration Pattern
// ============================================================================

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Redis    RedisConfig
}

type ServerConfig struct {
	Port         string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
}

type RedisConfig struct {
	Host     string
	Port     string
	Password string
}

// LoadConfig loads configuration from environment or files
func LoadConfig() (*Config, error) {
	// In real code, use viper, envconfig, or similar
	return &Config{
		Server: ServerConfig{
			Port:         getEnvOrDefault("SERVER_PORT", "8080"),
			ReadTimeout:  30 * time.Second,
			WriteTimeout: 30 * time.Second,
		},
		Database: DatabaseConfig{
			Host:     getEnvOrDefault("DB_HOST", "localhost"),
			Port:     getEnvOrDefault("DB_PORT", "5432"),
			User:     getEnvOrDefault("DB_USER", "postgres"),
			Password: getEnvOrDefault("DB_PASSWORD", ""),
			DBName:   getEnvOrDefault("DB_NAME", "myapp"),
		},
		Redis: RedisConfig{
			Host:     getEnvOrDefault("REDIS_HOST", "localhost"),
			Port:     getEnvOrDefault("REDIS_PORT", "6379"),
			Password: getEnvOrDefault("REDIS_PASSWORD", ""),
		},
	}, nil
}

func getEnvOrDefault(key, defaultValue string) string {
	// if value := os.Getenv(key); value != "" {
	//     return value
	// }
	return defaultValue
}

// ============================================================================
// EXAMPLE 6: Main Function Structure
// ============================================================================

func main() {
	// This is how a typical main.go should look
	// Keep it minimal - delegate to other packages

	// 1. Load configuration
	config, err := LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}
	log.Printf("Loaded config: %+v", config)

	// 2. Initialize application
	app := NewApp()

	// 3. Setup graceful shutdown
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// 4. Run application
	go func() {
		if err := app.Run(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	// 5. Wait for interrupt signal
	// In real code, use signal.Notify to handle OS signals
	log.Println("Server is running. Press Ctrl+C to stop.")

	// Simulate running for example purposes
	time.Sleep(1 * time.Second)

	// 6. Graceful shutdown
	if err := app.Shutdown(ctx); err != nil {
		log.Fatalf("Shutdown error: %v", err)
	}

	log.Println("Server stopped gracefully")
}

// ============================================================================
// EXAMPLE 7: Package Organization Patterns
// ============================================================================

/*
For reference, here's how you would organize these in a real project:

myproject/
├── go.mod                          # module github.com/username/myproject
├── go.sum
├── cmd/
│   └── server/
│       └── main.go                 # Just calls app.Run()
│
├── internal/
│   ├── app/
│   │   └── app.go                  # App struct and initialization
│   │
│   ├── config/
│   │   └── config.go               # Config struct and LoadConfig()
│   │
│   ├── models/
│   │   └── user.go                 # User struct definition
│   │
│   ├── repository/
│   │   └── user_repository.go      # UserRepository interface and impl
│   │
│   ├── service/
│   │   └── user_service.go         # UserService struct
│   │
│   └── handlers/
│       └── user_handler.go         # UserHandler struct
│
└── pkg/
    ├── logger/
    │   └── logger.go               # Shared logging utilities
    └── validator/
        └── validator.go            # Shared validation utilities

Then imports would look like:
    import (
        "github.com/username/myproject/internal/app"
        "github.com/username/myproject/internal/config"
        "github.com/username/myproject/internal/models"
        "github.com/username/myproject/pkg/logger"
    )
*/

// ============================================================================
// EXAMPLE 8: Testing Package Structure
// ============================================================================

/*
Test files live alongside the code:

user.go       # Contains User type and functions
user_test.go  # Contains tests for user.go

Two types of tests:

1. Same package tests (can test private functions):
   package user

2. External package tests (black-box testing):
   package user_test

Example:
*/

// This would be in user_test.go
// package user_test  // Black-box testing
//
// import (
//     "testing"
//     "github.com/username/myproject/internal/models"
// )
//
// func TestNewUser(t *testing.T) {
//     user, err := models.NewUser("John", "john@example.com", "password123")
//     if err != nil {
//         t.Fatalf("Expected no error, got: %v", err)
//     }
//     if user.Name != "John" {
//         t.Errorf("Expected name 'John', got '%s'", user.Name)
//     }
// }

// ============================================================================
// EXAMPLE 9: Context Usage Pattern
// ============================================================================

type contextKey string

const (
	contextKeyUserID contextKey = "userID"
	contextKeyRole   contextKey = "role"
)

// Example of adding values to context
func withUserID(ctx context.Context, userID int) context.Context {
	return context.WithValue(ctx, contextKeyUserID, userID)
}

// Example of retrieving values from context
func getUserIDFromContext(ctx context.Context) (int, bool) {
	userID, ok := ctx.Value(contextKeyUserID).(int)
	return userID, ok
}

// ============================================================================
// EXAMPLE 10: Error Handling Pattern
// ============================================================================

// Custom error types
type ValidationError struct {
	Field   string
	Message string
}

func (e *ValidationError) Error() string {
	return fmt.Sprintf("validation error on field '%s': %s", e.Field, e.Message)
}

// Error wrapping (Go 1.13+)
func processUser(id int) error {
	// Simulated error
	err := fmt.Errorf("database connection failed")
	if err != nil {
		return fmt.Errorf("failed to process user %d: %w", id, err)
	}
	return nil
}

// ============================================================================
// Key Takeaways:
//
// 1. Use packages to organize code logically
// 2. Public = Capitalized, private = lowercase
// 3. Keep main.go minimal
// 4. Use internal/ for private packages
// 5. Use pkg/ for reusable libraries
// 6. Follow the repository/service/handler pattern
// 7. Use dependency injection
// 8. Keep configuration separate
// 9. Write tests alongside code
// 10. Use context for request-scoped values
// ============================================================================


