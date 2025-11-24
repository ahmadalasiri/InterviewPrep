# API Gateway Interview Questions

Common interview questions about API Gateways, their features, and popular implementations.

## API Gateway Fundamentals

### Q1: What is an API Gateway and why do we need it?

**Answer:**

An API Gateway is a single entry point for all client requests to backend microservices. It acts as a reverse proxy that routes requests to appropriate services.

**Key Functions:**

1. **Request Routing**: Routes requests to appropriate microservices
2. **Protocol Translation**: Converts between different protocols (REST, gRPC, GraphQL)
3. **Authentication & Authorization**: Centralized security
4. **Rate Limiting**: Controls request rate per client/API
5. **Load Balancing**: Distributes traffic across service instances
6. **Request/Response Transformation**: Modifies requests/responses
7. **Caching**: Caches responses to reduce backend load
8. **Logging & Monitoring**: Centralized logging and metrics
9. **Circuit Breaker**: Prevents cascading failures
10. **API Versioning**: Manages multiple API versions

**Benefits:**

- **Single Entry Point**: Clients only need to know one endpoint
- **Decoupling**: Clients don't need to know about microservices
- **Security**: Centralized authentication/authorization
- **Performance**: Caching and request optimization
- **Monitoring**: Centralized metrics and logging
- **Simplified Client**: Clients don't need to handle multiple endpoints

**Architecture:**

```
Client → API Gateway → [Service 1, Service 2, Service 3, ...]
```

---

### Q2: What are the main features of an API Gateway?

**Answer:**

**1. Request Routing & Load Balancing**

- Route requests based on path, headers, or query parameters
- Load balance across multiple service instances
- Health checks and automatic failover

**2. Authentication & Authorization**

- API key validation
- JWT token verification
- OAuth 2.0 / OIDC integration
- Role-based access control (RBAC)

**3. Rate Limiting & Throttling**

- Per-client rate limits
- Per-API rate limits
- Quota management
- Burst handling

**4. Request/Response Transformation**

- Header manipulation
- Request/response body transformation
- Protocol conversion (REST ↔ gRPC)
- Request/response validation

**5. Caching**

- Response caching
- Cache invalidation
- Cache policies (TTL, cache keys)

**6. Monitoring & Analytics**

- Request/response logging
- Performance metrics
- Error tracking
- Usage analytics

**7. Security**

- SSL/TLS termination
- IP whitelisting/blacklisting
- DDoS protection
- Request validation

**8. API Versioning**

- Multiple API versions
- Version routing
- Deprecation management

**9. Circuit Breaker**

- Failure detection
- Automatic service isolation
- Fallback responses

**10. Service Discovery**

- Dynamic service registration
- Health check integration
- Service mesh integration

---

## Tyk API Gateway

### Q3: What is Tyk and what are its key features?

**Answer:**

Tyk is an open-source API Gateway written in Go, designed for high performance and scalability.

**Key Features:**

1. **High Performance**: Built in Go, handles high throughput
2. **Open Source**: Free and open-source with enterprise features
3. **Plugin System**: Lua, Python, JavaScript plugins
4. **Multi-Protocol**: REST, GraphQL, gRPC support
5. **Dashboard**: Web-based management UI
6. **Analytics**: Built-in analytics and monitoring
7. **Developer Portal**: Self-service API portal
8. **Multi-Cloud**: Supports cloud and on-premise deployments

**Tyk Configuration Example:**

```json
{
  "name": "User Service API",
  "api_id": "user-service",
  "org_id": "default",
  "use_keyless": false,
  "auth": {
    "auth_header_name": "Authorization",
    "use_param": false
  },
  "version_data": {
    "not_versioned": true,
    "versions": {
      "Default": {
        "name": "Default",
        "use_extended_paths": true,
        "extended_paths": {
          "ignored": [],
          "white_list": [],
          "black_list": []
        }
      }
    }
  },
  "proxy": {
    "listen_path": "/users/",
    "target_url": "http://user-service:8080",
    "strip_listen_path": true
  },
  "rate_limit": {
    "rate": 100,
    "per": 60
  },
  "cache_options": {
    "cache_timeout": 60,
    "enable_cache": true
  }
}
```

