# Express.js Basic Interview Questions

## Table of Contents

- [What is Express?](#what-is-express)
- [Core Concepts](#core-concepts)
- [Routing Basics](#routing-basics)
- [Request and Response](#request-and-response)
- [Basic Middleware](#basic-middleware)

---

## What is Express?

### Q1: What is Express.js and why is it used?

**Answer:**

**Express.js** is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

**Key Features:**

1. **Minimal**: Lightweight core with extensive middleware ecosystem
2. **Flexible**: Unopinionated, allows various architectural patterns
3. **Fast**: Built on top of Node.js for high performance
4. **Robust**: Production-ready with extensive testing
5. **Popular**: Large community and ecosystem

**Why Use Express:**

```javascript
// Without Express - Raw Node.js HTTP
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World');
  } else if (req.url === '/api/users' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ users: [] }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// With Express - Much simpler!
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.listen(3000);
```

**Benefits:**

- Simplified routing
- Middleware support
- Template engine integration
- Easier error handling
- Better request/response handling
- Large ecosystem of plugins

---

### Q2: What are the main differences between Express 4 and Express 5?

**Answer:**

**Express 5** is still in beta but brings several important changes:

**Key Differences:**

| Feature | Express 4 | Express 5 |
|---------|-----------|-----------|
| **Promises** | Limited support | Native async/await support |
| **Router** | `app.router` removed | Router improvements |
| **Path Matching** | Basic | Enhanced with path-to-regexp v6 |
| **Methods** | `req.param()` | Removed (use `req.params`) |
| **Rejected Promises** | Unhandled | Automatically caught |
| **Query Parser** | Simple | Improved |

**Express 5 Examples:**

```javascript
// Express 4 - Manual error handling
app.get('/users/:id', (req, res, next) => {
  User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(next); // Must manually pass to next
});

// Express 5 - Automatic error handling
app.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  // Rejected promises automatically caught!
  res.json(user);
});

// Express 4 - req.param() deprecated
const id = req.param('id'); // Works but deprecated

// Express 5 - req.param() removed
const id = req.params.id; // Use this instead
```

**Major Changes:**

1. **Async/await support**: No need for try-catch in routes
2. **Removed deprecated APIs**: Cleaner API surface
3. **Better error handling**: Rejected promises handled automatically
4. **Path matching improvements**: More flexible routing
5. **Updated dependencies**: Modern versions of all deps

---

## Core Concepts

### Q3: What is middleware in Express?

**Answer:**

**Middleware** are functions that have access to the request (`req`), response (`res`), and the next middleware function (`next`) in the application's request-response cycle.

**How Middleware Works:**

```javascript
// Middleware function signature
function middlewareFunction(req, res, next) {
  // Do something
  next(); // Pass control to next middleware
}

// Example: Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Don't forget to call next!
});

// Route middleware
app.get('/users', middleware1, middleware2, (req, res) => {
  res.json({ users: [] });
});
```

**Types of Middleware:**

**1. Application-level middleware:**

```javascript
const app = express();

app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

app.use('/admin', (req, res, next) => {
  // Only runs for /admin routes
  console.log('Admin access');
  next();
});
```

**2. Router-level middleware:**

```javascript
const router = express.Router();

router.use((req, res, next) => {
  console.log('Router middleware');
  next();
});

router.get('/users', (req, res) => {
  res.send('Users list');
});
```

**3. Error-handling middleware:**

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

**4. Built-in middleware:**

```javascript
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded
app.use(express.static('public')); // Serve static files
```

**5. Third-party middleware:**

```javascript
const morgan = require('morgan');
const cors = require('cors');

app.use(morgan('dev')); // HTTP request logger
app.use(cors()); // Enable CORS
```

**Middleware Execution Flow:**

```javascript
app.use((req, res, next) => {
  console.log('1: First middleware');
  next();
});

app.use((req, res, next) => {
  console.log('2: Second middleware');
  next();
});

app.get('/', (req, res) => {
  console.log('3: Route handler');
  res.send('Done');
});

// Output when accessing /:
// 1: First middleware
// 2: Second middleware
// 3: Route handler
```

---

### Q4: How do you create a basic Express application?

**Answer:**

**Basic Express Application Setup:**

```javascript
// 1. Import Express
const express = require('express');

// 2. Create Express application
const app = express();

// 3. Define port
const PORT = process.env.PORT || 3000;

// 4. Add middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// 5. Define routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/users', (req, res) => {
  res.json({ users: ['Alice', 'Bob', 'Charlie'] });
});

app.post('/api/users', (req, res) => {
  const { name } = req.body;
  res.status(201).json({ message: 'User created', name });
});

// 6. Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 7. 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// 8. Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// 9. Export app (for testing)
module.exports = app;
```

**Complete Example with Structure:**

```javascript
// app.js
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message
    }
  });
});

module.exports = app;

// server.js
const app = require('./app');
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## Routing Basics

### Q5: How does routing work in Express?

**Answer:**

**Routing** refers to how an application's endpoints (URIs) respond to client requests.

**Basic Routing Structure:**

```javascript
app.METHOD(PATH, HANDLER);
```

- `app`: Express instance
- `METHOD`: HTTP method (get, post, put, delete, etc.)
- `PATH`: Route path
- `HANDLER`: Function executed when route is matched

**HTTP Methods:**

```javascript
// GET - Retrieve data
app.get('/users', (req, res) => {
  res.json({ users: [] });
});

// POST - Create data
app.post('/users', (req, res) => {
  res.status(201).json({ user: req.body });
});

// PUT - Update entire resource
app.put('/users/:id', (req, res) => {
  res.json({ updated: true });
});

// PATCH - Partial update
app.patch('/users/:id', (req, res) => {
  res.json({ updated: true });
});

// DELETE - Remove data
app.delete('/users/:id', (req, res) => {
  res.json({ deleted: true });
});

// ALL - Matches all HTTP methods
app.all('/secret', (req, res) => {
  res.send('Accessing secret section');
});
```

**Route Paths:**

```javascript
// String path
app.get('/about', (req, res) => {
  res.send('About page');
});

// String pattern with regex-like syntax
app.get('/ab?cd', (req, res) => {
  // Matches: /acd, /abcd
  res.send('ab?cd');
});

app.get('/ab+cd', (req, res) => {
  // Matches: /abcd, /abbcd, /abbbcd, etc.
  res.send('ab+cd');
});

app.get('/ab*cd', (req, res) => {
  // Matches: /abcd, /abXcd, /abRANDOMcd, etc.
  res.send('ab*cd');
});

app.get('/ab(cd)?e', (req, res) => {
  // Matches: /abe, /abcde
  res.send('ab(cd)?e');
});

// Regular expression
app.get(/.*fly$/, (req, res) => {
  // Matches: /butterfly, /dragonfly, etc.
  res.send('/.*fly$/');
});
```

**Route Parameters:**

```javascript
// Single parameter
app.get('/users/:id', (req, res) => {
  res.send(`User ID: ${req.params.id}`);
});

// Multiple parameters
app.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.send(`User ${userId}, Post ${postId}`);
});

// Optional parameters (Express 5)
app.get('/users/:id?', (req, res) => {
  if (req.params.id) {
    res.send(`User ${req.params.id}`);
  } else {
    res.send('All users');
  }
});

// Parameter with regex
app.get('/users/:id(\\d+)', (req, res) => {
  // Only matches if id is a number
  res.send(`User ${req.params.id}`);
});
```

**Route Handlers:**

```javascript
// Single callback
app.get('/example1', (req, res) => {
  res.send('Single callback');
});

// Multiple callbacks
app.get('/example2', (req, res, next) => {
  console.log('First callback');
  next();
}, (req, res) => {
  res.send('Second callback');
});

// Array of callbacks
const cb1 = (req, res, next) => {
  console.log('CB1');
  next();
};

const cb2 = (req, res, next) => {
  console.log('CB2');
  next();
};

app.get('/example3', [cb1, cb2], (req, res) => {
  res.send('Array of callbacks');
});

// Combination
app.get('/example4', [cb1, cb2], (req, res, next) => {
  console.log('CB3');
  next();
}, (req, res) => {
  res.send('Combination');
});
```

---

### Q6: What is the difference between `app.use()` and `app.get()`?

**Answer:**

**`app.use()`** and **`app.get()`** serve different purposes in Express:

**app.use() - Middleware mounting:**

```javascript
// Runs for ALL HTTP methods and ALL paths starting with /api
app.use('/api', (req, res, next) => {
  console.log('API middleware');
  next();
});

// Runs for ALL HTTP methods and ALL paths
app.use((req, res, next) => {
  console.log('Global middleware');
  next();
});

// Mount middleware for specific path
app.use('/admin', adminMiddleware);

// Mount router
app.use('/users', userRouter);
```

**app.get() - Route handler for GET requests only:**

```javascript
// Only runs for GET requests to exact path /api
app.get('/api', (req, res) => {
  res.send('API GET route');
});

// Only runs for GET requests to /users
app.get('/users', (req, res) => {
  res.json({ users: [] });
});
```

**Key Differences:**

| Feature | `app.use()` | `app.get()` |
|---------|-------------|-------------|
| **Purpose** | Middleware | Route handler |
| **HTTP Methods** | All methods | GET only |
| **Path Matching** | Prefix matching | Exact matching (unless regex) |
| **next()** | Usually calls next() | Usually ends response |
| **Use Case** | Cross-cutting concerns | Specific endpoints |

**Examples:**

```javascript
// app.use() - Prefix matching
app.use('/api', (req, res, next) => {
  console.log('Middleware');
  next();
});

// Matches:
// /api
// /api/users
// /api/users/123
// /api/anything

// app.get() - Exact matching
app.get('/api', (req, res) => {
  res.send('Route');
});

// Matches ONLY:
// /api (GET request only)

// Common Pattern: Use both together
app.use('/api', authMiddleware); // Authentication for all /api routes

app.get('/api/users', (req, res) => {
  // GET /api/users
  res.json({ users: [] });
});

app.post('/api/users', (req, res) => {
  // POST /api/users
  res.status(201).json({ user: req.body });
});
```

**Execution Order:**

```javascript
app.use((req, res, next) => {
  console.log('1: Global middleware');
  next();
});

app.use('/api', (req, res, next) => {
  console.log('2: API middleware');
  next();
});

app.get('/api/users', (req, res) => {
  console.log('3: Route handler');
  res.send('Users');
});

// GET /api/users output:
// 1: Global middleware
// 2: API middleware
// 3: Route handler
```

---

## Request and Response

### Q7: What are the most important properties and methods of the request object?

**Answer:**

The **request object** (`req`) represents the HTTP request and contains data about the request.

**Important Properties:**

```javascript
app.get('/example', (req, res) => {
  // Request properties
  console.log(req.method);       // GET, POST, PUT, DELETE, etc.
  console.log(req.url);          // /example?name=John
  console.log(req.path);         // /example
  console.log(req.originalUrl);  // /example?name=John
  console.log(req.baseUrl);      // Base URL if mounted on router
  
  console.log(req.params);       // Route parameters { id: '123' }
  console.log(req.query);        // Query parameters { name: 'John' }
  console.log(req.body);         // Request body (needs middleware)
  
  console.log(req.headers);      // All headers
  console.log(req.get('Content-Type')); // Specific header
  
  console.log(req.ip);           // Client IP address
  console.log(req.hostname);     // Host name
  console.log(req.protocol);     // http or https
  console.log(req.secure);       // true if https
  
  console.log(req.cookies);      // Cookies (needs cookie-parser)
  console.log(req.signedCookies); // Signed cookies
});
```

**Detailed Examples:**

```javascript
// 1. Route Parameters
app.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.json({ userId, postId });
});
// GET /users/123/posts/456
// req.params = { userId: '123', postId: '456' }

// 2. Query Parameters
app.get('/search', (req, res) => {
  const { q, limit, page } = req.query;
  res.json({ query: q, limit, page });
});
// GET /search?q=express&limit=10&page=1
// req.query = { q: 'express', limit: '10', page: '1' }

// 3. Request Body
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  res.json({ name, email });
});
// POST /users with body: { "name": "John", "email": "john@example.com" }
// req.body = { name: 'John', email: 'john@example.com' }

