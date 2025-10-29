# Quick Reference - Last Minute Prep

## 🚀 Must-Know Before Interview

### Golang Concurrency - The Most Important Topic

```go
// 1. Basic Goroutine
go func() {
    fmt.Println("Running concurrently")
}()

// 2. WaitGroup
var wg sync.WaitGroup
wg.Add(1)
go func() {
    defer wg.Done()
    // work
}()
wg.Wait()

// 3. Channels
ch := make(chan int)        // unbuffered
ch := make(chan int, 10)    // buffered
ch <- 42                     // send
val := <-ch                  // receive
close(ch)                    // close

// 4. Select
select {
case msg := <-ch1:
    fmt.Println(msg)
case msg := <-ch2:
    fmt.Println(msg)
case <-time.After(1 * time.Second):
    fmt.Println("timeout")
default:
    fmt.Println("no data")
}

// 5. Mutex
var mu sync.Mutex
mu.Lock()
// critical section
mu.Unlock()

// 6. RWMutex (prefer for read-heavy workloads)
var mu sync.RWMutex
mu.RLock()   // multiple readers can hold
mu.RUnlock()
mu.Lock()    // exclusive write
mu.Unlock()

// 7. Context
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

ctx, cancel := context.WithCancel(context.Background())
defer cancel()
```

---

## 🎯 Common Interview Questions & Quick Answers

### Q: What are goroutines?

**A:** Lightweight threads managed by Go runtime. Much cheaper than OS threads. Can create millions of goroutines. Scheduled by Go scheduler (M:N scheduling).

### Q: Difference between buffered and unbuffered channels?

**A:**

- **Unbuffered:** Sender blocks until receiver receives (synchronous)
- **Buffered:** Sender blocks only when buffer is full (asynchronous)

### Q: How to prevent goroutine leaks?

**A:**

```go
// Always provide a way to stop goroutines
ctx, cancel := context.WithCancel(context.Background())
defer cancel()

go func() {
    for {
        select {
        case <-ctx.Done():
            return // cleanup
        case msg := <-ch:
            // process
        }
    }
}()
```

### Q: Explain the select statement

**A:** Waits on multiple channel operations. Blocks until one case can proceed. If multiple ready, chooses randomly. Default case makes it non-blocking.

### Q: What is interface{} and when to use it?

**A:** Empty interface, can hold any type. Use sparingly - prefer concrete types or type parameters (generics). Common in JSON unmarshaling, generic containers.

```go
func Print(v interface{}) {
    // Type assertion
    if str, ok := v.(string); ok {
        fmt.Println("String:", str)
    }

    // Type switch
    switch v := v.(type) {
    case string:
        fmt.Println("String:", v)
    case int:
        fmt.Println("Int:", v)
    }
}
```

### Q: Difference between make and new?

**A:**

- **make:** For slices, maps, channels. Returns initialized (non-zeroed) value.
- **new:** Allocates zeroed memory. Returns pointer.

```go
slice := make([]int, 10)      // slice with length 10
m := make(map[string]int)     // initialized map
ch := make(chan int, 5)       // buffered channel

ptr := new(int)               // *int pointing to 0
```

### Q: How does Go's garbage collector work?

**A:** Concurrent, mark-and-sweep GC. Runs concurrently with program. Optimized for low latency. Uses write barriers. Can tune with GOGC env variable.

---

## 🗄️ Database Quick Tips

### PostgreSQL

```go
// Use pgx or sqlx
import "github.com/jackc/pgx/v5/pgxpool"

pool, _ := pgxpool.New(ctx, connString)
defer pool.Close()

// Query
row := pool.QueryRow(ctx, "SELECT name FROM users WHERE id = $1", id)
var name string
row.Scan(&name)

// Transaction
tx, _ := pool.Begin(ctx)
defer tx.Rollback(ctx)
tx.Exec(ctx, "INSERT ...")
tx.Commit(ctx)
```

### MongoDB

```go
import "go.mongodb.org/mongo-driver/mongo"

client, _ := mongo.Connect(ctx, options.Client().ApplyURI(uri))
defer client.Disconnect(ctx)

collection := client.Database("mydb").Collection("users")

// Insert
collection.InsertOne(ctx, bson.M{"name": "John", "age": 30})

// Find
var result User
collection.FindOne(ctx, bson.M{"name": "John"}).Decode(&result)

// Update
collection.UpdateOne(ctx,
    bson.M{"name": "John"},
    bson.M{"$set": bson.M{"age": 31}})
```

### Redis

```go
import "github.com/redis/go-redis/v9"

rdb := redis.NewClient(&redis.Options{
    Addr: "localhost:6379",
})

// Set
rdb.Set(ctx, "key", "value", 10*time.Minute)

// Get
val, _ := rdb.Get(ctx, "key").Result()

// Hash
rdb.HSet(ctx, "user:1", "name", "John", "age", 30)
```

---

## 🐳 Docker Quick Reference

```dockerfile
# Multi-stage build
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o main .

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]
```

```bash
# Build
docker build -t myapp:latest .

# Run
docker run -p 8080:8080 myapp:latest

# Docker Compose
docker-compose up -d
docker-compose down
docker-compose logs -f
```

---

## ☸️ Kubernetes Quick Reference

```yaml
# Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: myapp:latest
          ports:
            - containerPort: 8080
          livenessProbe:
            httpGet:
              path: /health
              port: 8080
          resources:
            requests:
              memory: "64Mi"
              cpu: "250m"
            limits:
              memory: "128Mi"
              cpu: "500m"

---
# Service
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
  ports:
    - port: 80
      targetPort: 8080
  type: LoadBalancer
```

