package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"
)

// ============================================
// 1. CONCURRENCY PATTERNS
// ============================================

// Worker Pool Pattern
type Job struct {
	ID   int
	Data string
}

type Result struct {
	Job   Job
	Value string
}

func worker(id int, jobs <-chan Job, results chan<- Result, wg *sync.WaitGroup) {
	defer wg.Done()
	for job := range jobs {
		fmt.Printf("Worker %d processing job %d\n", id, job.ID)
		time.Sleep(100 * time.Millisecond) // Simulate work
		results <- Result{
			Job:   job,
			Value: fmt.Sprintf("Processed: %s", job.Data),
		}
	}
}

func WorkerPoolExample() {
	numWorkers := 3
	numJobs := 10

	jobs := make(chan Job, numJobs)
	results := make(chan Result, numJobs)
	var wg sync.WaitGroup

	// Start workers
	for w := 1; w <= numWorkers; w++ {
		wg.Add(1)
		go worker(w, jobs, results, &wg)
	}

	// Send jobs
	for j := 1; j <= numJobs; j++ {
		jobs <- Job{ID: j, Data: fmt.Sprintf("Task-%d", j)}
	}
	close(jobs)

	// Close results channel when all workers done
	go func() {
		wg.Wait()
		close(results)
	}()

	// Collect results
	for result := range results {
		fmt.Printf("Result: Job %d -> %s\n", result.Job.ID, result.Value)
	}
}

// ============================================
// 2. CONTEXT USAGE
// ============================================

func ProcessWithTimeout(ctx context.Context, data string) error {
	// Simulate long-running operation
	select {
	case <-time.After(2 * time.Second):
		fmt.Println("Processing completed:", data)
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}

func ContextExample() {
	// Context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	if err := ProcessWithTimeout(ctx, "important data"); err != nil {
		fmt.Println("Error:", err)
	}
}

// ============================================
// 3. CHANNEL PATTERNS
// ============================================

// Fan-Out, Fan-In Pattern
func generateNumbers(nums ...int) <-chan int {
	out := make(chan int)
	go func() {
		defer close(out)
		for _, n := range nums {
			out <- n
		}
	}()
	return out
}

func square(in <-chan int) <-chan int {
	out := make(chan int)
	go func() {
		defer close(out)
		for n := range in {
			out <- n * n
		}
	}()
	return out
}

func merge(channels ...<-chan int) <-chan int {
	var wg sync.WaitGroup
	out := make(chan int)

	output := func(c <-chan int) {
		defer wg.Done()
		for n := range c {
			out <- n
		}
	}

	wg.Add(len(channels))
	for _, c := range channels {
		go output(c)
	}

	go func() {
		wg.Wait()
		close(out)
	}()

	return out
}

func FanInFanOutExample() {
	// Generate numbers
	in := generateNumbers(1, 2, 3, 4, 5)

	// Fan-out: multiple workers
	c1 := square(in)
	c2 := square(in)

	// Fan-in: merge results
	for n := range merge(c1, c2) {
		fmt.Println(n)
	}
}

// ============================================
// 4. SAFE CONCURRENT MAP ACCESS
// ============================================

type SafeMap struct {
	mu   sync.RWMutex
	data map[string]interface{}
}

func NewSafeMap() *SafeMap {
	return &SafeMap{
		data: make(map[string]interface{}),
	}
}

func (sm *SafeMap) Set(key string, value interface{}) {
	sm.mu.Lock()
	defer sm.mu.Unlock()
	sm.data[key] = value
}

func (sm *SafeMap) Get(key string) (interface{}, bool) {
	sm.mu.RLock()
	defer sm.mu.RUnlock()
	val, ok := sm.data[key]
	return val, ok
}

func SafeMapExample() {
	safeMap := NewSafeMap()
	var wg sync.WaitGroup

	// Concurrent writes
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func(n int) {
			defer wg.Done()
			safeMap.Set(fmt.Sprintf("key-%d", n), n)
		}(i)
	}

	wg.Wait()

	// Read
	if val, ok := safeMap.Get("key-50"); ok {
		fmt.Println("Value:", val)
	}
}

// ============================================
// 5. REST API PATTERNS
// ============================================

type User struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type UserHandler struct {
	users map[string]User
	mu    sync.RWMutex
}

func NewUserHandler() *UserHandler {
	return &UserHandler{
		users: make(map[string]User),
	}
}

func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	h.mu.Lock()
	h.users[user.ID] = user
	h.mu.Unlock()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "ID required", http.StatusBadRequest)
		return
	}

	h.mu.RLock()
	user, ok := h.users[id]
	h.mu.RUnlock()

	if !ok {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func (h *UserHandler) HealthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status": "healthy",
		"time":   time.Now().Format(time.RFC3339),
	})
}

