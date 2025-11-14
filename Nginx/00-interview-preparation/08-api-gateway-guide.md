# Using Nginx as API Gateway

## Overview

An API Gateway is a single entry point for all API requests, providing routing, authentication, rate limiting, request transformation, and monitoring. Nginx can serve as a powerful API gateway.

## What is an API Gateway?

An API Gateway sits between clients and backend services, providing:

1. **Request Routing**: Route requests to appropriate services
2. **Authentication/Authorization**: Verify and authorize requests
3. **Rate Limiting**: Control request rates
4. **Request/Response Transformation**: Modify requests and responses
5. **Monitoring & Logging**: Track API usage and performance
6. **Load Balancing**: Distribute requests across services
7. **SSL Termination**: Handle SSL/TLS at gateway
8. **Caching**: Cache responses to reduce backend load

## Basic API Gateway Configuration

### Simple API Gateway

```nginx
upstream api_service {
    server 127.0.0.1:8080;
}

server {
    listen 80;
    server_name api.example.com;
    
    location / {
        proxy_pass http://api_service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Request Routing

### Route by Path

```nginx
# User service
upstream user_service {
    server 127.0.0.1:8081;
}

# Product service
upstream product_service {
    server 127.0.0.1:8082;
}

# Order service
upstream order_service {
    server 127.0.0.1:8083;
}

server {
    listen 80;
    server_name api.example.com;
    
    # Route to user service
    location /api/users/ {
        proxy_pass http://user_service;
        proxy_set_header Host $host;
    }
    
    # Route to product service
    location /api/products/ {
        proxy_pass http://product_service;
        proxy_set_header Host $host;
    }
    
    # Route to order service
    location /api/orders/ {
        proxy_pass http://order_service;
        proxy_set_header Host $host;
    }
}
```

### Route by Header

```nginx
map $http_api_version $backend {
    default "v1";
    "v2" "v2";
}

upstream api_v1 {
    server 127.0.0.1:8081;
}

upstream api_v2 {
    server 127.0.0.1:8082;
}

server {
    location /api/ {
        set $upstream $backend;
        proxy_pass http://api_$upstream;
    }
}
```

### Route by HTTP Method

```nginx
server {
    location /api/data/ {
        # GET requests to read service
        if ($request_method = GET) {
            proxy_pass http://read_service;
        }
        
        # POST/PUT/DELETE to write service
        if ($request_method ~ ^(POST|PUT|DELETE)$) {
            proxy_pass http://write_service;
        }
    }
}
```

## Rate Limiting

### Basic Rate Limiting

```nginx
# Define rate limit zone
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

server {
    listen 80;
    server_name api.example.com;
    
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://backend;
    }
}
```

**Parameters:**
- **zone**: Rate limit zone name and size
- **rate**: Requests per second (r/s) or per minute (r/m)
- **burst**: Allow burst of requests
- **nodelay**: Don't delay requests within burst

### Multiple Rate Limits

```nginx
# General API limit
limit_req_zone $binary_remote_addr zone=general:10m rate=100r/s;

# Strict limit for auth endpoints
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;

server {
    location /api/auth/ {
        limit_req zone=auth burst=5 nodelay;
        proxy_pass http://auth_service;
    }
    
    location /api/ {
        limit_req zone=general burst=50 nodelay;
        proxy_pass http://backend;
    }
}
```

### Rate Limiting by IP and Key

```nginx
# Limit by IP
limit_req_zone $binary_remote_addr zone=ip_limit:10m rate=10r/s;

# Limit by API key
limit_req_zone $http_x_api_key zone=key_limit:10m rate=100r/s;

server {
    location /api/ {
        # Apply both limits
        limit_req zone=ip_limit burst=20;
        limit_req zone=key_limit burst=200;
        proxy_pass http://backend;
    }
}
```

### Connection Limiting

```nginx
# Limit concurrent connections
limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

server {
    location /api/ {
        limit_conn conn_limit 10;  # Max 10 connections per IP
        proxy_pass http://backend;
    }
}
```

## Authentication

### API Key Authentication

```nginx
map $http_x_api_key $api_key_valid {
    default 0;
    "key123" 1;
    "key456" 1;
}

server {
    location /api/ {
        if ($api_key_valid = 0) {
            return 401 "Invalid API Key";
        }
        
        proxy_pass http://backend;
    }
}
```

### JWT Authentication (Basic)

```nginx
# Note: Full JWT validation requires Lua or external service

location /api/ {
    # Check for JWT token
    if ($http_authorization = "") {
        return 401 "Missing Authorization header";
    }
    
    # Forward to auth service for validation
    # Or use nginx-jwt module
    proxy_pass http://backend;
    proxy_set_header Authorization $http_authorization;
}
```

### Basic Authentication

```nginx
location /api/admin/ {
    auth_basic "Admin API";
    auth_basic_user_file /etc/nginx/.htpasswd;
    
    proxy_pass http://backend;
}
```

## Request/Response Transformation

### Request Headers

```nginx
location /api/ {
    proxy_pass http://backend;
    
    # Add custom headers
    proxy_set_header X-API-Version "v2";
    proxy_set_header X-Client-ID $http_x_client_id;
    
    # Remove headers
    proxy_set_header Accept-Encoding "";
    
    # Modify headers
    proxy_set_header Host api-internal.example.com;
}
```

### URL Rewriting

```nginx
location /api/v1/ {
    # Rewrite /api/v1/users to /users
    rewrite ^/api/v1/(.*)$ /$1 break;
    proxy_pass http://backend;
}

