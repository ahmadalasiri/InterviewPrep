# Using Nginx as a Load Balancer

## Overview

Nginx can distribute incoming requests across multiple backend servers, providing high availability, scalability, and performance. This guide covers configuring Nginx as a load balancer.

## Load Balancing Concepts

### What is Load Balancing?

Load balancing distributes incoming network traffic across multiple backend servers to:
- **Improve Performance**: Distribute load evenly
- **Increase Availability**: If one server fails, others handle traffic
- **Scale Horizontally**: Add more servers as needed
- **Handle High Traffic**: Multiple servers handle more requests

### Load Balancing Methods

Nginx supports several load balancing algorithms:

1. **Round Robin** (default)
2. **Least Connections**
3. **IP Hash**
4. **Generic Hash**
5. **Weighted Round Robin**

## Basic Load Balancer Configuration

### Simple Load Balancer

```nginx
upstream backend {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}

server {
    listen 80;
    server_name example.com;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Load Balancing Methods

### 1. Round Robin (Default)

Distributes requests evenly across all servers in sequence.

```nginx
upstream backend {
    # Round robin is default, no directive needed
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}
```

**Request Distribution:**
- Request 1 → Server 1
- Request 2 → Server 2
- Request 3 → Server 3
- Request 4 → Server 1 (cycle repeats)

### 2. Weighted Round Robin

Assign different weights to servers based on capacity.

```nginx
upstream backend {
    server 192.168.1.10:8080 weight=3;  # Gets 3x more requests
    server 192.168.1.11:8080 weight=2;  # Gets 2x more requests
    server 192.168.1.12:8080 weight=1;  # Gets 1x requests
}
```

**Request Distribution (6 requests):**
- Server 1: 3 requests
- Server 2: 2 requests
- Server 3: 1 request

### 3. Least Connections

Routes requests to the server with the fewest active connections.

```nginx
upstream backend {
    least_conn;
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}
```

**Use Case:** When servers have varying response times or processing capabilities.

### 4. IP Hash

Routes requests based on client IP address, ensuring same client goes to same server.

```nginx
upstream backend {
    ip_hash;
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}
```

**Use Case:** Session persistence (sticky sessions) when backend doesn't share sessions.

**Note:** If a server is down, IP hash is recalculated.

### 5. Generic Hash

Routes based on a custom key (URL, header, etc.).

```nginx
upstream backend {
    hash $request_uri consistent;  # Hash based on request URI
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}
```

**Use Case:** Cache affinity - same resource always goes to same server.

## Server Parameters

### Basic Parameters

```nginx
upstream backend {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}
```

### Weight

```nginx
upstream backend {
    server 192.168.1.10:8080 weight=3;
    server 192.168.1.11:8080 weight=2;
    server 192.168.1.12:8080 weight=1;
}
```

### Max Fails and Fail Timeout

```nginx
upstream backend {
    server 192.168.1.10:8080 max_fails=3 fail_timeout=30s;
    server 192.168.1.11:8080 max_fails=3 fail_timeout=30s;
    server 192.168.1.12:8080 max_fails=3 fail_timeout=30s;
}
```

- **max_fails**: Number of failed requests before marking server as down
- **fail_timeout**: Time server is considered down before retry

### Backup Server

```nginx
upstream backend {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080 backup;  # Used only when others are down
}
```

### Down Server

```nginx
upstream backend {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080 down;  # Permanently disabled
    server 192.168.1.12:8080;
}
```

### Slow Start (Nginx Plus)

```nginx
upstream backend {
    server 192.168.1.10:8080 slow_start=30s;
    server 192.168.1.11:8080 slow_start=30s;
}
```

*Note: Requires Nginx Plus*

## Health Checks

### Passive Health Checks (Open Source)

Nginx automatically marks servers as down after `max_fails` failures.

```nginx
upstream backend {
    server 192.168.1.10:8080 max_fails=3 fail_timeout=30s;
    server 192.168.1.11:8080 max_fails=3 fail_timeout=30s;
    server 192.168.1.12:8080 max_fails=3 fail_timeout=30s;
}
```

### Active Health Checks (Nginx Plus)

```nginx
upstream backend {
    zone backend 64k;
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}

match server_ok {
    status 200;
    header Content-Type ~ "text/html";
}

