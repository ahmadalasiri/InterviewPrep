# Technical Questions - Answers

Answers to technical interview questions from Tyk interviews.

## Q1: What is Docker? How does it work within the k8s framework?

### What is Docker?

**Docker** is a containerization platform that packages applications and their dependencies into lightweight, portable containers. Containers are isolated environments that run consistently across different systems.

**Key Concepts:**

- **Container**: A lightweight, standalone executable package containing everything needed to run an application
- **Image**: A read-only template used to create containers
- **Dockerfile**: A text file with instructions to build an image
- **Docker Engine**: The runtime that builds and runs containers

**Benefits:**

- Consistency across environments (dev, staging, prod)
- Isolation between applications
- Resource efficiency (shared OS kernel)
- Fast deployment and scaling
- Easy dependency management

### How Docker works within Kubernetes

**Kubernetes (K8s)** is a container orchestration platform that manages containerized applications at scale. Docker containers are the runtime units that Kubernetes orchestrates.

**Relationship:**

1. **Container Runtime**: Kubernetes uses container runtimes (like Docker, containerd, CRI-O) to run containers
2. **Pod**: The smallest deployable unit in K8s, which can contain one or more containers
3. **Container Images**: Kubernetes pulls Docker images from registries and runs them as containers
4. **Orchestration**: K8s manages Docker containers across clusters (scheduling, scaling, networking, health checks)

**How it works:**

- **Image Registry**: Docker images stored in registries (Docker Hub, private registries)
- **Pod Creation**: K8s creates pods and instructs the container runtime to pull images and start containers
- **Container Runtime Interface (CRI)**: K8s communicates with container runtimes through CRI
- **Lifecycle Management**: K8s manages container lifecycle (start, stop, restart, scale)

**Example Flow:**

```
1. Developer builds Docker image → Push to registry
2. K8s deployment manifest references the image
3. K8s scheduler finds a node
4. Kubelet (on node) pulls image via container runtime
5. Container runtime (Docker/containerd) creates container from image
6. Container runs in a pod managed by K8s
```

**Note**: Modern Kubernetes often uses containerd (which Docker uses internally) rather than Docker directly, but the concepts remain the same.

---

## Q2: How does Go deal with asynchronicity?

Go handles asynchronicity primarily through **goroutines** and **channels**, which provide a simple and powerful model for concurrent programming.

### Goroutines

**Goroutines** are lightweight threads managed by the Go runtime. They're much lighter than OS threads.

**Key Features:**

- **Lightweight**: Start with ~2KB stack (grows as needed)
- **M:N Model**: Multiple goroutines mapped to fewer OS threads
- **Simple Syntax**: Just add `go` keyword before function call
- **Garbage Collected**: Managed by Go runtime

**Example:**

```go
// Sequential execution
doTask1()
doTask2()

// Concurrent execution
go doTask1()  // Runs in background
doTask2()     // Continues immediately
```

### Channels

**Channels** are typed conduits for communication between goroutines. They provide safe data sharing.

**Types:**

- **Unbuffered**: Synchronous, sender blocks until receiver ready
- **Buffered**: Asynchronous, sender blocks only when buffer full

**Example:**

```go
// Create channel
ch := make(chan int)

// Send in goroutine
go func() {
    ch <- 42  // Send value
}()

// Receive
value := <-ch  // Blocks until value received
```

### Select Statement

**Select** allows waiting on multiple channel operations, similar to switch but for channels.

**Example:**

```go
select {
case msg1 := <-ch1:
    // Handle msg1
case msg2 := <-ch2:
    // Handle msg2
case <-time.After(1 * time.Second):
    // Timeout
default:
    // Non-blocking
}
```

### Go's Concurrency Model

**CSP (Communicating Sequential Processes)**:

- "Don't communicate by sharing memory; share memory by communicating"
- Goroutines communicate via channels, not shared memory
- Reduces race conditions and makes code safer

**Advantages:**

- **No explicit locks needed** (for many cases)
- **Deadlock detection** by Go runtime
- **Simple mental model**: Channels for communication
- **Efficient**: M:N threading model

**Comparison with other languages:**

- **JavaScript**: Callbacks/Promises/async-await (event loop)
- **Java**: Threads, ExecutorService, CompletableFuture
- **Python**: Threading (GIL limits), asyncio
- **Go**: Goroutines + Channels (simpler, more efficient)

---

## Q3: Basic Kubernetes questions about pods, nodes, network (CKAD) - Basic concurrency questions in Go

### Kubernetes: Pods

**Pod** is the smallest deployable unit in Kubernetes.

**Key Points:**

- **One or more containers**: Usually one, but can have multiple (sidecar pattern)
- **Shared resources**: Containers in a pod share:
  - Network namespace (same IP, ports)
  - Storage volumes
  - IPC namespace
- **Lifecycle**: Pods are ephemeral, can be created/destroyed
- **Labels & Selectors**: Used to identify and group pods

