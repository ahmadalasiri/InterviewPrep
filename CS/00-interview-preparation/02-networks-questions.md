# Computer Networks Interview Questions

Common interview questions about computer networks, protocols, network layers, and network concepts.

## Basic Concepts

### Q1: Explain the OSI model and its layers.

**Answer:**
The OSI (Open Systems Interconnection) model is a conceptual framework that standardizes the functions of a telecommunication or computing system into seven abstraction layers.

**7 Layers (from bottom to top):**

1. **Physical Layer**
   - Transmits raw bits over physical medium
   - Defines electrical and physical specifications
   - Examples: Ethernet cables, WiFi radio waves

2. **Data Link Layer**
   - Provides error detection and correction
   - Framing, MAC addressing
   - Examples: Ethernet, WiFi (802.11)

3. **Network Layer**
   - Routing packets across networks
   - Logical addressing (IP addresses)
   - Examples: IP, ICMP, routers

4. **Transport Layer**
   - End-to-end communication
   - Error recovery, flow control
   - Examples: TCP, UDP

5. **Session Layer**
   - Manages sessions between applications
   - Synchronization, checkpointing
   - Examples: NetBIOS, RPC

6. **Presentation Layer**
   - Data translation, encryption, compression
   - Format conversion
   - Examples: SSL/TLS, JPEG, MPEG

7. **Application Layer**
   - Interface for user applications
   - Network services to applications
   - Examples: HTTP, FTP, SMTP, DNS

### Q2: What is the difference between TCP and UDP?

**Answer:**

**TCP (Transmission Control Protocol):**
- **Connection-oriented**: Establishes connection before data transfer
- **Reliable**: Guarantees delivery, ordering, and error checking
- **Flow control**: Prevents sender from overwhelming receiver
- **Congestion control**: Adjusts transmission rate based on network conditions
- **Overhead**: Higher overhead due to connection management
- **Use cases**: Web browsing, email, file transfer

**UDP (User Datagram Protocol):**
- **Connectionless**: No connection establishment
- **Unreliable**: No guarantee of delivery or ordering
- **No flow control**: Sender can send at any rate
- **Lower overhead**: Minimal header
- **Faster**: No connection setup/teardown
- **Use cases**: Video streaming, DNS, online gaming, VoIP

**When to use which:**
- Use TCP when reliability is important (web, email)
- Use UDP when speed is critical and some data loss is acceptable (video, gaming)

### Q3: Explain the TCP three-way handshake.

**Answer:**
The three-way handshake establishes a TCP connection between client and server.

**Steps:**

1. **SYN**: Client sends SYN packet with initial sequence number
   - Client → Server: "I want to connect, my seq number is X"

2. **SYN-ACK**: Server responds with SYN-ACK
   - Server → Client: "ACK for your SYN, I want to connect too, my seq number is Y"

3. **ACK**: Client sends ACK
   - Client → Server: "ACK for your SYN, connection established"

**Why three steps?**
- Ensures both sides can send and receive
- Synchronizes sequence numbers
- Prevents old duplicate connections from causing confusion

**Connection Termination (Four-way handshake):**
1. FIN from one side
2. ACK for FIN
3. FIN from other side
4. ACK for second FIN

## HTTP/HTTPS

### Q4: What is the difference between HTTP and HTTPS?

**Answer:**

**HTTP (HyperText Transfer Protocol):**
- Unencrypted communication
- Port 80
- Data sent in plain text
- Vulnerable to man-in-the-middle attacks
- No authentication of server identity

**HTTPS (HTTP Secure):**
- Encrypted communication using SSL/TLS
- Port 443
- Data encrypted before transmission
- Server authentication via certificates
- Protects against eavesdropping and tampering

**How HTTPS works:**
1. Client requests HTTPS connection
2. Server sends SSL certificate
3. Client verifies certificate
4. Client and server establish encrypted session
5. Encrypted data exchange

### Q5: Explain HTTP methods (GET, POST, PUT, DELETE).

**Answer:**

**GET:**
- Retrieve data from server
- Idempotent (same request = same result)
- No request body
- Can be cached
- Should not modify server state

