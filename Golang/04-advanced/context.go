package main

import (
	"context"
	"fmt"
	"math/rand"
	"net/http"
	"time"
)

/*
===========================================
INTERVIEW QUESTIONS & ANSWERS - Context
===========================================

Q1: What is the purpose of context.Context in Go?
A: Context is used to carry deadlines, cancellation signals, and request-scoped values
   across API boundaries and between goroutines. It helps manage the lifecycle of
   long-running operations and enables proper cancellation and timeout handling.

Q2: What are the main types of contexts in Go?
A: - context.Background(): Root context, never canceled, no deadline
   - context.TODO(): Placeholder when unsure which context to use
   - context.WithCancel(parent): Returns context that can be manually canceled
   - context.WithTimeout(parent, duration): Cancels after a duration
   - context.WithDeadline(parent, time): Cancels at a specific time
   - context.WithValue(parent, key, value): Carries request-scoped values

Q3: Why should you always call the cancel function returned by context?
A: Calling cancel() releases resources associated with the context, such as timers and
   goroutines. Failing to call cancel can cause resource leaks. Best practice is to
   defer cancel() immediately after creating a cancellable context.

Q4: When should you use context.Background() vs context.TODO()?
A: - context.Background(): Use as the root context at the start of requests, in main(),
     in tests, or when you have a clear starting point.
   - context.TODO(): Use as a placeholder during refactoring when the proper context
     isn't yet clear or available.

Q5: What are the best practices for passing context values?
A: - Use context values sparingly for request-scoped data only
   - Store: user IDs, auth tokens, request IDs, trace information
   - Don't store: optional function parameters, application config
   - Use typed keys (custom types) to avoid collisions
   - Check for nil and type assert safely when retrieving values

Q6: How do you check if a context has been canceled?
A: Use the Done() channel and Err() method:
   select {
   case <-ctx.Done():
       // Context canceled
       err := ctx.Err() // Returns context.Canceled or context.DeadlineExceeded
   }

Q7: Why should context be the first parameter in functions?
A: Convention: func DoSomething(ctx context.Context, arg string) error
   Benefits:
   - Consistent API design
   - Clear intent of context propagation
   - Easy to identify context-aware functions
   - Facilitates proper cancellation and timeout handling

Q8: Should you store Context in a struct?
A: No. Context should be passed explicitly as a function parameter, not stored in structs.
   Contexts are request-scoped and storing them can lead to:
   - Using wrong context for different requests
   - Difficulty in testing
   - Unclear lifecycle management

Q9: What's the difference between ctx.Err() returning context.Canceled vs context.DeadlineExceeded?
A: - context.Canceled: Context was explicitly canceled via cancel() function
   - context.DeadlineExceeded: Context's deadline or timeout was reached
   Both indicate the operation should stop, but provide different reasons.

Q10: How do contexts work in HTTP handlers?
A: HTTP requests come with a context accessible via r.Context(). This context:
   - Is canceled when the client disconnects
   - Carries request-scoped values
   - Should be passed to database calls, external APIs, etc.
   - Can be extended with timeout: ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
*/

// Context in Go - Managing Request-Scoped Values, Cancellation, and Deadlines
func main() {
	fmt.Println("=== Context in Go ===")

	// 1. Basic context usage
	basicContextDemo()

	// 2. Context with timeout
	contextWithTimeoutDemo()

	// 3. Context with deadline
	contextWithDeadlineDemo()

	// 4. Context with cancellation
	contextWithCancelDemo()

	// 5. Context with values
	contextWithValuesDemo()

	// 6. Context in HTTP servers
	contextInHTTPDemo()

	// 7. Context best practices
	contextBestPracticesDemo()
}

// Basic context usage
func basicContextDemo() {
	fmt.Println("\n--- Basic Context Usage ---")

	// Background context - never canceled, has no values, no deadline
	// Use as the top-level context
	ctx := context.Background()
	fmt.Printf("Background context: %v\n", ctx)

	// TODO context - placeholder when you're unsure which context to use
	// or when the function hasn't been extended to accept a context parameter
	todoCtx := context.TODO()
	fmt.Printf("TODO context: %v\n", todoCtx)

	// Both Background and TODO return empty contexts
	// Background is typically used at the beginning of a request or operation
}

func contextWithTimeoutDemo() {
	fmt.Println("\n--- Context with Timeout ---")

	// Create a context that will be canceled after 2 seconds
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel() // Always call cancel to release resources

	// Start a slow operation
	go slowOperation(ctx, "Operation 1", 1*time.Second)

	// Start an operation that will timeout
	go slowOperation(ctx, "Operation 2", 3*time.Second)

	// Wait for operations to complete or timeout
	time.Sleep(3 * time.Second)

	fmt.Println("All operations finished or timed out")
}