**Tyk Middleware Example (Lua):**

```lua
function PreProcess(request, session, spec)
    -- Add custom header
    request:set_header("X-Custom-Header", "value")
    
    -- Rate limiting check
    if session.quota.remaining == 0 then
        return nil, "Rate limit exceeded", 429
    end
    
    return request, session
end

function PostProcess(request, response, session, spec)
    -- Transform response
    local body = response:get_body()
    local data = json.decode(body)
    data.timestamp = os.time()
    response:set_body(json.encode(data))
    
    return response, session
end
```

**Tyk Dashboard Configuration:**

```yaml
# tyk.conf
{
  "listen_port": 8080,
  "secret": "your-secret-key",
  "template_path": "./templates",
  "tyk_js_path": "./js/tyk.js",
  "middleware_path": "./middleware",
  "use_db_app_configs": true,
  "db_app_conf_options": {
    "connection_string": "mongodb://localhost:27017/tyk_analytics"
  },
  "enable_analytics": true,
  "analytics_config": {
    "type": "mongo",
    "purge_delay": 10
  }
}
```

---

## Kong API Gateway

### Q4: What is Kong and how does it work?

**Answer:**

Kong is an open-source, cloud-native API Gateway built on top of Nginx and OpenResty (Lua).

**Key Features:**

1. **Plugin Architecture**: Extensive plugin ecosystem
2. **High Performance**: Built on Nginx, handles millions of requests
3. **Database Support**: PostgreSQL, Cassandra
4. **Service Mesh**: Kong Mesh for service-to-service communication
5. **Kubernetes Native**: Kong Ingress Controller
6. **Developer Portal**: Self-service API documentation
7. **Multi-Protocol**: REST, gRPC, WebSocket, GraphQL

**Kong Configuration Example:**

```yaml
# kong.yml
_format_version: "3.0"

services:
  - name: user-service
    url: http://user-service:8080
    routes:
      - name: user-route
        paths:
          - /api/users
        methods:
          - GET
          - POST
          - PUT
          - DELETE
    plugins:
      - name: rate-limiting
        config:
          minute: 100
          hour: 1000
      - name: key-auth
        config:
          key_names:
            - apikey
      - name: cors
        config:
          origins:
            - "*"
          methods:
            - GET
            - POST
            - PUT
            - DELETE
          headers:
            - Accept
            - Authorization
            - Content-Type
```

**Kong Plugin Example (Rate Limiting):**

```lua
-- Custom Kong plugin
local RateLimitingHandler = {
  PRIORITY = 1000,
  VERSION = "1.0.0",
}

function RateLimitingHandler:access(conf)
  local identifier = kong.client.get_forwarded_ip()
  local limit = conf.minute
  
  local current = tonumber(
    kong.cache:get(
      "rate_limit:" .. identifier,
      { ttl = 60 },
      function()
        return 0
      end
    )
  )
  
  if current >= limit then
    return kong.response.exit(429, {
      message = "Rate limit exceeded"
    })
  end
  
  kong.cache:set(
    "rate_limit:" .. identifier,
    current + 1,
    60
  )
end

return RateLimitingHandler
```

**Kong Admin API Example:**

```bash
# Create a service
curl -i -X POST http://localhost:8001/services/ \
  --data "name=user-service" \
  --data "url=http://user-service:8080"

# Create a route
curl -i -X POST http://localhost:8001/services/user-service/routes \
  --data "hosts[]=api.example.com" \
  --data "paths[]=/users"

# Add rate limiting plugin
curl -i -X POST http://localhost:8001/services/user-service/plugins \
  --data "name=rate-limiting" \
  --data "config.minute=100"

# Add authentication plugin
curl -i -X POST http://localhost:8001/services/user-service/plugins \
  --data "name=key-auth"
```

