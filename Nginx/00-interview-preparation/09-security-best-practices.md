# Nginx Security Best Practices

## Overview

Security is critical when configuring Nginx. This guide covers essential security practices for Nginx configurations.

## SSL/TLS Configuration

### Modern TLS Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;
    
    # SSL certificates
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # TLS protocols (disable old versions)
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # Modern cipher suites
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    
    # Session configuration
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;
    
    # OCSP stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/nginx/ssl/chain.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

### HTTP to HTTPS Redirect

```nginx
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}
```

## Security Headers

### Essential Security Headers

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;
    
    # Prevent clickjacking
    add_header X-Frame-Options "SAMEORIGIN" always;
    
    # Prevent MIME type sniffing
    add_header X-Content-Type-Options "nosniff" always;
    
    # XSS protection
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Referrer policy
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Content Security Policy
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
    
    # HSTS (HTTP Strict Transport Security)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # Permissions Policy
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
}
```

## Hide Server Information

### Hide Nginx Version

```nginx
http {
    server_tokens off;  # Don't show Nginx version
}
```

### Custom Server Header

```nginx
http {
    more_set_headers "Server: WebServer";  # Requires headers-more module
}
```

## Access Control

### IP Whitelisting

```nginx
location /admin/ {
    allow 192.168.1.0/24;
    allow 10.0.0.0/8;
    deny all;
}
```

### IP Blacklisting

```nginx
location / {
    deny 192.168.1.100;
    deny 10.0.0.50;
    allow all;
}
```

### GeoIP Blocking

```nginx
# Requires GeoIP module
geo $blocked_country {
    default 0;
    CN 1;  # Block China
    RU 1;  # Block Russia
}

server {
    if ($blocked_country) {
        return 403;
    }
}
```

## Rate Limiting

### DDoS Protection

```nginx
# Limit requests per IP
limit_req_zone $binary_remote_addr zone=ddos:10m rate=10r/s;

# Limit connections per IP
limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

server {
    location / {
        limit_req zone=ddos burst=20 nodelay;
        limit_conn conn_limit 10;
    }
}
```

### Rate Limiting by Location

```nginx
limit_req_zone $binary_remote_addr zone=general:10m rate=100r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

server {
    location /login {
        limit_req zone=login burst=3 nodelay;
    }
    
    location / {
        limit_req zone=general burst=50 nodelay;
    }
}
```

## File Access Restrictions

### Deny Access to Hidden Files

```nginx
location ~ /\. {
    deny all;
    access_log off;
    log_not_found off;
}
```

### Deny Access to Sensitive Files

```nginx
location ~* \.(env|log|ini|conf|bak|sql|git)$ {
    deny all;
    access_log off;
    log_not_found off;
}
```

### Restrict File Upload Size

```nginx
http {
    client_max_body_size 10m;  # Default max body size
}

server {
    location /upload {
        client_max_body_size 100m;  # Larger for uploads
    }
}
```

## Authentication

### HTTP Basic Authentication

```nginx
location /admin/ {
    auth_basic "Admin Area";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
```

### Two-Factor Authentication

Use external authentication service or module.

## Request Validation

### Validate HTTP Methods

```nginx
location /api/ {
    if ($request_method !~ ^(GET|POST|PUT|DELETE)$) {
        return 405;
    }
}
```

### Validate Request Headers

```nginx
location /api/ {
    if ($http_user_agent ~* "bot|crawler|spider") {
        return 403;
    }
}
```

## Logging and Monitoring

### Security Logging

```nginx
log_format security '$remote_addr - $remote_user [$time_local] '
                   '"$request" $status $body_bytes_sent '
                   '"$http_referer" "$http_user_agent" '
                   'blocked=$blocked';

server {
    access_log /var/log/nginx/security.log security;
}
```

### Monitor Failed Logins

```nginx
# Log failed authentication attempts
map $status $log_me {
    ~^401  1;
    default 0;
}

server {
    access_log /var/log/nginx/failed.log combined if=$log_me;
}
```

## Module Security

### Disable Unused Modules

Compile Nginx with only needed modules.

### Keep Modules Updated

Regularly update Nginx and modules for security patches.

## Best Practices Summary

1. **Always Use HTTPS**: Encrypt all traffic
2. **Modern TLS**: Use TLS 1.2+ only
3. **Security Headers**: Implement all security headers
4. **Hide Server Info**: Don't expose version information
5. **Access Control**: Restrict access to sensitive areas
6. **Rate Limiting**: Protect against DDoS
7. **File Restrictions**: Deny access to sensitive files
8. **Regular Updates**: Keep Nginx updated
9. **Monitor Logs**: Watch for suspicious activity
10. **Least Privilege**: Run Nginx with minimal privileges

## Complete Secure Configuration

```nginx
http {
    server_tokens off;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=general:10m rate=100r/s;
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;
    
    server {
        listen 443 ssl http2;
        server_name example.com;
        
        # SSL/TLS
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_tickets off;
        
        # Security headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        
        # Rate limiting
        limit_req zone=general burst=50 nodelay;
        limit_conn conn_limit 10;
        
        # Deny hidden files
        location ~ /\. {
            deny all;
        }
        
        location / {
            root /var/www/html;
        }
    }
    
    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name example.com;
        return 301 https://$server_name$request_uri;
    }
}
```