// ============================================
// 6. MIDDLEWARE PATTERN
// ============================================

func LoggingMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		log.Printf("Started %s %s", r.Method, r.URL.Path)

		next(w, r)

		log.Printf("Completed in %v", time.Since(start))
	}
}

func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		token := r.Header.Get("Authorization")
		if token == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Validate token (simplified)
		if token != "Bearer valid-token" {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		next(w, r)
	}
}

// ============================================
// 7. GRACEFUL SHUTDOWN
// ============================================

func StartServerWithGracefulShutdown() {
	handler := NewUserHandler()

	mux := http.NewServeMux()
	mux.HandleFunc("/health", handler.HealthCheck)
	mux.HandleFunc("/users", LoggingMiddleware(handler.GetUser))
	mux.HandleFunc("/users/create", LoggingMiddleware(AuthMiddleware(handler.CreateUser)))

	srv := &http.Server{
		Addr:         ":8080",
		Handler:      mux,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	// Start server in goroutine
	go func() {
		log.Println("Server starting on :8080")
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed: %v", err)
		}
	}()

	// Wait for interrupt signal
	// quit := make(chan os.Signal, 1)
	// signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	// <-quit

	log.Println("Server shutting down...")

	// Graceful shutdown with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server stopped gracefully")
}

// ============================================
// 8. ERROR HANDLING PATTERNS
// ============================================

type AppError struct {
	Code    int
	Message string
	Err     error
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %v", e.Message, e.Err)
	}
	return e.Message
}

func (e *AppError) Unwrap() error {
	return e.Err
}

func ValidateUser(user User) error {
	if user.ID == "" {
		return &AppError{
			Code:    400,
			Message: "User ID is required",
		}
	}
	if user.Email == "" {
		return &AppError{
			Code:    400,
			Message: "Email is required",
		}
	}
	return nil
}

// ============================================
// 9. INTERFACE & DEPENDENCY INJECTION
// ============================================

// Define interfaces for testability
type UserRepository interface {
	Create(user User) error
	GetByID(id string) (User, error)
	Update(user User) error
	Delete(id string) error
}

type UserService struct {
	repo UserRepository
}

func NewUserService(repo UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) CreateUser(user User) error {
	if err := ValidateUser(user); err != nil {
		return err
	}
	return s.repo.Create(user)
}

// ============================================
// 10. RATE LIMITER
// ============================================

type RateLimiter struct {
	requests map[string]*RateLimit
	mu       sync.Mutex
	rate     int
	duration time.Duration
}

type RateLimit struct {
	count     int
	resetTime time.Time
}

func NewRateLimiter(rate int, duration time.Duration) *RateLimiter {
	return &RateLimiter{
		requests: make(map[string]*RateLimit),
		rate:     rate,
		duration: duration,
	}
}

func (rl *RateLimiter) Allow(key string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	limit, exists := rl.requests[key]

	if !exists || now.After(limit.resetTime) {
		rl.requests[key] = &RateLimit{
			count:     1,
			resetTime: now.Add(rl.duration),
		}
		return true
	}

	if limit.count < rl.rate {
		limit.count++
		return true
	}

	return false
}

func RateLimitMiddleware(limiter *RateLimiter) func(http.HandlerFunc) http.HandlerFunc {
	return func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			// Use IP as key (in production, use user ID or API key)
			key := r.RemoteAddr

			if !limiter.Allow(key) {
				http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
				return
			}

			next(w, r)
		}
	}
}

// ============================================
// MAIN - Run Examples
// ============================================

func main() {
	fmt.Println("=== Go Interview Practice Code ===\n")

	// 1. Worker Pool
	fmt.Println("1. Worker Pool Example:")
	WorkerPoolExample()
	fmt.Println()

	// 2. Context with Timeout
	fmt.Println("2. Context Example:")
	ContextExample()
	fmt.Println()

	// 3. Safe Map
	fmt.Println("3. Safe Map Example:")
	SafeMapExample()
	fmt.Println()

	// 4. Fan-In/Fan-Out
	fmt.Println("4. Fan-In/Fan-Out Example:")
	FanInFanOutExample()
	fmt.Println("")

	// 5. Rate Limiter Test
	fmt.Println("5. Rate Limiter Example:")
	limiter := NewRateLimiter(5, 10*time.Second)
	for i := 0; i < 7; i++ {
		if limiter.Allow("user1") {
			fmt.Printf("Request %d: Allowed\n", i+1)
		} else {
			fmt.Printf("Request %d: Rate limited\n", i+1)
		}
	}
	fmt.Println()

	// Note: Uncomment to start HTTP server
	// fmt.Println("6. Starting HTTP Server...")
	// StartServerWithGracefulShutdown()
}