---

## AWS API Gateway

### Q5: What is AWS API Gateway and what are its features?

**Answer:**

AWS API Gateway is a fully managed service that makes it easy to create, publish, maintain, monitor, and secure APIs.

**Key Features:**

1. **REST APIs**: Traditional RESTful APIs
2. **HTTP APIs**: Low-latency, cost-effective HTTP APIs
3. **WebSocket APIs**: Real-time bidirectional communication
4. **Serverless Integration**: Lambda, ECS, EC2
5. **API Keys**: Simple API key authentication
6. **Cognito Integration**: User authentication
7. **Request/Response Transformation**: VTL templates
8. **Caching**: Response caching
9. **Throttling**: Rate and burst limits
10. **CloudWatch Integration**: Monitoring and logging

**AWS API Gateway Configuration (Terraform):**

```hcl
resource "aws_api_gateway_rest_api" "user_api" {
  name        = "user-api"
  description = "User Service API"
}

resource "aws_api_gateway_resource" "users" {
  rest_api_id = aws_api_gateway_rest_api.user_api.id
  parent_id   = aws_api_gateway_rest_api.user_api.root_resource_id
  path_part   = "users"
}

resource "aws_api_gateway_method" "get_users" {
  rest_api_id   = aws_api_gateway_rest_api.user_api.id
  resource_id   = aws_api_gateway_resource.users.id
  http_method   = "GET"
  authorization = "AWS_IAM"
}

resource "aws_api_gateway_integration" "lambda_integration" {
  rest_api_id = aws_api_gateway_rest_api.user_api.id
  resource_id = aws_api_gateway_resource.users.id
  http_method = aws_api_gateway_method.get_users.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.user_service.invoke_arn
}

resource "aws_api_gateway_deployment" "deployment" {
  depends_on = [
    aws_api_gateway_method.get_users,
    aws_api_gateway_integration.lambda_integration,
  ]

  rest_api_id = aws_api_gateway_rest_api.user_api.id
  stage_name  = "prod"
}
```

**AWS API Gateway Request Transformation (VTL):**

```json
{
  "method": "$context.httpMethod",
  "path": "$context.path",
  "headers": {
    #foreach($header in $input.params().header.keySet())
    "$header": "$util.escapeJavaScript($input.params().header.get($header))"
    #if($foreach.hasNext),#end
    #end
  },
  "body": $input.json('$'),
  "queryParams": {
    #foreach($param in $input.params().querystring.keySet())
    "$param": "$util.escapeJavaScript($input.params().querystring.get($param))"
    #if($foreach.hasNext),#end
    #end
  }
}
```

---

## Other API Gateways

### Q6: Compare different API Gateway solutions.

**Answer:**

| Feature | Tyk | Kong | AWS API Gateway | Azure API Management | Google Cloud Endpoints |
|---------|-----|------|-----------------|---------------------|----------------------|
| **Type** | Open Source / Enterprise | Open Source / Enterprise | Managed Service | Managed Service | Managed Service |
| **Language** | Go | Lua (OpenResty) | Managed | Managed | Managed |
| **Performance** | Very High | Very High | High | High | High |
| **Cost** | Free (OSS) / Paid (Enterprise) | Free (OSS) / Paid (Enterprise) | Pay per request | Pay per request | Pay per request |
| **Deployment** | Self-hosted / Cloud | Self-hosted / Cloud | AWS only | Azure only | GCP only |
| **Protocols** | REST, GraphQL, gRPC | REST, gRPC, WebSocket | REST, HTTP, WebSocket | REST, SOAP, GraphQL | REST, gRPC |
| **Plugins** | Lua, Python, JS | Extensive plugin ecosystem | Limited (VTL) | Policies | Limited |
| **Kubernetes** | Yes | Yes (Ingress Controller) | No | Yes | Yes |
| **Analytics** | Built-in | Kong Analytics | CloudWatch | Azure Monitor | Stackdriver |
| **Developer Portal** | Yes | Yes | Yes | Yes | Yes |