**Example Pod:**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
    - name: app
      image: nginx:latest
      ports:
        - containerPort: 80
```

### Kubernetes: Nodes

**Node** is a worker machine in Kubernetes (physical or virtual).

**Types:**

- **Master/Control Plane Node**: Runs K8s control plane components
- **Worker Node**: Runs application workloads

**Node Components:**

- **Kubelet**: Agent that communicates with control plane
- **Container Runtime**: Runs containers (Docker, containerd)
- **Kube-proxy**: Network proxy for service networking

**Node States:**

- **Ready**: Node healthy and ready for pods
- **NotReady**: Node not ready (issues)
- **Unknown**: Can't communicate with node

### Kubernetes: Networking

**Pod Networking:**

- Each pod gets unique IP address
- Pods can communicate directly via IP
- Pod IPs are routable within cluster

**Service Networking:**

- **Service**: Stable network endpoint for pods
- **Types**:
  - **ClusterIP**: Internal cluster access (default)
  - **NodePort**: Expose on node IP
  - **LoadBalancer**: External load balancer
  - **ExternalName**: External service alias

**Network Policies:**

- Control traffic between pods
- Firewall-like rules
- Ingress/egress rules

**DNS:**

- Built-in DNS (CoreDNS)
- Service discovery via DNS names
- Format: `<service-name>.<namespace>.svc.cluster.local`

### Basic Concurrency in Go

**1. Starting Goroutines:**

```go
go func() {
    fmt.Println("Running in goroutine")
}()
```

**2. Channels for Communication:**

```go
ch := make(chan string)
go func() {
    ch <- "Hello"
}()
msg := <-ch
```

**3. WaitGroup for Synchronization:**

```go
var wg sync.WaitGroup
for i := 0; i < 3; i++ {
    wg.Add(1)
    go func(id int) {
        defer wg.Done()
        // Do work
    }(i)
}
wg.Wait()  // Wait for all goroutines
```

**4. Mutex for Shared State:**

```go
var mu sync.Mutex
var counter int