server {
    location / {
        proxy_pass http://backend;
        health_check match=server_ok interval=5s fails=1 passes=1;
    }
}
```

*Note: Active health checks require Nginx Plus*

## Session Persistence (Sticky Sessions)

### Using IP Hash

```nginx
upstream backend {
    ip_hash;  # Same IP always goes to same server
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}
```

### Using Cookie (Nginx Plus)

```nginx
upstream backend {
    sticky cookie srv_id expires=1h domain=.example.com path=/;
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}
```

*Note: Cookie-based sticky sessions require Nginx Plus*

### Using Application-Level Sessions

Best practice: Use shared session storage (Redis, database) instead of sticky sessions.

## Complete Load Balancer Configuration

```nginx
upstream app_backend {
    least_conn;  # Use least connections method
    
    server 192.168.1.10:8080 weight=3 max_fails=3 fail_timeout=30s;
    server 192.168.1.11:8080 weight=2 max_fails=3 fail_timeout=30s;
    server 192.168.1.12:8080 weight=1 max_fails=3 fail_timeout=30s;
    server 192.168.1.13:8080 backup;  # Backup server
}

server {
    listen 80;
    server_name example.com;
    
    # Logging
    access_log /var/log/nginx/lb.access.log;
    error_log /var/log/nginx/lb.error.log;
    
    location / {
        proxy_pass http://app_backend;
        
        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 10s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Retry on failure
        proxy_next_upstream error timeout http_500 http_502 http_503 http_504;
        proxy_next_upstream_tries 3;
        proxy_next_upstream_timeout 10s;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

## Multiple Upstream Groups

### Different Services

```nginx
# API backend
upstream api_backend {
    least_conn;
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
}

# Web backend
upstream web_backend {
    ip_hash;  # Session persistence
    server 192.168.1.20:8080;
    server 192.168.1.21:8080;
}

server {
    listen 80;
    server_name example.com;
    
    # API requests
    location /api/ {
        proxy_pass http://api_backend;
        proxy_set_header Host $host;
    }
    
    # Web requests
    location / {
        proxy_pass http://web_backend;
        proxy_set_header Host $host;
    }
}
```

## SSL/TLS with Load Balancing

### SSL Termination at Nginx

```nginx
upstream backend {
    server 192.168.1.10:8080;  # HTTP backend
    server 192.168.1.11:8080;
}

server {
    listen 443 ssl http2;
    server_name example.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

## Monitoring and Logging

### Enhanced Logging

```nginx
log_format upstream_log '$remote_addr - $remote_user [$time_local] '
                       '"$request" $status $body_bytes_sent '
                       '"$http_referer" "$http_user_agent" '
                       'upstream: $upstream_addr '
                       'response_time: $upstream_response_time';

server {
    access_log /var/log/nginx/lb.access.log upstream_log;
    
    location / {
        proxy_pass http://backend;
    }
}
```

### Status Module (Nginx Plus)

```nginx
server {
    listen 8080;
    
    location /status {
        stub_status on;
        access_log off;
        allow 127.0.0.1;
        deny all;
    }
}
```

*Note: Basic status requires stub_status module, detailed stats require Nginx Plus*

## Best Practices

1. **Choose the Right Method**
   - Round robin: Equal capacity servers
   - Least connections: Varying response times
   - IP hash: Session persistence needed
   - Weighted: Different server capacities

2. **Configure Health Checks**
   - Set appropriate `max_fails` and `fail_timeout`
   - Monitor server health
   - Use backup servers for critical services

3. **Handle Failures Gracefully**
   - Use `proxy_next_upstream` for retries
   - Configure backup servers
   - Set appropriate timeouts

4. **Session Management**
   - Prefer shared session storage over sticky sessions
   - Use IP hash only when necessary
   - Consider application-level session sharing

5. **Monitor Performance**
   - Log upstream response times
   - Monitor error rates
   - Track server utilization

6. **Security**
   - Use SSL/TLS
   - Restrict access to backend servers
   - Implement rate limiting

## Common Scenarios

### High Availability

```nginx
upstream backend {
    server 192.168.1.10:8080 max_fails=2 fail_timeout=10s;
    server 192.168.1.11:8080 max_fails=2 fail_timeout=10s;
    server 192.168.1.12:8080 backup;
}
```

### Performance Optimization

```nginx
upstream backend {
    least_conn;
    server 192.168.1.10:8080 weight=3;
    server 192.168.1.11:8080 weight=3;
    server 192.168.1.12:8080 weight=2;
}
```

### Session Persistence

```nginx
upstream backend {
    ip_hash;
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}
```

## Troubleshooting

### Server Not Receiving Requests

- Check if server is marked as `down`
- Verify `max_fails` hasn't been exceeded
- Check network connectivity
- Verify server is listening on correct port

### Uneven Load Distribution

- Check server weights
- Verify load balancing method
- Check if some servers are marked as down
- Monitor connection counts

### Session Issues

- Verify IP hash is configured correctly
- Check if client IPs are changing (behind proxy)
- Consider using shared session storage
- Verify cookie-based sticky sessions (Nginx Plus)

## Resources

- [Nginx Load Balancing](https://nginx.org/en/docs/http/load_balancing.html)
- [Nginx Upstream Module](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)