```bash
# Common kubectl commands
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl exec -it <pod-name> -- /bin/sh
kubectl apply -f deployment.yaml
kubectl scale deployment myapp --replicas=5
kubectl rollout restart deployment myapp
```

---

## 🌐 REST API Best Practices

```go
// Standard HTTP handlers
func (h *Handler) GetUser(w http.ResponseWriter, r *http.Request) {
    // 1. Validate input
    id := r.URL.Query().Get("id")
    if id == "" {
        http.Error(w, "ID required", http.StatusBadRequest)
        return
    }

    // 2. Process
    user, err := h.service.GetUser(r.Context(), id)
    if err != nil {
        if errors.Is(err, ErrNotFound) {
            http.Error(w, "Not found", http.StatusNotFound)
            return
        }
        http.Error(w, "Internal error", http.StatusInternalServerError)
        return
    }

    // 3. Response
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(user)
}

// Standard status codes to use:
// 200 OK - Success
// 201 Created - Resource created
// 204 No Content - Success, no response body
// 400 Bad Request - Invalid input
// 401 Unauthorized - Not authenticated
// 403 Forbidden - Not authorized
// 404 Not Found - Resource not found
// 429 Too Many Requests - Rate limited
// 500 Internal Server Error - Server error
// 503 Service Unavailable - Temporarily unavailable
```

---

## 📊 Big O Complexity (Know These!)

### Data Structures

| Operation | Array | Slice  | Map  | Channel |
| --------- | ----- | ------ | ---- | ------- |
| Access    | O(1)  | O(1)   | O(1) | -       |
| Insert    | O(n)  | O(1)\* | O(1) | O(1)    |
| Delete    | O(n)  | O(n)   | O(1) | -       |
| Search    | O(n)  | O(n)   | O(1) | -       |

\*Amortized

### Algorithms

- **Binary Search:** O(log n)
- **Quick Sort:** O(n log n) average
- **Merge Sort:** O(n log n)
- **BFS/DFS:** O(V + E)
- **Dijkstra:** O((V + E) log V)

---

## 🔥 Last-Minute Checklist

### Technical Preparation

- [ ] Review concurrency patterns
- [ ] Practice explaining goroutines vs threads
- [ ] Know your channel patterns (fan-in, fan-out, worker pool)
- [ ] Understand context usage
- [ ] Remember common middleware patterns
- [ ] Know Docker multi-stage builds
- [ ] Understand K8s basic resources (Pods, Deployments, Services)

### System Design

- [ ] Can explain microservices architecture
- [ ] Know CAP theorem
- [ ] Understand caching strategies
- [ ] Can discuss database sharding
- [ ] Know message queue patterns
- [ ] Understand load balancing
- [ ] Can explain circuit breakers

### Your Projects

- [ ] Pick 2-3 projects to discuss in depth
- [ ] Know the architecture
- [ ] Remember challenges you faced
- [ ] Know the tech stack used
- [ ] Can discuss trade-offs made
- [ ] Prepared metrics/impact numbers

### Behavioral

- [ ] Have STAR stories ready (Situation, Task, Action, Result)
- [ ] Prepare questions to ask them
- [ ] Know why you want to work at Classera
- [ ] Ready to discuss your strengths
- [ ] Prepared to discuss areas for growth

---

## 💬 Questions to Ask Them

### Technical Stack

1. What's your current Go version and why?
2. How do you structure your microservices?
3. What databases are you using?
4. How do you handle service-to-service communication?
5. What's your deployment process?

### Team & Culture

1. How is the engineering team structured?
2. What does a typical day look like?
3. How do you approach code reviews?
4. What's your testing strategy?
5. How do you handle on-call rotations?

### Growth & Learning

1. What are the biggest technical challenges ahead?
2. How do you support professional development?
3. What does success look like in the first 90 days?
4. What technologies is the team excited about?

### Product & Business

1. What's the company's north star metric?
2. How does engineering collaborate with product?
3. What's the product roadmap look like?

---

## 🎯 During the Interview

### Do's

✅ Think out loud - show your reasoning
✅ Ask clarifying questions
✅ Discuss trade-offs
✅ Write clean, readable code
✅ Test your code with examples
✅ Consider edge cases
✅ Show enthusiasm
✅ Be honest about what you don't know

### Don'ts

❌ Jump into coding without understanding
❌ Stay silent while thinking
❌ Ignore edge cases
❌ Write messy, uncommented code
❌ Pretend to know everything
❌ Be negative about previous employers
❌ Focus only on first solution (explore better options)

---

## 🧠 Mental Preparation

### Night Before

- Review this document
- Get good sleep (8 hours!)
- Prepare your interview space
- Test your equipment (camera, mic)
- Have water ready

### Morning Of

- Light breakfast
- Review key concepts (30 min)
- Warm up with 1-2 easy coding problems
- Positive mindset - you're prepared!

### During Interview

- Take a deep breath before answering
- It's okay to pause and think
- Show your problem-solving process
- Be yourself - they're evaluating culture fit too

---

## 🚀 You're Ready!

**Remember:**

- You have the knowledge
- You've done the preparation
- They want you to succeed
- Be confident but humble
- Show your passion for technology

**Most Important:**

- **Communicate clearly**
- **Think systematically**
- **Show your reasoning**
- **Be collaborative**

---

### Final Words

The fact that you've prepared this much shows your dedication. You're going to do great! Trust in your preparation, be yourself, and show them why you're the right person for this role.

**Good luck! You've got this! 🚀🎯💪**

