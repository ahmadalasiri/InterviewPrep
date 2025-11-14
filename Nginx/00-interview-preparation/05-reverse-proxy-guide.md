# Using Nginx as a Reverse Proxy

## Overview

A reverse proxy sits between clients and backend servers, forwarding client requests to backend servers and returning responses. Nginx is excellent as a reverse proxy due to its performance and flexibility.

## What is a Reverse Proxy?

### Forward Proxy vs Reverse Proxy

**Forward Proxy:**
- Client → Proxy → Internet
- Hides client identity
- Used by clients

**Reverse Proxy:**
- Internet → Proxy → Backend Servers
- Hides backend servers
- Used by servers

### Benefits of Reverse Proxy

1. **Load Distribution**: Distribute requests across multiple backends
2. **SSL Termination**: Handle SSL at proxy, reducing backend load
3. **Caching**: Cache responses to reduce backend load
4. **Security**: Hide backend server details
5. **Compression**: Compress responses before sending to clients
6. **Request/Response Modification**: Modify headers and content

## Basic Reverse Proxy Configuration

### Simple Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.example.com;
    
    location / {
        proxy_pass http://127.0.0.1:8080;
    }
}
```

### With Upstream Block

```nginx
upstream backend {
    server 127.0.0.1:8080;
}

server {
    listen 80;
    server_name api.example.com;
    
    location / {
        proxy_pass http://backend;
    }
}
```

## Essential Proxy Headers

### Standard Proxy Headers

```nginx
location / {
    proxy_pass http://backend;
    
    # Essential headers
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Port $server_port;
}
```

### Header Explanation

- **Host**: Original host header from client
- **X-Real-IP**: Client's real IP address
- **X-Forwarded-For**: Chain of IP addresses (client → proxy → ...)
- **X-Forwarded-Proto**: Original protocol (http/https)
- **X-Forwarded-Host**: Original host
- **X-Forwarded-Port**: Original port

## Complete Reverse Proxy Configuration

```nginx
upstream backend {
    server 127.0.0.1:8080;
    # server 127.0.0.1:8081 backup;  # Backup server
}

server {
    listen 80;
    server_name api.example.com;
    
    # Logging
    access_log /var/log/nginx/api.access.log;
    error_log /var/log/nginx/api.error.log;
    
    location / {
        proxy_pass http://backend;
        
        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffering
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
        
        # Don't pass these headers
        proxy_set_header Connection "";
    }
}
```

## Timeout Configuration

### Connection Timeouts

```nginx
location / {
    proxy_pass http://backend;
    
    # Connection timeout
    proxy_connect_timeout 60s;
    
    # Send timeout (time to send request to backend)
    proxy_send_timeout 60s;
    
    # Read timeout (time to read response from backend)
    proxy_read_timeout 60s;
}
```

### When to Adjust Timeouts

- **Long-running requests**: Increase timeouts for file uploads, processing
- **Fast backends**: Decrease timeouts to fail fast
- **Slow networks**: Increase timeouts for slow connections

## Buffering Configuration

### Understanding Buffering

**Buffering ON (default):**
- Nginx buffers response from backend
- Sends to client when complete
- Better for slow clients

**Buffering OFF:**
- Streams response directly to client
- Better for real-time applications

### Buffering Configuration

```nginx
location / {
    proxy_pass http://backend;
    
    # Enable/disable buffering
    proxy_buffering on;
    
    # Buffer sizes
    proxy_buffer_size 4k;           # First part of response
    proxy_buffers 8 4k;              # Number and size of buffers
    proxy_busy_buffers_size 8k;      # Buffers sent to client while reading
    proxy_temp_file_write_size 16k;  # Size of temporary file
    
    # Disable buffering for streaming
    # proxy_buffering off;
}
```

## WebSocket Proxying

### WebSocket Configuration

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

upstream websocket_backend {
    server 127.0.0.1:8080;
}

server {
    listen 80;
    server_name ws.example.com;
    
    location / {
        proxy_pass http://websocket_backend;
        
        # WebSocket headers
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        
        # Standard proxy headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # WebSocket timeouts (longer)
        proxy_read_timeout 86400s;
    }
}
```

## SSL Termination

### SSL at Nginx, HTTP to Backend