// 4. Headers
app.get('/info', (req, res) => {
  const contentType = req.get('Content-Type');
  const authorization = req.get('Authorization');
  res.json({ contentType, authorization });
});

// 5. Request Information
app.get('/request-info', (req, res) => {
  res.json({
    method: req.method,             // GET
    url: req.url,                   // /request-info?test=1
    path: req.path,                 // /request-info
    hostname: req.hostname,         // localhost
    ip: req.ip,                     // ::1 or 127.0.0.1
    protocol: req.protocol,         // http
    secure: req.secure,             // false (true if https)
    xhr: req.xhr,                   // true if AJAX request
    fresh: req.fresh,               // true if cached
    stale: req.stale                // opposite of fresh
  });
});
```

**Useful Methods:**

```javascript
// Check if content type is accepted
app.get('/data', (req, res) => {
  if (req.accepts('json')) {
    res.json({ data: 'JSON response' });
  } else if (req.accepts('html')) {
    res.send('<h1>HTML response</h1>');
  } else {
    res.status(406).send('Not Acceptable');
  }
});

// Check request method
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log('POST request received');
  }
  next();
});

// Get range header for streaming
app.get('/video', (req, res) => {
  const range = req.range(1000); // Parse Range header
  if (range) {
    // Handle range request
  }
});
```

---

### Q8: What are the most important methods of the response object?

**Answer:**

The **response object** (`res`) represents the HTTP response that Express sends to the client.

**Important Methods:**

```javascript
app.get('/example', (req, res) => {
  // Sending responses
  res.send('Text or HTML');           // Send any type
  res.json({ key: 'value' });         // Send JSON
  res.sendFile('/path/to/file.html'); // Send file
  res.download('/path/to/file.pdf');  // Trigger download
  res.render('template', { data });   // Render template
  
  // Status codes
  res.status(404).send('Not Found');  // Set status and send
  res.sendStatus(200);                // Send status with message
  
  // Redirects
  res.redirect('/new-url');           // 302 redirect
  res.redirect(301, '/permanent');    // 301 redirect
  
  // Headers
  res.set('Content-Type', 'text/html'); // Set header
  res.type('json');                   // Set Content-Type
  res.append('Link', 'value');        // Append header
  
  // Cookies
  res.cookie('name', 'value');        // Set cookie
  res.clearCookie('name');            // Clear cookie
  
  // Response end
  res.end();                          // End response
});
```

**Detailed Examples:**

**1. Sending Different Response Types:**

```javascript
// Send text
app.get('/text', (req, res) => {
  res.send('Plain text response');
});