**When to Use Each:**

**Tyk:**
- Need high performance
- Want open-source solution
- Need GraphQL support
- Self-hosted deployment

**Kong:**
- Need extensive plugin ecosystem
- Want Nginx-based solution
- Need service mesh capabilities
- Kubernetes deployment

**AWS API Gateway:**
- Already using AWS
- Want fully managed service
- Serverless architecture
- Lambda integration needed

**Azure API Management:**
- Already using Azure
- Need SOAP support
- Enterprise features required
- Multi-cloud strategy

**Google Cloud Endpoints:**
- Already using GCP
- Need gRPC support
- Serverless architecture
- Cloud Functions integration

---

## API Gateway Patterns

### Q7: What are common API Gateway patterns and anti-patterns?

**Answer:**

**Common Patterns:**

**1. Backend for Frontend (BFF) Pattern:**

```
Mobile App → Mobile BFF → [Services]
Web App → Web BFF → [Services]
```

- Different BFFs for different clients
- Optimized responses for each client type
- Reduces over-fetching

**2. API Gateway Aggregation:**

```javascript
// Aggregate multiple service calls
app.get('/user-profile/:id', async (req, res) => {
  const [user, orders, preferences] = await Promise.all([
    userService.getUser(req.params.id),
    orderService.getUserOrders(req.params.id),
    preferenceService.getUserPreferences(req.params.id)
  ]);
  
  res.json({
    user,
    orders,
    preferences
  });
});
```

**3. Protocol Translation:**

```
Client (REST) → API Gateway → Service (gRPC)
Client (GraphQL) → API Gateway → Services (REST)
```

**4. Request/Response Transformation:**

```javascript
// Transform request
app.use('/api/v1/users', (req, res, next) => {
  // Add default query parameters
  req.query.page = req.query.page || 1;
  req.query.limit = req.query.limit || 10;
  next();
});

// Transform response
app.use('/api/v1/users', (req, res, next) => {
  const originalJson = res.json;
  res.json = function(data) {
    originalJson.call(this, {
      data: data,
      meta: {
        timestamp: Date.now(),
        version: '1.0'
      }
    });
  };
  next();
});
```

**Anti-Patterns:**

**1. Business Logic in Gateway:**

```javascript
// ❌ BAD - Business logic in gateway
app.post('/api/orders', async (req, res) => {
  const order = req.body;
  // Business logic should be in service
  if (order.total > 1000) {
    order.discount = order.total * 0.1;
  }
  // ...
});

// ✅ GOOD - Gateway only routes
app.post('/api/orders', async (req, res) => {
  const response = await orderService.createOrder(req.body);
  res.json(response);
});
```

**2. Tight Coupling:**

```javascript
// ❌ BAD - Gateway knows service internals
app.get('/api/users/:id', async (req, res) => {
  const user = await db.users.findById(req.params.id);
  const posts = await db.posts.findByUserId(req.params.id);
  // ...
});

// ✅ GOOD - Gateway calls service
app.get('/api/users/:id', async (req, res) => {
  const response = await userService.getUser(req.params.id);
  res.json(response);
});
```

**3. No Caching:**

```javascript
// ❌ BAD - No caching
app.get('/api/products', async (req, res) => {
  const products = await productService.getAll();
  res.json(products);
});

// ✅ GOOD - With caching
app.get('/api/products', cache('5 minutes'), async (req, res) => {
  const products = await productService.getAll();
  res.json(products);
});
```

**4. No Rate Limiting:**

```javascript
// ❌ BAD - No rate limiting
app.post('/api/orders', async (req, res) => {
  // Vulnerable to abuse
});

// ✅ GOOD - With rate limiting
app.post('/api/orders', 
  rateLimit({ windowMs: 60000, max: 10 }),
  async (req, res) => {
    // Protected
  }
);
```

