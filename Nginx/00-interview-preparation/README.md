# Nginx Interview Preparation Guide

This folder contains comprehensive information about Nginx, its architecture, use cases, and detailed guides on how to use it in various roles. Use this resource to prepare for DevOps, System Administrator, and Backend Engineer interviews.

## 📋 Table of Contents

### 1. [What is Nginx?](01-what-is-nginx.md)
- Introduction to Nginx
- History and development
- Architecture and design principles
- Comparison with other web servers

### 2. [Installation & Setup](02-installation-setup.md)
- Installing Nginx on different platforms
- Initial configuration
- Service management
- Verification and testing

### 3. [Configuration Fundamentals](03-configuration-fundamentals.md)
- Configuration file structure
- Directives and contexts
- Main configuration file
- Server blocks and location blocks

### 4. [Web Server Guide](04-web-server-guide.md)
- Serving static files
- Virtual hosts configuration
- Directory indexing
- Access control and authentication

### 5. [Reverse Proxy Guide](05-reverse-proxy-guide.md)
- Understanding reverse proxy
- Basic proxy configuration
- Proxy headers and forwarding
- WebSocket proxying
- SSL termination

### 6. [Load Balancer Guide](06-load-balancer-guide.md)
- Load balancing concepts
- Load balancing algorithms
- Health checks and monitoring
- Session persistence
- Failover strategies

### 7. [HTTP Cache Guide](07-http-cache-guide.md)
- Caching fundamentals
- Cache zones configuration
- Cache keys and invalidation
- Cache headers and directives
- Cache optimization

### 8. [API Gateway Guide](08-api-gateway-guide.md)
- API gateway patterns
- Request routing
- Rate limiting
- Request/response transformation
- Authentication and authorization

### 9. [Security Best Practices](09-security-best-practices.md)
- SSL/TLS configuration
- Security headers
- Access control
- DDoS protection
- Common vulnerabilities

### 10. [Performance Optimization](10-performance-optimization.md)
- Worker processes optimization
- Connection handling
- Compression
- Caching strategies
- Monitoring and tuning

## 🎯 Interview Preparation Strategy

### Before the Interview

1. **Understand Nginx Architecture** - Master the master-worker process model
2. **Know Configuration Syntax** - Understand directives, contexts, and blocks
3. **Practice Common Scenarios** - Web server, reverse proxy, load balancer
4. **Security Knowledge** - SSL/TLS, security headers, access control
5. **Performance Tuning** - Worker processes, caching, compression
6. **Troubleshooting** - Log analysis, error debugging, performance issues

### During the Interview

1. **Explain Concepts Clearly** - Use diagrams when possible
2. **Show Configuration Examples** - Provide actual Nginx config snippets
3. **Discuss Trade-offs** - Know when to use different approaches
4. **Security First** - Always mention security considerations
5. **Performance Awareness** - Discuss optimization strategies
6. **Real-World Experience** - Share practical examples from your work

## 📚 Key Topics to Master

### Essential Nginx Concepts

- [ ] Master-worker process model
- [ ] Event-driven architecture
- [ ] Configuration file structure
- [ ] Directives and contexts
- [ ] Server blocks and location blocks
- [ ] Request processing phases

### Web Server

- [ ] Static file serving
- [ ] Virtual hosts (server blocks)
- [ ] Directory indexing
- [ ] Access control (IP, auth)
- [ ] MIME types configuration
- [ ] Error pages customization

### Reverse Proxy

- [ ] Proxy_pass directive
- [ ] Proxy headers (Host, X-Real-IP, X-Forwarded-For)
- [ ] Upstream blocks
- [ ] WebSocket proxying
- [ ] SSL termination
- [ ] Timeout configuration

### Load Balancing

- [ ] Load balancing methods (round-robin, least_conn, ip_hash)
- [ ] Upstream server configuration
- [ ] Health checks (active and passive)
- [ ] Session persistence (sticky sessions)
- [ ] Weighted load balancing
- [ ] Failover and backup servers

### HTTP Caching

- [ ] Cache zones (proxy_cache_path)
- [ ] Cache keys and conditions
- [ ] Cache headers (Cache-Control, Expires)
- [ ] Cache invalidation (proxy_cache_purge)
- [ ] Cache bypass conditions
- [ ] Cache optimization strategies

### API Gateway

- [ ] Request routing based on URI, headers, methods
- [ ] Rate limiting (limit_req, limit_conn)
- [ ] Request/response transformation
- [ ] Authentication (JWT, API keys)
- [ ] CORS configuration
- [ ] Request logging and monitoring

### SSL/TLS

