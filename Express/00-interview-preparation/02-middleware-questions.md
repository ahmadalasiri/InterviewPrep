# Express.js Middleware Interview Questions

## Table of Contents

- [Middleware Concepts](#middleware-concepts)
- [Built-in Middleware](#built-in-middleware)
- [Custom Middleware](#custom-middleware)
- [Third-Party Middleware](#third-party-middleware)
- [Error Handling Middleware](#error-handling-middleware)

---

## Middleware Concepts

### Q1: Explain the middleware execution order in Express

**Answer:**

Middleware executes in the order it's defined, following a **stack-based

** approach.

**Execution Flow:**

```javascript
const express = require('express');
const app = express();

// 1. First middleware
app.use((req, res, next) => {
  console.log('1. First middleware');
  next(); // Pass control to next middleware
});

// 2. Second middleware
app.use((req, res, next) => {
  console.log('2. Second middleware');
  next();
});

// 3. Route-specific middleware
app.get('/users', (req, res, next) => {
  console.log('3. Route middleware');
  next();
}, (req, res) => {
  console.log('4. Route handler');
  res.send('Users');
});

// Output when accessing /users:
// 1. First middleware
// 2. Second middleware
// 3. Route middleware
// 4. Route handler
```

**Path-Specific Middleware:**

```javascript
// Global middleware (all paths)
app.use((req, res, next) => {
  console.log('Global');
  next();
});

// Path-specific middleware
app.use('/api', (req, res, next) => {
  console.log('API middleware');
  next();
});

app.use('/admin', (req, res, next) => {
  console.log('Admin middleware');
  next();
});

app.get('/api/users', (req, res) => {
  console.log('Users route');
  res.send('Users');
});

// GET /api/users outputs:
// Global
// API middleware
// Users route
```

**Middleware Without `next()`:**

```javascript
app.use((req, res, next) => {
  console.log('First');
  next();
});

app.use((req, res) => {
  console.log('Second - no next()');
  res.send('Response sent'); // Ends here
});

app.use((req, res, next) => {
  console.log('Third - never reached');
  next();
});
```

---

### Q2: What is the difference between `app.use()`, `app.all()`, and `app.METHOD()`?

**Answer:**

These three serve different purposes in Express:

**app.use() - Middleware mounting:**

```javascript
// Matches ALL methods, prefix matching
app.use('/api', (req, res, next) => {
  console.log('API middleware');
  next();
});

// Matches:
// GET /api
// GET /api/users
// POST /api/users
// PUT /api/users/123
// Any method, any path starting with /api
```

**app.all() - Route handler for ALL methods:**

```javascript
// Matches ALL methods, exact path (unless regex)
app.all('/api/secret', (req, res, next) => {
  console.log('Secret accessed');
  next();
});

app.get('/api/secret', (req, res) => {
  res.send('GET secret');
});

app.post('/api/secret', (req, res) => {
  res.send('POST secret');
});

// Both routes will execute app.all() first
```

**app.METHOD() - Specific HTTP method:**

```javascript
// Matches ONLY specified method
app.get('/users', (req, res) => {
  res.send('GET users');
});

app.post('/users', (req, res) => {
  res.send('POST users');
});
```

**Comparison Table:**

| Feature | `app.use()` | `app.all()` | `app.METHOD()` |
|---------|-------------|-------------|----------------|
| **Methods** | All | All | Specific (GET, POST, etc.) |
| **Matching** | Prefix | Exact | Exact |
| **Purpose** | Middleware | Pre-route logic | Route handler |
| **Response** | Usually calls next() | Can call next() or respond | Usually responds |

**Practical Example:**

```javascript
// app.use() for authentication (prefix matching)
app.use('/api', authMiddleware); // All /api/* routes

// app.all() for logging specific route
app.all('/api/users', (req, res, next) => {
  console.log(`${req.method} /api/users`);
  next();
});

// app.METHOD() for specific endpoints
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.post('/api/users', (req, res) => {
  res.status(201).json({ user: req.body });
});
```

---

## Custom Middleware

### Q3: How do you create custom middleware in Express?

**Answer:**

Custom middleware is a function with three parameters: `req`, `res`, and `next`.

**Basic Custom Middleware:**

```javascript
// Simple logging middleware
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next(); // Pass control to next middleware
};

app.use(logger);
```

**Middleware with Configuration:**

```javascript
// Middleware factory
const createLogger = (options = {}) => {
  return (req, res, next) => {
    if (options.showTimestamp) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    } else {
      console.log(`${req.method} ${req.url}`);
    }
    next();
  };
};

// Usage
app.use(createLogger({ showTimestamp: true }));
```

**Practical Examples:**

**1. Request Timer:**

```javascript
const requestTimer = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} took ${duration}ms`);
  });
  
  next();
};

app.use(requestTimer);
```

**2. Authentication Middleware:**

```javascript
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user to request
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Use on protected routes
app.get('/api/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});
```

**3. Role-Based Access Control:**

```javascript
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
};

// Usage
app.get('/api/admin', authenticate, requireRole('admin'), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

app.get('/api/moderator', 
  authenticate, 
  requireRole('admin', 'moderator'), 
  (req, res) => {
    res.json({ message: 'Moderator access granted' });
  }
);
```

**4. Rate Limiting:**

```javascript
const rateLimit = () => {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 10;
    
    if (!requests.has(ip)) {
      requests.set(ip, []);
    }
    
    const userRequests = requests.get(ip);
    const recentRequests = userRequests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    
    recentRequests.push(now);
    requests.set(ip, recentRequests);
    next();
  };
};

app.use('/api', rateLimit());
```

**5. Request Validation:**

```javascript
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.details 
      });
    }
    
    req.body = value; // Use validated value
    next();
  };
};