**POST:**
- Submit data to server
- Not idempotent
- Has request body
- Creates new resources
- Can modify server state

**PUT:**
- Update existing resource
- Idempotent
- Has request body
- Creates or replaces resource

**DELETE:**
- Delete resource
- Idempotent
- Removes resource from server

**Other methods:**
- PATCH: Partial update
- HEAD: Get headers only
- OPTIONS: Get allowed methods

## DNS

### Q6: How does DNS work?

**Answer:**
DNS (Domain Name System) translates human-readable domain names to IP addresses.

**Resolution Process:**

1. **Query**: User types domain name (e.g., www.example.com)
2. **Local Cache**: Check browser/OS cache
3. **Recursive Resolver**: Query DNS resolver (ISP or public DNS like 8.8.8.8)
4. **Root Server**: Resolver queries root DNS server
5. **TLD Server**: Root directs to Top-Level Domain server (.com)
6. **Authoritative Server**: TLD directs to domain's authoritative server
7. **Response**: IP address returned to user

**DNS Record Types:**
- **A**: IPv4 address
- **AAAA**: IPv6 address
- **CNAME**: Canonical name (alias)
- **MX**: Mail exchange
- **TXT**: Text records
- **NS**: Name server

**DNS Caching:**
- Results cached at multiple levels
- TTL (Time To Live) determines cache duration

## Network Protocols

### Q7: What is the difference between IPv4 and IPv6?

**Answer:**

**IPv4:**
- 32-bit addresses (4 bytes)
- ~4.3 billion addresses
- Dotted decimal notation (192.168.1.1)
- NAT commonly used
- Header checksum included

**IPv6:**
- 128-bit addresses (16 bytes)
- ~340 undecillion addresses
- Hexadecimal notation (2001:0db8:85a3::8a2e:0370:7334)
- No NAT needed
- Simplified header
- Built-in security (IPsec)
- Better support for mobile devices

**Why IPv6?**
- IPv4 address exhaustion
- Better routing efficiency
- Improved security
- Better support for mobile networks

### Q8: Explain load balancing.

**Answer:**
Load balancing distributes incoming network traffic across multiple servers to ensure no single server is overwhelmed.

**Benefits:**
- High availability
- Scalability
- Performance improvement
- Redundancy

**Load Balancing Algorithms:**

1. **Round Robin**: Distribute requests sequentially
2. **Least Connections**: Send to server with fewest active connections
3. **IP Hash**: Route based on client IP
4. **Weighted Round Robin**: Round robin with server weights
5. **Geographic**: Route based on geographic location

**Types:**
- **Hardware Load Balancer**: Dedicated device
- **Software Load Balancer**: Software solution (Nginx, HAProxy)
- **DNS Load Balancing**: Multiple IP addresses for domain
- **Application Load Balancer**: Layer 7 (HTTP/HTTPS)

## Network Security

### Q9: What is a firewall?

**Answer:**
A firewall is a network security device that monitors and controls incoming and outgoing network traffic based on predetermined security rules.

**Types:**

1. **Packet Filtering Firewall**
   - Examines packets
   - Filters based on IP, port, protocol
   - Fast but limited

2. **Stateful Firewall**
   - Tracks connection state
   - More intelligent filtering
   - Better security

3. **Application Firewall**
   - Layer 7 inspection
   - Understands application protocols
   - Can filter specific content

**Functions:**
- Block unauthorized access
- Allow legitimate traffic
- Log network activity
- Prevent attacks

### Q10: What is a CDN and how does it work?

**Answer:**
CDN (Content Delivery Network) is a distributed network of servers that deliver web content based on geographic proximity to users.

**How it works:**
1. User requests content
2. DNS routes to nearest CDN edge server
3. Edge server serves cached content
4. If not cached, fetches from origin server
5. Caches for future requests

**Benefits:**
- Reduced latency
- Lower bandwidth costs
- Improved availability
- Better performance globally
- DDoS protection

**Use cases:**
- Static assets (images, CSS, JS)
- Video streaming
- Software downloads
- Web applications

---

*Add more questions as you encounter them in interviews or study materials.*