go func() {
    mu.Lock()
    counter++
    mu.Unlock()
}()
```

---

## Q4: In your own words, what is an API Gateway?

An **API Gateway** is a single entry point that sits between clients and backend services, acting as a reverse proxy that routes requests, handles cross-cutting concerns, and provides a unified interface.

### Core Functions

**1. Request Routing:**

- Routes incoming requests to appropriate backend services
- Acts as a single endpoint for multiple microservices
- Example: `/users/*` → User Service, `/orders/*` → Order Service

**2. Load Balancing:**

- Distributes requests across multiple instances
- Improves availability and performance
- Health checks to route only to healthy services

**3. Authentication & Authorization:**

- Centralized authentication (API keys, OAuth, JWT)
- Authorization policies
- Single sign-on (SSO) integration

**4. Rate Limiting & Throttling:**

- Controls request rate per client/API key
- Prevents abuse and ensures fair usage
- Protects backend from overload

**5. Request/Response Transformation:**

- Transforms data formats
- Aggregates responses from multiple services
- Protocol translation (REST, GraphQL, gRPC)

**6. Monitoring & Analytics:**

- Request logging and metrics
- Performance monitoring
- Usage analytics

**7. Security:**

- SSL/TLS termination
- DDoS protection
- Request validation
- CORS handling

### Benefits

- **Simplified Client**: Clients interact with one endpoint
- **Decoupling**: Backend services can change without affecting clients
- **Centralized Concerns**: Auth, rate limiting, logging in one place
- **Security**: Single point for security policies
- **Performance**: Caching, compression, response aggregation

### Example Flow

```
Client Request → API Gateway → [Auth Check] → [Rate Limit Check]
→ Route to Service → Backend Service → Response → [Transform]
→ [Cache] → Client
```

### Popular API Gateways

- **Kong**: Open-source, plugin-based
- **Tyk**: Open-source (Tyk's product!)
- **AWS API Gateway**: Managed service
- **NGINX**: Reverse proxy with API gateway features
- **KrakenD**: High-performance API gateway

---

## Q5: Questions about prior experience - Docker, Kubernetes, Go questions - Some conceptual CS questions

This question is asking you to discuss your experience. Here's a framework for answering:

### Docker Experience

**What to mention:**

- Projects where you used Docker
- Dockerfile creation and optimization
- Multi-stage builds
- Docker Compose for local development
- Containerization of applications
- Image optimization techniques

**Example Answer:**
"I've used Docker extensively in [project X]. I containerized a [Node.js/Python/Go] application, created optimized Dockerfiles using multi-stage builds, and set up Docker Compose for local development with databases and Redis. I also worked on reducing image sizes and improving build times."

### Kubernetes Experience

**What to mention:**

- Deploying applications to K8s
- Creating manifests (Deployments, Services, ConfigMaps)
- Understanding of pods, services, ingress
- Experience with kubectl
- Any managed K8s services (EKS, GKE, AKS)
- Helm charts if applicable

**Example Answer:**
"I've deployed microservices to Kubernetes clusters. I created Deployment and Service manifests, configured ConfigMaps and Secrets, and set up Ingress for external access. I'm familiar with kubectl commands for debugging and monitoring pods."

### Go Experience

**What to mention:**

- Projects built in Go
- Understanding of goroutines and channels
- Experience with Go's standard library
- Concurrency patterns
- Error handling in Go
- Any Go frameworks used (Gin, Echo, etc.)

**Example Answer:**
"I've built [API/service] in Go. I used goroutines for concurrent processing, channels for communication between goroutines, and implemented patterns like worker pools. I'm comfortable with Go's error handling and standard library."

### Conceptual CS Questions

Be prepared to discuss:

- **System Design**: Scalability, availability, consistency
- **Data Structures**: Arrays, maps, trees, graphs
- **Algorithms**: Sorting, searching, complexity analysis
- **Networking**: TCP/IP, HTTP, DNS
- **Operating Systems**: Processes, threads, memory management
- **Databases**: ACID, transactions, indexing

---

## Q6: Explain the difference between HTTP and HTTPS

### HTTP (HyperText Transfer Protocol)

**Characteristics:**

- **Unencrypted**: Data sent in plain text
- **Port 80**: Default port
- **No Security**: Vulnerable to interception and tampering
- **No Authentication**: Cannot verify server identity
- **Faster**: No encryption overhead (minimal)

**Security Issues:**

- **Man-in-the-Middle (MITM)**: Attackers can intercept and modify data
- **Eavesdropping**: Anyone on network can read data
- **Data Tampering**: Content can be modified
- **No Server Verification**: Can't verify you're talking to legitimate server

### HTTPS (HTTP Secure)

**Characteristics:**

- **Encrypted**: Data encrypted using SSL/TLS
- **Port 443**: Default port
- **Secure**: Protects against interception and tampering
- **Server Authentication**: Verifies server identity via certificates
- **Slightly Slower**: Encryption/decryption overhead (minimal with modern hardware)

**How HTTPS Works:**

1. **Client Request**: Client requests HTTPS connection
2. **Certificate Exchange**: Server sends SSL/TLS certificate
3. **Certificate Verification**: Client verifies certificate with Certificate Authority (CA)
4. **Key Exchange**: Client and server establish encryption keys
5. **Encrypted Communication**: All data encrypted before transmission
6. **Data Integrity**: Ensures data hasn't been tampered with

**SSL/TLS Protocol:**

- **Handshake**: Establishes secure connection
- **Symmetric Encryption**: Fast encryption for data transfer
- **Asymmetric Encryption**: Used for key exchange
- **Digital Certificates**: Verify server identity

### Key Differences Summary

| Feature            | HTTP            | HTTPS                                         |
| ------------------ | --------------- | --------------------------------------------- |
| **Encryption**     | No              | Yes (SSL/TLS)                                 |
| **Port**           | 80              | 443                                           |
| **Security**       | Vulnerable      | Secure                                        |
| **Certificate**    | Not required    | Required (SSL certificate)                    |
| **Data Integrity** | No guarantee    | Guaranteed                                    |
| **SEO**            | Lower ranking   | Higher ranking (Google preference)            |
| **Performance**    | Slightly faster | Slightly slower (negligible)                  |
| **Cost**           | Free            | Certificate cost (or free with Let's Encrypt) |

### When to Use Which

**Use HTTP for:**

- Internal networks (trusted)
- Development/testing
- Static content on trusted networks
- Legacy systems

**Use HTTPS for:**

- **Everything on public internet** (best practice)
- Login pages and authentication
- Payment processing
- Personal/sensitive data
- Modern web applications (required by browsers)
- SEO benefits

### Modern Web

- **Browsers mark HTTP as "Not Secure"**
- **HTTPS is now standard** for all websites
- **Free certificates** available (Let's Encrypt)
- **HTTP/2 and HTTP/3** work best with HTTPS
- **Required for many web features** (Service Workers, Geolocation API, etc.)

### Best Practices

- **Always use HTTPS** for production
- **Redirect HTTP to HTTPS**
- **Use HSTS** (HTTP Strict Transport Security)
- **Keep certificates updated**
- **Use strong cipher suites**

---

## Summary

These questions cover:

1. **Docker & Kubernetes**: Containerization and orchestration
2. **Go Concurrency**: Goroutines, channels, CSP model
3. **K8s Fundamentals**: Pods, nodes, networking
4. **API Gateway**: Centralized API management (Tyk's domain!)
5. **Experience Discussion**: Be ready to discuss your background
6. **HTTP vs HTTPS**: Security and encryption

Prepare specific examples from your experience for question 5, and be ready to dive deeper into any of these topics during the interview.