```nginx
upstream backend {
    server 127.0.0.1:8080;  # HTTP backend
}

server {
    listen 443 ssl http2;
    server_name api.example.com;
    
    # SSL configuration
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    location / {
        proxy_pass http://backend;  # HTTP to backend
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;  # Important!
    }
}
```

### SSL Pass-Through (Backend Handles SSL)

```nginx
upstream backend {
    server 127.0.0.1:8443;  # HTTPS backend
}

server {
    listen 80;
    server_name api.example.com;
    
    location / {
        proxy_pass https://backend;
        
        # SSL verification
        proxy_ssl_verify on;
        proxy_ssl_trusted_certificate /etc/nginx/ssl/ca.pem;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Request/Response Modification

### Modifying Request Headers

```nginx
location / {
    proxy_pass http://backend;
    
    # Add custom headers
    proxy_set_header X-Custom-Header "value";
    proxy_set_header X-API-Version "v2";
    
    # Remove headers
    proxy_set_header Accept-Encoding "";
}
```

### Modifying Response Headers

```nginx
location / {
    proxy_pass http://backend;
    
    # Hide backend server
    proxy_hide_header Server;
    proxy_hide_header X-Powered-By;
    
    # Add response headers
    add_header X-Proxy-Server "nginx" always;
}
```

## Error Handling

### Custom Error Pages

```nginx
location / {
    proxy_pass http://backend;
    
    # Intercept errors
    proxy_intercept_errors on;
    
    # Custom error pages
    error_page 502 503 504 /50x.html;
    
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

### Error Handling with Fallback

```nginx
location / {
    proxy_pass http://backend;
    
    # Try next upstream on error
    proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;
    proxy_next_upstream_tries 3;
    proxy_next_upstream_timeout 10s;
}
```

## Multiple Backend Services

### Routing to Different Backends

```nginx
upstream api_backend {
    server 127.0.0.1:8080;
}

upstream web_backend {
    server 127.0.0.1:8081;
}

server {
    listen 80;
    server_name example.com;
    
    # API requests
    location /api/ {
        proxy_pass http://api_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Web requests
    location / {
        proxy_pass http://web_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Health Checks (Nginx Plus)

### Active Health Checks

```nginx
upstream backend {
    zone backend 64k;
    server 127.0.0.1:8080;
    server 127.0.0.1:8081;
}

match server_ok {
    status 200;
    header Content-Type ~ "text/html";
    body ~ "Welcome";
}

server {
    location / {
        proxy_pass http://backend;
        health_check match=server_ok interval=5s fails=1 passes=1;
    }
}
```

*Note: Active health checks require Nginx Plus. Open source Nginx uses passive health checks.*

## Best Practices

1. **Always set proxy headers** - Especially Host, X-Real-IP, X-Forwarded-For
2. **Configure appropriate timeouts** - Based on your application needs
3. **Enable buffering** - Unless you need real-time streaming
4. **Use upstream blocks** - For better organization and load balancing
5. **Handle errors gracefully** - Set up error pages and fallbacks
6. **Monitor logs** - Check both access and error logs
7. **Test WebSocket support** - If your app uses WebSockets
8. **SSL termination** - Handle SSL at Nginx for better performance

## Common Issues

### 502 Bad Gateway

- Backend server is down
- Backend server not listening on expected port
- Firewall blocking connection
- Timeout too short

### 504 Gateway Timeout

- Backend taking too long to respond
- Increase `proxy_read_timeout`
- Check backend server performance

### Headers Not Passed

- Always set `Host` header
- Check `X-Forwarded-*` headers
- Verify backend reads these headers

### WebSocket Not Working

- Missing `Upgrade` and `Connection` headers
- Timeout too short
- Backend not configured for WebSocket

## Complete Example

```nginx
upstream app_backend {
    server 127.0.0.1:8080;
    server 127.0.0.1:8081 backup;
}

map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

server {
    listen 80;
    server_name app.example.com;
    
    # Logging
    access_log /var/log/nginx/app.access.log;
    error_log /var/log/nginx/app.error.log;
    
    # Main location
    location / {
        proxy_pass http://app_backend;
        
        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffering
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        
        # Error handling
        proxy_next_upstream error timeout http_500 http_502 http_503;
        proxy_intercept_errors on;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

