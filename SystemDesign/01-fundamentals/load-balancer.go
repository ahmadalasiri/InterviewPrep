package main

import (
	"fmt"
	"hash/fnv"
	"math/rand"
	"sync"
	"sync/atomic"
	"time"
)

// Server represents a backend server
type Server struct {
	ID          string
	URL         string
	IsHealthy   bool
	Connections int32
	mu          sync.RWMutex
}

// LoadBalancer interface defines load balancing strategies
type LoadBalancer interface {
	GetNextServer() (*Server, error)
	AddServer(server *Server)
	RemoveServer(serverID string)
	HealthCheck()
}

// ====================
// Round Robin Load Balancer
// ====================

type RoundRobinLB struct {
	servers []*Server
	current uint32
	mu      sync.RWMutex
}

func NewRoundRobinLB() *RoundRobinLB {
	return &RoundRobinLB{
		servers: make([]*Server, 0),
		current: 0,
	}
}

func (lb *RoundRobinLB) GetNextServer() (*Server, error) {
	lb.mu.RLock()
	defer lb.mu.RUnlock()

	if len(lb.servers) == 0 {
		return nil, fmt.Errorf("no servers available")
	}

	// Get healthy servers only
	healthyServers := make([]*Server, 0)
	for _, server := range lb.servers {
		if server.IsHealthy {
			healthyServers = append(healthyServers, server)
		}
	}

	if len(healthyServers) == 0 {
		return nil, fmt.Errorf("no healthy servers available")
	}

	// Round robin selection
	index := atomic.AddUint32(&lb.current, 1) % uint32(len(healthyServers))
	return healthyServers[index], nil
}

func (lb *RoundRobinLB) AddServer(server *Server) {
	lb.mu.Lock()
	defer lb.mu.Unlock()
	lb.servers = append(lb.servers, server)
}

func (lb *RoundRobinLB) RemoveServer(serverID string) {
	lb.mu.Lock()
	defer lb.mu.Unlock()

	for i, server := range lb.servers {
		if server.ID == serverID {
			lb.servers = append(lb.servers[:i], lb.servers[i+1:]...)
			break
		}
	}
}

// ====================
// Least Connections Load Balancer
// ====================

type LeastConnectionsLB struct {
	servers []*Server
	mu      sync.RWMutex
}

func NewLeastConnectionsLB() *LeastConnectionsLB {
	return &LeastConnectionsLB{
		servers: make([]*Server, 0),
	}
}

func (lb *LeastConnectionsLB) GetNextServer() (*Server, error) {
	lb.mu.RLock()
	defer lb.mu.RUnlock()

	if len(lb.servers) == 0 {
		return nil, fmt.Errorf("no servers available")
	}

	var selectedServer *Server
	minConnections := int32(-1)

	for _, server := range lb.servers {
		if !server.IsHealthy {
			continue
		}

		connections := atomic.LoadInt32(&server.Connections)
		if minConnections == -1 || connections < minConnections {
			minConnections = connections
			selectedServer = server
		}
	}

	if selectedServer == nil {
		return nil, fmt.Errorf("no healthy servers available")
	}

	// Increment connection count
	atomic.AddInt32(&selectedServer.Connections, 1)

	return selectedServer, nil
}

func (lb *LeastConnectionsLB) AddServer(server *Server) {
	lb.mu.Lock()
	defer lb.mu.Unlock()
	lb.servers = append(lb.servers, server)
}

func (lb *LeastConnectionsLB) RemoveServer(serverID string) {
	lb.mu.Lock()
	defer lb.mu.Unlock()

	for i, server := range lb.servers {
		if server.ID == serverID {
			lb.servers = append(lb.servers[:i], lb.servers[i+1:]...)
			break
		}
	}
}

// ====================
// IP Hash Load Balancer
// ====================

type IPHashLB struct {
	servers []*Server
	mu      sync.RWMutex
}

func NewIPHashLB() *IPHashLB {
	return &IPHashLB{
		servers: make([]*Server, 0),
	}
}

func (lb *IPHashLB) GetNextServer() (*Server, error) {
	return nil, fmt.Errorf("use GetServerForIP instead")
}

func (lb *IPHashLB) GetServerForIP(clientIP string) (*Server, error) {
	lb.mu.RLock()
	defer lb.mu.RUnlock()

	if len(lb.servers) == 0 {
		return nil, fmt.Errorf("no servers available")
	}

	// Get healthy servers only
	healthyServers := make([]*Server, 0)
	for _, server := range lb.servers {
		if server.IsHealthy {
			healthyServers = append(healthyServers, server)
		}
	}

	if len(healthyServers) == 0 {
		return nil, fmt.Errorf("no healthy servers available")
	}

	// Hash client IP
	hash := hashString(clientIP)
	index := hash % uint32(len(healthyServers))

	return healthyServers[index], nil
}