func slowOperation(ctx context.Context, name string, duration time.Duration) {
	select {
	case <-time.After(duration):
		fmt.Printf("%s completed successfully\n", name)
	case <-ctx.Done():
		fmt.Printf("%s canceled: %v\n", name, ctx.Err())
	}
}

func contextWithDeadlineDemo() {
	fmt.Println("\n--- Context with Deadline ---")

	// Create a context with a specific deadline
	deadline := time.Now().Add(1500 * time.Millisecond)
	ctx, cancel := context.WithDeadline(context.Background(), deadline)
	defer cancel()

	fmt.Printf("Deadline set to: %v\n", deadline)

	// Check if deadline is set
	if d, ok := ctx.Deadline(); ok {
		fmt.Printf("Context deadline: %v\n", d)
		fmt.Printf("Time until deadline: %v\n", time.Until(d))
	}

	// Perform operation with deadline
	result := make(chan string, 1)

	go func() {
		time.Sleep(1 * time.Second)
		result <- "Operation completed"
	}()

	select {
	case res := <-result:
		fmt.Println(res)
	case <-ctx.Done():
		fmt.Printf("Deadline exceeded: %v\n", ctx.Err())
	}
}

func contextWithCancelDemo() {
	fmt.Println("\n--- Context with Cancellation ---")

	// Create a cancellable context
	ctx, cancel := context.WithCancel(context.Background())

	// Start multiple goroutines
	for i := 1; i <= 3; i++ {
		go worker(ctx, i)
	}

	// Let workers run for 2 seconds
	time.Sleep(2 * time.Second)

	// Cancel the context - all workers will stop
	fmt.Println("Canceling context...")
	cancel()

	// Give workers time to cleanup
	time.Sleep(500 * time.Millisecond)
	fmt.Println("All workers stopped")
}

func worker(ctx context.Context, id int) {
	for {
		select {
		case <-ctx.Done():
			fmt.Printf("Worker %d stopped: %v\n", id, ctx.Err())
			return
		default:
			fmt.Printf("Worker %d is working...\n", id)
			time.Sleep(500 * time.Millisecond)
		}
	}
}

func contextWithValuesDemo() {
	fmt.Println("\n--- Context with Values ---")

	// Context values are for request-scoped data
	// Use sparingly - prefer explicit parameters

	type contextKey string

	const (
		userIDKey    contextKey = "userID"
		requestIDKey contextKey = "requestID"
		roleKey      contextKey = "role"
	)

	// Create context with values
	ctx := context.Background()
	ctx = context.WithValue(ctx, userIDKey, "user123")
	ctx = context.WithValue(ctx, requestIDKey, "req-456")
	ctx = context.WithValue(ctx, roleKey, "admin")

	// Retrieve values from context
	processRequest(ctx)
}

func processRequest(ctx context.Context) {
	type contextKey string

	const (
		userIDKey    contextKey = "userID"
		requestIDKey contextKey = "requestID"
		roleKey      contextKey = "role"
	)

	// Extract values from context
	userID, ok := ctx.Value(userIDKey).(string)
	if ok {
		fmt.Printf("User ID: %s\n", userID)
	}

	requestID, ok := ctx.Value(requestIDKey).(string)
	if ok {
		fmt.Printf("Request ID: %s\n", requestID)
	}

	role, ok := ctx.Value(roleKey).(string)
	if ok {
		fmt.Printf("Role: %s\n", role)
	}

	// Process with context
	authorizeUser(ctx)
	logRequest(ctx)
}

func authorizeUser(ctx context.Context) {
	type contextKey string
	const roleKey contextKey = "role"

	if role, ok := ctx.Value(roleKey).(string); ok {
		if role == "admin" {
			fmt.Println("User authorized as admin")
		} else {
			fmt.Println("User has limited access")
		}
	}
}

func logRequest(ctx context.Context) {
	type contextKey string
	const requestIDKey contextKey = "requestID"

	if reqID, ok := ctx.Value(requestIDKey).(string); ok {
		fmt.Printf("Logging request: %s\n", reqID)
	}
}

func contextInHTTPDemo() {
	fmt.Println("\n--- Context in HTTP Servers ---")

	// Note: This is a demonstration - not running actual server
	fmt.Println("HTTP handler example:")

	// Simulate HTTP handler
	handler := http.HandlerFunc(exampleHandler)

	// Create a mock request with context
	req, _ := http.NewRequest("GET", "http://example.com", nil)
	ctx := req.Context()

	// Add values to context
	type contextKey string
	ctx = context.WithValue(ctx, contextKey("requestID"), "req-789")
	req = req.WithContext(ctx)

	fmt.Println("Handler called with context")
	// In real scenario: handler.ServeHTTP(nil, req)
	_ = handler
	_ = req

	fmt.Println("\nIn HTTP handlers:")
	fmt.Println("- Use r.Context() to get the request context")
	fmt.Println("- Context is canceled when client disconnects")
	fmt.Println("- Pass context to database calls, external APIs, etc.")
}

func exampleHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// Simulate database operation with context
	result, err := queryDatabase(ctx, "SELECT * FROM users")
	if err != nil {
		if err == context.Canceled {
			fmt.Println("Request was canceled")
			return
		}
		fmt.Printf("Error: %v\n", err)
		return
	}

	fmt.Printf("Query result: %s\n", result)
}

func queryDatabase(ctx context.Context, query string) (string, error) {
	// Simulate database query
	result := make(chan string, 1)

	go func() {
		time.Sleep(time.Duration(rand.Intn(1000)) * time.Millisecond)
		result <- fmt.Sprintf("Result for: %s", query)
	}()

	select {
	case res := <-result:
		return res, nil
	case <-ctx.Done():
		return "", ctx.Err()
	}
}

func contextBestPracticesDemo() {
	fmt.Println("\n--- Context Best Practices ---")

	fmt.Println("\n1. Always pass Context as the first parameter:")
	fmt.Println("   func DoSomething(ctx context.Context, arg string) error")

	fmt.Println("\n2. Don't store Context in structs:")
	fmt.Println("   - Pass context explicitly to methods")
	fmt.Println("   - Context is request-scoped, not struct-scoped")

	fmt.Println("\n3. Always call the cancel function:")
	fmt.Println("   ctx, cancel := context.WithCancel(parent)")
	fmt.Println("   defer cancel() // Always defer cancel")

	fmt.Println("\n4. Use context.Background() for top-level context:")
	fmt.Println("   - In main()")
	fmt.Println("   - In tests")
	fmt.Println("   - At the start of a request")

	fmt.Println("\n5. Use context.TODO() when unsure:")
	fmt.Println("   - Placeholder for refactoring")
	fmt.Println("   - When context propagation isn't clear yet")

	fmt.Println("\n6. Context values should be request-scoped:")
	fmt.Println("   - User ID, Request ID, Authentication tokens")
	fmt.Println("   - NOT for optional parameters to functions")
	fmt.Println("   - Use typed keys (not strings)")

	fmt.Println("\n7. Check for cancellation in long-running operations:")
	demonstrateCancellationCheck()

	fmt.Println("\n8. Propagate context through call chains:")
	ctx := context.Background()
	demonstrateContextPropagation(ctx)
}

func demonstrateCancellationCheck() {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
	defer cancel()

	for i := 0; i < 10; i++ {
		// Check if context is done
		select {
		case <-ctx.Done():
			fmt.Printf("   Stopped at iteration %d: %v\n", i, ctx.Err())
			return
		default:
			// Continue working
			time.Sleep(30 * time.Millisecond)
		}
	}
}

func demonstrateContextPropagation(ctx context.Context) {
	// Layer 1
	fmt.Println("   -> Service Layer")
	serviceLayerFunction(ctx)
}

func serviceLayerFunction(ctx context.Context) {
	// Layer 2
	fmt.Println("      -> Repository Layer")
	repositoryLayerFunction(ctx)
}

func repositoryLayerFunction(ctx context.Context) {
	// Layer 3
	fmt.Println("         -> Database Layer")
	fmt.Println("         Context propagated through all layers!")
}

// Real-world example: Context with multiple features
func realWorldExample() {
	fmt.Println("\n--- Real-World Example ---")

	// Create parent context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Add request-scoped values
	type contextKey string
	ctx = context.WithValue(ctx, contextKey("userID"), "user-12345")
	ctx = context.WithValue(ctx, contextKey("requestID"), "req-67890")

	// Process API request
	if err := processAPIRequest(ctx); err != nil {
		fmt.Printf("API request failed: %v\n", err)
	}
}

func processAPIRequest(ctx context.Context) error {
	// Check authentication
	type contextKey string
	userID, ok := ctx.Value(contextKey("userID")).(string)
	if !ok {
		return fmt.Errorf("user not authenticated")
	}

	fmt.Printf("Processing request for user: %s\n", userID)

	// Make database calls with context
	if err := fetchUserData(ctx, userID); err != nil {
		return fmt.Errorf("failed to fetch user data: %w", err)
	}

	// Make external API call with context
	if err := callExternalAPI(ctx); err != nil {
		return fmt.Errorf("failed to call external API: %w", err)
	}

	return nil
}

func fetchUserData(ctx context.Context, userID string) error {
	// Simulate database query
	select {
	case <-time.After(500 * time.Millisecond):
		fmt.Printf("User data fetched for: %s\n", userID)
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}

func callExternalAPI(ctx context.Context) error {
	// Simulate API call
	select {
	case <-time.After(800 * time.Millisecond):
		fmt.Println("External API call successful")
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}