// Usage with Joi
const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  age: Joi.number().min(18)
});

app.post('/api/users', validateBody(userSchema), (req, res) => {
  res.json({ user: req.body });
});
```

**6. CORS Middleware:**

```javascript
const cors = (options = {}) => {
  return (req, res, next) => {
    res.header('Access-Control-Allow-Origin', options.origin || '*');
    res.header('Access-Control-Allow-Methods', options.methods || 'GET,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', options.headers || 'Content-Type,Authorization');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    
    next();
  };
};

app.use(cors({ origin: 'https://example.com' }));
```

---

## Error Handling Middleware

### Q4: How do you create error-handling middleware?

**Answer:**

Error-handling middleware has **four** parameters instead of three:

**Basic Error Handler:**

```javascript
// Error-handling middleware (note 4 parameters)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
});
```

**Advanced Error Handling:**

**1. Custom Error Classes:**

```javascript
// NotFoundError
class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

// ValidationError
class ValidationError extends Error {
  constructor(message = 'Validation failed') {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

// UnauthorizedError
class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
    this.status = 401;
  }
}

// Usage
app.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  res.json(user);
});
```

**2. Centralized Error Handler:**

```javascript
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log error
  console.error({
    error: err.name,
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  
  // Send response
  res.status(status).json({
    error: {
      name: err.name,
      message: message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack
      })
    }
  });
};

app.use(errorHandler);
```

**3. Multiple Error Handlers:**

```javascript
// 404 handler
app.use((req, res, next) => {
  const error = new NotFoundError(`Cannot ${req.method} ${req.url}`);
  next(error);
});

// Validation error handler
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.details
    });
  }
  next(err);
});

// Database error handler
app.use((err, req, res, next) => {
  if (err.name === 'MongoError') {
    return res.status(500).json({
      error: 'Database Error',
      message: 'A database error occurred'
    });
  }
  next(err);
});

// General error handler (must be last)
app.use((err, req, res, next) => {
  res.status(500).json({
    error: 'Internal Server Error'
  });
});
```

**4. Async Error Wrapper:**

```javascript
// Express 4 - Wrap async functions
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage
app.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
}));

// Express 5 - Not needed, automatic!
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});
```

---

## Third-Party Middleware

### Q5: What are the most commonly used third-party middleware packages?

**Answer:**

**1. morgan** - HTTP request logger:

```javascript
const morgan = require('morgan');

// Predefined formats
app.use(morgan('dev'));      // Colored, concise
app.use(morgan('combined')); // Apache standard
app.use(morgan('tiny'));     // Minimal

// Custom format
app.use(morgan(':method :url :status :response-time ms'));

// Log to file
const fs = require('fs');
const accessLogStream = fs.createWriteStream('access.log', { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
```

**2. helmet** - Security headers:

```javascript
const helmet = require('helmet');

// Use all default protections
app.use(helmet());

// Custom configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  },
  hsts: {
    maxAge: 31536000
  }
}));
```

**3. cors** - Cross-Origin Resource Sharing:

```javascript
const cors = require('cors');

// Enable all CORS requests
app.use(cors());

// Configure CORS
app.use(cors({
  origin: 'https://example.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Dynamic origin
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['https://example.com', 'https://app.example.com'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
```

**4. compression** - Gzip compression:

```javascript
const compression = require('compression');

// Basic usage
app.use(compression());

// Custom configuration
app.use(compression({
  level: 6,                    // Compression level (0-9)
  threshold: 1024,             // Minimum size to compress
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
```

**5. express-rate-limit** - Rate limiting:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // Max 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', limiter);

// Different limits for different routes
const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5
});

app.post('/api/login', strictLimiter, (req, res) => {
  // Login logic
});
```

**6. cookie-parser** - Parse cookies:

```javascript
const cookieParser = require('cookie-parser');

// Basic usage
app.use(cookieParser());

// With secret for signed cookies
app.use(cookieParser('my-secret'));

// Access cookies
app.get('/', (req, res) => {
  console.log(req.cookies);        // Regular cookies
  console.log(req.signedCookies);  // Signed cookies
});
```

**7. express-session** - Session management:

```javascript
const session = require('express-session');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Use sessions
app.get('/profile', (req, res) => {
  if (req.session.userId) {
    res.json({ userId: req.session.userId });
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});
```

**8. multer** - File uploads:

```javascript
const multer = require('multer');

// Memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const diskUpload = multer({ storage });

// Single file
app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file);
  res.json({ file: req.file });
});

// Multiple files
app.post('/upload-multiple', upload.array('files', 10), (req, res) => {
  console.log(req.files);
  res.json({ files: req.files });
});
```

**Complete Example:**

```javascript
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));

// Logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api', limiter);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(3000);
```

---

This covers Express middleware concepts comprehensively!