// Send HTML
app.get('/html', (req, res) => {
  res.send('<h1>HTML Response</h1><p>This is HTML</p>');
});

// Send JSON
app.get('/json', (req, res) => {
  res.json({
    message: 'JSON response',
    data: { users: ['Alice', 'Bob'] }
  });
});

// Send file
app.get('/file', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Download file
app.get('/download', (req, res) => {
  res.download(__dirname + '/files/document.pdf', 'my-document.pdf');
});

// Render template (requires template engine)
app.get('/page', (req, res) => {
  res.render('index', {
    title: 'Home Page',
    user: { name: 'John' }
  });
});
```

**2. Status Codes:**

```javascript
// Success responses
app.get('/created', (req, res) => {
  res.status(201).json({ message: 'Created' });
});

app.get('/no-content', (req, res) => {
  res.sendStatus(204); // No Content
});

// Client error responses
app.get('/not-found', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.post('/bad-request', (req, res) => {
  res.status(400).json({ error: 'Bad Request' });
});

app.get('/unauthorized', (req, res) => {
  res.status(401).json({ error: 'Unauthorized' });
});

// Server error responses
app.get('/error', (req, res) => {
  res.status(500).json({ error: 'Internal Server Error' });
});
```

**3. Headers:**

```javascript
app.get('/headers', (req, res) => {
  // Set single header
  res.set('Content-Type', 'application/json');
  
  // Set multiple headers
  res.set({
    'Content-Type': 'application/json',
    'X-Custom-Header': 'Custom Value',
    'Cache-Control': 'no-cache'
  });
  
  // Set Content-Type
  res.type('json');        // Same as application/json
  res.type('.html');       // Same as text/html
  res.type('png');         // Same as image/png
  
  res.json({ message: 'With custom headers' });
});
```

**4. Cookies:**

```javascript
app.get('/set-cookie', (req, res) => {
  // Set simple cookie
  res.cookie('username', 'john_doe');
  
  // Set cookie with options
  res.cookie('session', 'abc123', {
    maxAge: 900000,        // 15 minutes
    httpOnly: true,        // Cannot be accessed by JS
    secure: true,          // HTTPS only
    sameSite: 'strict'     // CSRF protection
  });
  
  res.send('Cookies set');
});

app.get('/clear-cookie', (req, res) => {
  res.clearCookie('username');
  res.send('Cookie cleared');
});
```

**5. Redirects:**

```javascript
// Temporary redirect (302)
app.get('/old-path', (req, res) => {
  res.redirect('/new-path');
});

// Permanent redirect (301)
app.get('/legacy', (req, res) => {
  res.redirect(301, '/modern');
});

// Redirect back
app.post('/submit', (req, res) => {
  // Process form
  res.redirect('back'); // Redirect to referring page
});

// Absolute URL redirect
app.get('/external', (req, res) => {
  res.redirect('https://example.com');
});
```

**6. Chaining Methods:**

```javascript
app.get('/chain', (req, res) => {
  res
    .status(200)
    .set('Content-Type', 'application/json')
    .cookie('visited', 'true')
    .json({ message: 'Chained methods' });
});
```

---

## Basic Middleware

### Q9: What are the built-in middleware functions in Express?

**Answer:**

**Express 5** has several built-in middleware functions:

**1. express.json()** - Parse JSON request bodies:

```javascript
app.use(express.json());

app.post('/api/users', (req, res) => {
  console.log(req.body); // { "name": "John", "age": 30 }
  res.json(req.body);
});

// With options
app.use(express.json({
  limit: '10mb',          // Max body size
  strict: true,           // Only accept arrays and objects
  type: 'application/json' // Content-Type to parse
}));
```

**2. express.urlencoded()** - Parse URL-encoded bodies:

```javascript
app.use(express.urlencoded({ extended: true }));

app.post('/form', (req, res) => {
  console.log(req.body); // { name: 'John', email: 'john@example.com' }
  res.send('Form received');
});

// extended: true vs false
// true: Parse with qs library (supports nested objects)
// false: Parse with querystring library (simpler)
```

**3. express.static()** - Serve static files:

```javascript
// Serve files from 'public' directory
app.use(express.static('public'));
// Now accessible: http://localhost:3000/style.css
// Maps to: public/style.css

// Multiple static directories
app.use(express.static('public'));
app.use(express.static('files'));

// Virtual path prefix
app.use('/static', express.static('public'));
// Now accessible: http://localhost:3000/static/style.css
// Maps to: public/style.css

// With options
app.use(express.static('public', {
  dotfiles: 'ignore',    // How to treat dotfiles
  etag: true,            // Enable etag generation
  extensions: ['html'],  // Default extensions
  index: 'index.html',   // Default directory index
  maxAge: '1d',          // Cache control max-age
  redirect: true,        // Redirect to trailing /
  setHeaders: (res, path) => {
    res.set('X-Custom', 'value');
  }
}));
```

**4. express.Router()** - Create modular route handlers:

```javascript
const router = express.Router();

router.get('/users', (req, res) => {
  res.json({ users: [] });
});

router.post('/users', (req, res) => {
  res.status(201).json({ user: req.body });
});

app.use('/api', router);
```

**5. express.raw()** - Parse raw body as Buffer:

```javascript
app.use(express.raw({ type: 'application/octet-stream' }));

app.post('/upload', (req, res) => {
  console.log(req.body); // <Buffer ...>
  res.send('Raw data received');
});
```

**6. express.text()** - Parse text body:

```javascript
app.use(express.text({ type: 'text/plain' }));

app.post('/text', (req, res) => {
  console.log(req.body); // "Plain text content"
  res.send('Text received');
});
```

**Complete Example:**

```javascript
const express = require('express');
const app = express();

// Built-in middleware
app.use(express.json());                        // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse forms
app.use(express.static('public'));               // Serve static files

// Routes
app.post('/api/data', (req, res) => {
  res.json({ received: req.body });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(3000);
```

---

### Q10: How do you handle errors in Express?

**Answer:**

**Error handling** in Express is done through error-handling middleware.

**Basic Error Handling:**

```javascript
// Error-handling middleware (4 parameters)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

**Error Handling Patterns:**

**1. Synchronous Errors:**

```javascript
app.get('/sync-error', (req, res) => {
  throw new Error('Synchronous error');
  // Automatically caught by Express
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

**2. Asynchronous Errors (Express 4):**

```javascript
// Must manually pass to next()
app.get('/async-error', (req, res, next) => {
  asyncOperation()
    .then(data => res.json(data))
    .catch(next); // Pass error to next()
});

// Or with async/await + try-catch
app.get('/async-error', async (req, res, next) => {
  try {
    const data = await asyncOperation();
    res.json(data);
  } catch (error) {
    next(error); // Pass error to next()
  }
});
```

**3. Asynchronous Errors (Express 5):**

```javascript
// Rejected promises automatically caught!
app.get('/async-error', async (req, res) => {
  const data = await asyncOperation(); // Error auto-caught
  res.json(data);
});
```

**4. Custom Error Classes:**

```javascript
// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Usage
app.get('/users/:id', async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.json(user);
});

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});
```

**5. Multiple Error Handlers:**

```javascript
// 404 handler (must be after all routes)
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// General error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});
```

**6. Production Error Handling:**

```javascript
app.use((err, req, res, next) => {
  // Log error
  console.error(err.stack);
  
  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({
      error: 'Internal server error'
    });
  } else {
    res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
});
```

---

This covers the basic Express.js interview questions. Practice these concepts thoroughly!