---

## Security in API Gateway

### Q8: How do you implement security in an API Gateway?

**Answer:**

**1. Authentication:**

**API Keys:**
```javascript
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || !isValidApiKey(apiKey)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
});
```

**JWT Tokens:**
```javascript
const jwt = require('jsonwebtoken');

app.use((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});
```

**OAuth 2.0:**
```javascript
const oauth2 = require('simple-oauth2');

app.get('/auth', (req, res) => {
  const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: 'http://localhost:3000/callback',
    scope: 'read write',
    state: 'random-state-string'
  });
  res.redirect(authorizationUri);
});
```

**2. Authorization:**

```javascript
app.use((req, res, next) => {
  if (req.user.role !== 'admin' && req.path.startsWith('/admin')) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});
```

**3. Rate Limiting:**

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  keyGenerator: (req) => req.user?.id || req.ip
});

app.use('/api/', limiter);
```

**4. Input Validation:**

```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/users',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process request
  }
);
```

**5. CORS:**

```javascript
const cors = require('cors');

app.use(cors({
  origin: ['https://example.com', 'https://app.example.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**6. SSL/TLS:**

```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(443);
```

---

## Performance Optimization

### Q9: How do you optimize API Gateway performance?

**Answer:**

**1. Caching:**

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

app.get('/api/products', (req, res) => {
  const cacheKey = `products:${req.query.category || 'all'}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return res.json(cached);
  }
  
  productService.getProducts(req.query).then(products => {
    cache.set(cacheKey, products);
    res.json(products);
  });
});
```

**2. Connection Pooling:**

```javascript
const pool = new Pool({
  host: 'localhost',
  database: 'mydb',
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

**3. Request Batching:**

```javascript
app.post('/api/batch', async (req, res) => {
  const requests = req.body.requests;
  const results = await Promise.all(
    requests.map(req => serviceCall(req))
  );
  res.json({ results });
});
```

**4. Response Compression:**

```javascript
const compression = require('compression');
app.use(compression());
```

**5. Load Balancing:**

```javascript
const services = [
  'http://service1:8080',
  'http://service2:8080',
  'http://service3:8080'
];

let current = 0;

app.use('/api', (req, res, next) => {
  req.serviceUrl = services[current];
  current = (current + 1) % services.length;
  next();
});
```

**6. Circuit Breaker:**

```javascript
const CircuitBreaker = require('opossum');

const options = {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000
};

const breaker = new CircuitBreaker(serviceCall, options);

app.get('/api/data', async (req, res) => {
  try {
    const data = await breaker.fire();
    res.json(data);
  } catch (error) {
    res.status(503).json({ error: 'Service unavailable' });
  }
});
```

---

## Monitoring and Observability

### Q10: How do you monitor an API Gateway?

**Answer:**

**1. Request Logging:**

```javascript
const morgan = require('morgan');

app.use(morgan('combined', {
  stream: {
    write: (message) => {
      logger.info(message.trim());
    }
  }
}));
```

**2. Metrics Collection:**

```javascript
const prometheus = require('prom-client');

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.labels(req.method, req.route?.path, res.statusCode).observe(duration);
  });
  next();
});
```

**3. Error Tracking:**

```javascript
app.use((err, req, res, next) => {
  logger.error('API Gateway Error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(err.status || 500).json({
    error: 'Internal server error',
    requestId: req.id
  });
});
```

**4. Health Checks:**

```javascript
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {}
  };
  
  // Check downstream services
  for (const service of services) {
    try {
      await checkServiceHealth(service);
      health.services[service] = 'healthy';
    } catch (error) {
      health.services[service] = 'unhealthy';
      health.status = 'degraded';
    }
  }
  
  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

---

_Add more questions as you encounter them in interviews or study materials._

