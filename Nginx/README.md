# Nginx - Complete Learning Guide

This repository contains a comprehensive guide to learning Nginx with practical examples and configurations. Nginx is a powerful, high-performance web server, reverse proxy, load balancer, and HTTP cache.

## Table of Contents

### 0. Introduction & Fundamentals

- [What is Nginx?](00-interview-preparation/README.md) - Comprehensive introduction to Nginx, its architecture, and use cases
- [Installation & Setup](00-interview-preparation/installation.md) - Installing Nginx on different platforms
- [Configuration Basics](00-interview-preparation/configuration-basics.md) - Understanding Nginx configuration files and directives

### 1. Web Server

- [Static File Serving](01-web-server/static-files.conf) - Serving static HTML, CSS, JavaScript files
- [Virtual Hosts](01-web-server/virtual-hosts.conf) - Configuring multiple websites on one server
- [Directory Indexing](01-web-server/directory-indexing.conf) - Enabling directory listings
- [Access Control](01-web-server/access-control.conf) - IP-based and authentication-based access

### 2. Reverse Proxy

- [Basic Reverse Proxy](02-reverse-proxy/basic-proxy.conf) - Forwarding requests to backend servers
- [Proxy Headers](02-reverse-proxy/proxy-headers.conf) - Configuring proxy headers correctly
- [WebSocket Support](02-reverse-proxy/websocket.conf) - Proxying WebSocket connections
- [SSL Termination](02-reverse-proxy/ssl-termination.conf) - Handling SSL at the proxy level

### 3. Load Balancer

- [Load Balancing Methods](03-load-balancer/load-balancing.conf) - Round-robin, least connections, IP hash
- [Health Checks](03-load-balancer/health-checks.conf) - Monitoring backend server health
- [Session Persistence](03-load-balancer/session-persistence.conf) - Sticky sessions and session affinity
- [Failover Configuration](03-load-balancer/failover.conf) - Handling server failures gracefully

### 4. HTTP Cache

- [Basic Caching](04-http-cache/basic-cache.conf) - Setting up HTTP caching
- [Cache Zones](04-http-cache/cache-zones.conf) - Configuring cache storage zones
- [Cache Invalidation](04-http-cache/cache-invalidation.conf) - Purging and invalidating cached content
- [Cache Headers](04-http-cache/cache-headers.conf) - Controlling cache behavior with headers

### 5. API Gateway

- [API Routing](05-api-gateway/api-routing.conf) - Routing API requests to different services
- [Rate Limiting](05-api-gateway/rate-limiting.conf) - Implementing request rate limits
- [Request Transformation](05-api-gateway/request-transformation.conf) - Modifying requests and responses
- [Authentication](05-api-gateway/authentication.conf) - API authentication and authorization

### 6. SSL/TLS Configuration

- [SSL Certificates](06-ssl-tls/ssl-certificates.conf) - Configuring SSL certificates
- [TLS Configuration](06-ssl-tls/tls-configuration.conf) - Modern TLS settings and best practices
- [HTTP to HTTPS Redirect](06-ssl-tls/https-redirect.conf) - Redirecting HTTP to HTTPS
- [Certificate Management](06-ssl-tls/certificate-management.md) - Let's Encrypt and certificate automation

### 7. Advanced Configuration

- [Location Blocks](07-advanced-configuration/location-blocks.conf) - Understanding location matching
- [Rewrite Rules](07-advanced-configuration/rewrite-rules.conf) - URL rewriting and redirects
- [Custom Logging](07-advanced-configuration/custom-logging.conf) - Advanced logging configuration
- [Security Headers](07-advanced-configuration/security-headers.conf) - Security best practices

### 8. Performance Optimization

- [Worker Processes](08-performance-optimization/worker-processes.conf) - Optimizing worker configuration
- [Connection Limits](08-performance-optimization/connection-limits.conf) - Managing connections and timeouts
- [Gzip Compression](08-performance-optimization/gzip-compression.conf) - Enabling compression
- [Caching Strategies](08-performance-optimization/caching-strategies.conf) - Performance through caching

## Getting Started

1. Install Nginx on your system:
   ```bash
   # Ubuntu/Debian
   sudo apt update && sudo apt install nginx
   
   # CentOS/RHEL
   sudo yum install nginx
   
   # macOS
   brew install nginx
   ```

2. Verify installation:
   ```bash
   nginx -v
   ```

3. Start Nginx:
   ```bash
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

4. Test configuration:
   ```bash
   sudo nginx -t
   ```

5. Reload configuration:
   ```bash
   sudo nginx -s reload
   ```

## Key Nginx Concepts

### Why Nginx?

- **High Performance**: Handles thousands of concurrent connections efficiently
- **Low Memory Footprint**: Uses event-driven architecture
- **Flexibility**: Can serve as web server, reverse proxy, load balancer, and more
- **Scalability**: Excellent for high-traffic websites and applications
- **Reliability**: Stable and production-tested

### Nginx Architecture

- **Master-Worker Process Model**: One master process manages multiple worker processes
- **Event-Driven**: Non-blocking, asynchronous I/O
- **Modular Design**: Extensible through modules
- **Configuration-Based**: Declarative configuration files

## Common Use Cases

### 1. Web Server
Serve static files and dynamic content for websites and web applications.

### 2. Reverse Proxy
Forward client requests to backend servers, hiding server details and providing a single entry point.

### 3. Load Balancer
Distribute incoming requests across multiple backend servers for high availability and performance.

### 4. HTTP Cache
Cache responses to reduce load on backend servers and improve response times.

### 5. API Gateway
Route, transform, and manage API requests with rate limiting, authentication, and monitoring.

## Best Practices

1. **Security**: Always use HTTPS, keep Nginx updated, implement security headers
2. **Performance**: Optimize worker processes, enable compression, use caching
3. **Monitoring**: Set up logging, use access logs for analytics, monitor error logs
4. **Configuration**: Keep configurations organized, use includes for modularity
5. **Testing**: Always test configuration before reloading in production

## Configuration File Structure

```
/etc/nginx/
├── nginx.conf              # Main configuration file
├── conf.d/                 # Additional configuration files
├── sites-available/        # Available site configurations
├── sites-enabled/          # Enabled site configurations (symlinks)
└── snippets/               # Reusable configuration snippets
```

## Essential Commands

```bash
# Test configuration
sudo nginx -t

# Reload configuration (graceful)
sudo nginx -s reload

# Stop Nginx
sudo nginx -s stop

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx

# View error log
sudo tail -f /var/log/nginx/error.log

# View access log
sudo tail -f /var/log/nginx/access.log
```

## Resources

- [Official Nginx Documentation](https://nginx.org/en/docs/)
- [Nginx Beginner's Guide](https://nginx.org/en/docs/beginners_guide.html)
- [Nginx Admin's Guide](https://nginx.org/en/docs/http/ngx_http_core_module.html)
- [Nginx Configuration Examples](https://www.nginx.com/resources/wiki/start/topics/examples/)
- [Nginx Performance Tuning](https://www.nginx.com/blog/tuning-nginx/)

## Common Patterns

### Basic Server Block

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

### Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.example.com;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Load Balancing

```nginx
upstream backend {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}

server {
    location / {
        proxy_pass http://backend;
    }
}
```

---

Happy configuring with Nginx! 🚀