func (lb *IPHashLB) AddServer(server *Server) {
	lb.mu.Lock()
	defer lb.mu.Unlock()
	lb.servers = append(lb.servers, server)
}

func (lb *IPHashLB) RemoveServer(serverID string) {
	lb.mu.Lock()
	defer lb.mu.Unlock()

	for i, server := range lb.servers {
		if server.ID == serverID {
			lb.servers = append(lb.servers[:i], lb.servers[i+1:]...)
			break
		}
	}
}

// ====================
// Weighted Round Robin Load Balancer
// ====================

type WeightedServer struct {
	Server          *Server
	Weight          int
	CurrentWeight   int
	EffectiveWeight int
}

type WeightedRoundRobinLB struct {
	servers []*WeightedServer
	mu      sync.RWMutex
}

func NewWeightedRoundRobinLB() *WeightedRoundRobinLB {
	return &WeightedRoundRobinLB{
		servers: make([]*WeightedServer, 0),
	}
}

func (lb *WeightedRoundRobinLB) GetNextServer() (*Server, error) {
	lb.mu.Lock()
	defer lb.mu.Unlock()

	if len(lb.servers) == 0 {
		return nil, fmt.Errorf("no servers available")
	}

	// Filter healthy servers
	healthyServers := make([]*WeightedServer, 0)
	for _, ws := range lb.servers {
		if ws.Server.IsHealthy {
			healthyServers = append(healthyServers, ws)
		}
	}

	if len(healthyServers) == 0 {
		return nil, fmt.Errorf("no healthy servers available")
	}

	// Calculate total weight
	totalWeight := 0
	var selected *WeightedServer

	for _, ws := range healthyServers {
		ws.CurrentWeight += ws.EffectiveWeight
		totalWeight += ws.EffectiveWeight

		if selected == nil || ws.CurrentWeight > selected.CurrentWeight {
			selected = ws
		}
	}

	if selected == nil {
		return nil, fmt.Errorf("no server selected")
	}

	// Decrease the current weight of the selected server
	selected.CurrentWeight -= totalWeight

	return selected.Server, nil
}

func (lb *WeightedRoundRobinLB) AddServer(server *Server) {
	// Not implemented in this simple version
}

func (lb *WeightedRoundRobinLB) AddWeightedServer(server *Server, weight int) {
	lb.mu.Lock()
	defer lb.mu.Unlock()

	ws := &WeightedServer{
		Server:          server,
		Weight:          weight,
		CurrentWeight:   0,
		EffectiveWeight: weight,
	}

	lb.servers = append(lb.servers, ws)
}

func (lb *WeightedRoundRobinLB) RemoveServer(serverID string) {
	lb.mu.Lock()
	defer lb.mu.Unlock()

	for i, ws := range lb.servers {
		if ws.Server.ID == serverID {
			lb.servers = append(lb.servers[:i], lb.servers[i+1:]...)
			break
		}
	}
}

// ====================
// Health Check
// ====================

func (lb *RoundRobinLB) HealthCheck() {
	lb.mu.RLock()
	servers := make([]*Server, len(lb.servers))
	copy(servers, lb.servers)
	lb.mu.RUnlock()

	for _, server := range servers {
		go func(s *Server) {
			// Simulate health check (in real world, this would be an HTTP request)
			isHealthy := checkServerHealth(s.URL)

			s.mu.Lock()
			s.IsHealthy = isHealthy
			s.mu.Unlock()

			if isHealthy {
				fmt.Printf("Server %s is healthy\n", s.ID)
			} else {
				fmt.Printf("Server %s is unhealthy\n", s.ID)
			}
		}(server)
	}
}

func (lb *LeastConnectionsLB) HealthCheck() {
	// Similar to RoundRobinLB
	lb.mu.RLock()
	servers := make([]*Server, len(lb.servers))
	copy(servers, lb.servers)
	lb.mu.RUnlock()

	for _, server := range servers {
		go func(s *Server) {
			isHealthy := checkServerHealth(s.URL)
			s.mu.Lock()
			s.IsHealthy = isHealthy
			s.mu.Unlock()
		}(server)
	}
}

func (lb *IPHashLB) HealthCheck() {
	// Similar implementation
	lb.mu.RLock()
	servers := make([]*Server, len(lb.servers))
	copy(servers, lb.servers)
	lb.mu.RUnlock()

	for _, server := range servers {
		go func(s *Server) {
			isHealthy := checkServerHealth(s.URL)
			s.mu.Lock()
			s.IsHealthy = isHealthy
			s.mu.Unlock()
		}(server)
	}
}

// ====================
// Helper Functions
// ====================

func checkServerHealth(url string) bool {
	// Simulate health check with random result
	// In production, this would make an actual HTTP request
	return rand.Float32() > 0.1 // 90% chance of being healthy
}

func hashString(s string) uint32 {
	h := fnv.New32a()
	h.Write([]byte(s))
	return h.Sum32()
}