location /api/v2/ {
    # Rewrite /api/v2/users to /v2/users
    rewrite ^/api/v2/(.*)$ /v2/$1 break;
    proxy_pass http://backend;
}
```

### Response Headers

```nginx
location /api/ {
    proxy_pass http://backend;
    
    # Hide backend headers
    proxy_hide_header X-Powered-By;
    proxy_hide_header Server;
    
    # Add gateway headers
    add_header X-Gateway "nginx" always;
    add_header X-Request-ID $request_id always;
}
```

## CORS Configuration

### Basic CORS

```nginx
location /api/ {
    # Handle preflight requests
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;
        return 204;
    }
    
    # Add CORS headers to responses
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
    
    proxy_pass http://backend;
}
```

### Secure CORS

```nginx
map $http_origin $cors_origin {
    default "";
    "~^https?://(.*\.)?example\.com$" $http_origin;
}

server {
    location /api/ {
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' $cors_origin always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
            return 204;
        }
        
        add_header 'Access-Control-Allow-Origin' $cors_origin always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        
        proxy_pass http://backend;
    }
}
```

## Request Validation

### Validate Request Size

```nginx
server {
    client_max_body_size 10m;  # Max request body size
    
    location /api/upload/ {
        client_max_body_size 100m;  # Larger for uploads
        proxy_pass http://backend;
    }
}
```

### Validate HTTP Methods

```nginx
location /api/data/ {
    # Only allow GET and POST
    if ($request_method !~ ^(GET|POST)$) {
        return 405;
    }
    
    proxy_pass http://backend;
}
```

## Logging and Monitoring

### Custom Log Format

```nginx
log_format api_log '$remote_addr - $remote_user [$time_local] '
                   '"$request" $status $body_bytes_sent '
                   '"$http_referer" "$http_user_agent" '
                   'rt=$request_time '
                   'upstream=$upstream_addr '
                   'upstream_time=$upstream_response_time '
                   'api_key=$http_x_api_key';

server {
    access_log /var/log/nginx/api.log api_log;
    
    location /api/ {
        proxy_pass http://backend;
    }
}
```

### Request ID

```nginx
map $request_id $request_id_header {
    default $request_id;
    "" $pid-$msec-$remote_addr-$request_length;
}

server {
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header X-Request-ID $request_id_header;
        add_header X-Request-ID $request_id_header always;
    }
}
```

## Complete API Gateway Example

```nginx
# Rate limit zones
limit_req_zone $binary_remote_addr zone=general:10m rate=100r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;
limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

# Upstream services
upstream user_service {
    server 127.0.0.1:8081;
}

upstream product_service {
    server 127.0.0.1:8082;
}

upstream auth_service {
    server 127.0.0.1:8083;
}

# API key validation
map $http_x_api_key $api_key_valid {
    default 0;
    "key123" 1;
    "key456" 1;
}

# CORS origin
map $http_origin $cors_origin {
    default "";
    "~^https?://(.*\.)?example\.com$" $http_origin;
}

# Log format
log_format api_log '$remote_addr - [$time_local] "$request" $status '
                   'rt=$request_time upstream=$upstream_addr '
                   'api_key=$http_x_api_key';

server {
    listen 80;
    server_name api.example.com;
    
    access_log /var/log/nginx/api.log api_log;
    
    # CORS preflight
    location /api/ {
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' $cors_origin always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type, X-API-Key' always;
            return 204;
        }
        
        # API key check
        if ($api_key_valid = 0) {
            return 401 "Invalid API Key";
        }
        
        # Rate limiting
        limit_req zone=general burst=50 nodelay;
        limit_conn conn_limit 10;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' $cors_origin always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        
        # Gateway headers
        add_header X-Gateway "nginx" always;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # Auth service - stricter limits
    location /api/auth/ {
        limit_req zone=auth burst=5 nodelay;
        proxy_pass http://auth_service;
        proxy_set_header Host $host;
    }
    
    # User service
    location /api/users/ {
        limit_req zone=general burst=50;
        proxy_pass http://user_service;
        proxy_set_header Host $host;
    }
    
    # Product service
    location /api/products/ {
        limit_req zone=general burst=50;
        proxy_pass http://product_service;
        proxy_set_header Host $host;
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

## Best Practices

1. **Use Rate Limiting**: Protect backend services from overload
2. **Implement Authentication**: Verify API keys or tokens
3. **Route Intelligently**: Use path, header, or method-based routing
4. **Monitor Everything**: Log requests, response times, errors
5. **Handle CORS**: Configure CORS properly for web clients
6. **Validate Requests**: Check request size, methods, headers
7. **Add Request IDs**: Track requests across services
8. **Error Handling**: Return appropriate error codes and messages
9. **Security Headers**: Add security headers to responses
10. **Documentation**: Document API endpoints and usage

## Common Patterns

### Versioning

```nginx
location /api/v1/ {
    rewrite ^/api/v1/(.*)$ /v1/$1 break;
    proxy_pass http://v1_backend;
}

location /api/v2/ {
    rewrite ^/api/v2/(.*)$ /v2/$1 break;
    proxy_pass http://v2_backend;
}
```

### Service Discovery

```nginx
# Use DNS for service discovery
upstream api_service {
    server api-service-1.internal:8080;
    server api-service-2.internal:8080;
    server api-service-3.internal:8080;
}
```

### Circuit Breaker Pattern

```nginx
# Use max_fails for basic circuit breaking
upstream api_service {
    server 127.0.0.1:8080 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:8081 backup;
}
```

## Resources

- [Nginx Rate Limiting](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html)
- [Nginx API Gateway Patterns](https://www.nginx.com/blog/deploying-nginx-plus-as-an-api-gateway-part-1/)