- [ ] SSL certificate configuration
- [ ] TLS protocols and ciphers
- [ ] HTTP to HTTPS redirects
- [ ] Certificate management (Let's Encrypt)
- [ ] OCSP stapling
- [ ] Perfect Forward Secrecy

### Advanced Topics

- [ ] URL rewriting (rewrite directive)
- [ ] Custom logging formats
- [ ] Access control lists
- [ ] GeoIP blocking
- [ ] Request rate limiting
- [ ] Custom error pages
- [ ] Module development

## 🚀 Quick Reference

### Nginx Command Line Tools

```bash
# Test configuration syntax
sudo nginx -t

# Test and show configuration files
sudo nginx -T

# Reload configuration (graceful)
sudo nginx -s reload

# Stop Nginx (graceful)
sudo nginx -s quit

# Stop Nginx (immediate)
sudo nginx -s stop

# Reopen log files
sudo nginx -s reopen

# Check Nginx version
nginx -v

# Check version and configuration options
nginx -V

# Start Nginx (systemd)
sudo systemctl start nginx

# Enable Nginx on boot
sudo systemctl enable nginx

# Check Nginx status
sudo systemctl status nginx

# View error log
sudo tail -f /var/log/nginx/error.log

# View access log
sudo tail -f /var/log/nginx/access.log
```

### Common Configuration Patterns

#### Basic Web Server

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/html;
    index index.html index.htm;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

#### Reverse Proxy

```nginx
upstream backend {
    server 127.0.0.1:8080;
}

server {
    listen 80;
    server_name api.example.com;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Load Balancer

```nginx
upstream app_servers {
    least_conn;
    server 192.168.1.10:8080 weight=3;
    server 192.168.1.11:8080 weight=2;
    server 192.168.1.12:8080 weight=1 backup;
}

server {
    listen 80;
    location / {
        proxy_pass http://app_servers;
    }
}
```

#### HTTP Cache

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=10g 
                 inactive=60m use_temp_path=off;

server {
    location / {
        proxy_cache my_cache;
        proxy_cache_valid 200 60m;
        proxy_cache_use_stale error timeout updating;
        proxy_pass http://backend;
    }
}
```

#### Rate Limiting

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

server {
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://backend;
    }
}
```

## 📖 Additional Resources

- [Official Nginx Documentation](https://nginx.org/en/docs/)
- [Nginx Beginner's Guide](https://nginx.org/en/docs/beginners_guide.html)
- [Nginx Admin's Guide](https://nginx.org/en/docs/http/ngx_http_core_module.html)
- [Nginx Configuration Examples](https://www.nginx.com/resources/wiki/start/topics/examples/)
- [Nginx Performance Tuning](https://www.nginx.com/blog/tuning-nginx/)
- [DigitalOcean Nginx Tutorials](https://www.digitalocean.com/community/tags/nginx)

## 💡 Pro Tips

1. **Always Test Configuration** - Use `nginx -t` before reloading
2. **Use Includes** - Organize configuration with include statements
3. **Monitor Logs** - Regularly check error and access logs
4. **Security First** - Always implement security headers and HTTPS
5. **Performance Matters** - Tune worker processes and enable caching
6. **Documentation** - Comment your configuration for future reference
7. **Version Control** - Keep Nginx configs in version control
8. **Backup Before Changes** - Always backup before modifying production configs

## 🔥 Common Interview Gotchas

1. **Location Block Matching** - Understand prefix, exact, and regex matching
2. **Proxy Headers** - Always set proper proxy headers for backend apps
3. **Cache Invalidation** - Know when and how to invalidate cache
4. **SSL/TLS Configuration** - Use modern TLS protocols and ciphers
5. **Worker Processes** - Set worker_processes to CPU cores
6. **Connection Limits** - Configure appropriate connection limits
7. **Error Handling** - Custom error pages and proper error logging
8. **Security Headers** - Implement security headers (HSTS, CSP, etc.)

## 🎓 Sample Interview Questions Overview

### Junior Level

- What is Nginx and how does it work?
- Explain the difference between Nginx and Apache
- How do you configure a basic web server in Nginx?
- What is a server block?
- How do you test Nginx configuration?

### Mid Level

- Explain Nginx master-worker architecture
- How do you configure Nginx as a reverse proxy?
- What are the different load balancing methods in Nginx?
- How do you set up HTTP caching in Nginx?
- Explain location block matching rules

### Senior Level

- Design a high-availability Nginx setup with load balancing
- How would you optimize Nginx for handling 100K concurrent connections?
- Implement rate limiting and DDoS protection
- Design an API gateway using Nginx
- Troubleshoot performance issues in a production Nginx setup

---

**Good luck with your Nginx interview! 🍀**

Remember: Demonstrate not just configuration knowledge, but also understanding of architecture, performance, security, and real-world problem-solving.