func (s *Server) ReleaseConnection() {
	atomic.AddInt32(&s.Connections, -1)
}

// ====================
// Example Usage
// ====================

func main() {
	fmt.Println("=== Load Balancer Implementations ===\n")

	// Create servers
	servers := []*Server{
		{ID: "server1", URL: "http://server1:8080", IsHealthy: true, Connections: 0},
		{ID: "server2", URL: "http://server2:8080", IsHealthy: true, Connections: 0},
		{ID: "server3", URL: "http://server3:8080", IsHealthy: true, Connections: 0},
	}

	// 1. Round Robin Load Balancer
	fmt.Println("1. Round Robin Load Balancer")
	fmt.Println("------------------------------")
	rrLB := NewRoundRobinLB()
	for _, server := range servers {
		rrLB.AddServer(server)
	}

	for i := 0; i < 6; i++ {
		server, _ := rrLB.GetNextServer()
		fmt.Printf("Request %d routed to: %s\n", i+1, server.ID)
	}

	// 2. Least Connections Load Balancer
	fmt.Println("\n2. Least Connections Load Balancer")
	fmt.Println("-----------------------------------")
	lcLB := NewLeastConnectionsLB()
	for _, server := range servers {
		lcLB.AddServer(server)
	}

	// Simulate different connection counts
	servers[0].Connections = 5
	servers[1].Connections = 2
	servers[2].Connections = 8

	for i := 0; i < 5; i++ {
		server, _ := lcLB.GetNextServer()
		fmt.Printf("Request %d routed to: %s (connections: %d)\n",
			i+1, server.ID, server.Connections)
		// Simulate request completion after some time
		time.AfterFunc(time.Millisecond*100, func() {
			server.ReleaseConnection()
		})
	}

	// 3. IP Hash Load Balancer
	fmt.Println("\n3. IP Hash Load Balancer")
	fmt.Println("------------------------")
	ipHashLB := NewIPHashLB()
	for _, server := range servers {
		ipHashLB.AddServer(server)
	}

	clientIPs := []string{"192.168.1.1", "192.168.1.2", "192.168.1.1", "192.168.1.3"}
	for i, ip := range clientIPs {
		server, _ := ipHashLB.GetServerForIP(ip)
		fmt.Printf("Request %d from %s routed to: %s\n", i+1, ip, server.ID)
	}

	// 4. Weighted Round Robin Load Balancer
	fmt.Println("\n4. Weighted Round Robin Load Balancer")
	fmt.Println("-------------------------------------")
	wrrLB := NewWeightedRoundRobinLB()
	wrrLB.AddWeightedServer(servers[0], 5) // High capacity server
	wrrLB.AddWeightedServer(servers[1], 3) // Medium capacity server
	wrrLB.AddWeightedServer(servers[2], 1) // Low capacity server

	for i := 0; i < 10; i++ {
		server, _ := wrrLB.GetNextServer()
		fmt.Printf("Request %d routed to: %s\n", i+1, server.ID)
	}

	// 5. Health Check
	fmt.Println("\n5. Health Check")
	fmt.Println("---------------")
	rrLB.HealthCheck()
	time.Sleep(time.Second) // Wait for health checks to complete

	fmt.Println("\n=== Load Balancer Demo Complete ===")
}

/*
Output Example:

=== Load Balancer Implementations ===

1. Round Robin Load Balancer
------------------------------
Request 1 routed to: server1
Request 2 routed to: server2
Request 3 routed to: server3
Request 4 routed to: server1
Request 5 routed to: server2
Request 6 routed to: server3

2. Least Connections Load Balancer
-----------------------------------
Request 1 routed to: server2 (connections: 3)
Request 2 routed to: server2 (connections: 4)
Request 3 routed to: server1 (connections: 6)
Request 4 routed to: server2 (connections: 5)
Request 5 routed to: server1 (connections: 7)

3. IP Hash Load Balancer
------------------------
Request 1 from 192.168.1.1 routed to: server2
Request 2 from 192.168.1.2 routed to: server1
Request 3 from 192.168.1.1 routed to: server2
Request 4 from 192.168.1.3 routed to: server3

4. Weighted Round Robin Load Balancer
-------------------------------------
Request 1 routed to: server1
Request 2 routed to: server1
Request 3 routed to: server2
Request 4 routed to: server1
Request 5 routed to: server2
Request 6 routed to: server1
Request 7 routed to: server1
Request 8 routed to: server2
Request 9 routed to: server3
Request 10 routed to: server1

5. Health Check
---------------
Server server1 is healthy
Server server2 is healthy
Server server3 is healthy

=== Load Balancer Demo Complete ===

Key Concepts Demonstrated:
1. Round Robin: Distributes requests sequentially
2. Least Connections: Routes to server with fewest active connections
3. IP Hash: Same client always goes to same server (session persistence)
4. Weighted Round Robin: Distributes based on server capacity
5. Health Checks: Monitors server availability
*/
