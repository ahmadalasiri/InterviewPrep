# Express.js - Complete Learning Guide

This repository contains a comprehensive guide to learning Express.js v5 with practical examples and interview preparation materials.

## Table of Contents

### 📚 [Interview Preparation](00-interview-preparation/)

Complete interview guide with questions organized by topic:

- [Basic Questions](00-interview-preparation/01-basic-questions.md) - Express fundamentals, routing, request/response
- [Middleware Questions](00-interview-preparation/02-middleware-questions.md) - Built-in, custom, and third-party middleware
- [Routing & Controllers](00-interview-preparation/03-routing-questions.md) - Advanced routing patterns
- [Advanced Questions](00-interview-preparation/04-advanced-questions.md) - Security, performance, best practices
- [Practical Questions](00-interview-preparation/05-practical-questions.md) - Real-world coding challenges
- [Architecture & Design](00-interview-preparation/06-architecture-questions.md) - REST API design, scalability

### 1. Basic Concepts

- [Basic Server](01-basics/basic-server.js) - Simple Express server setup
- [Routing](01-basics/routing.js) - Different routing patterns
- [Middleware](01-basics/middleware.js) - Creating and using middleware
- [Request/Response](01-basics/req-res.js) - Working with req and res objects

### 2. Routing

- [Advanced Routing](02-routing/advanced-routing.js) - Complex routing patterns
- [Router Modules](02-routing/router-modules.js) - Modular route organization
- [Route Parameters](02-routing/route-params.js) - Working with parameters
- [Query Strings](02-routing/query-strings.js) - Handling query parameters

### 3. Middleware

- [Custom Middleware](03-middleware/custom-middleware.js) - Creating custom middleware
- [Error Handling](03-middleware/error-handling.js) - Error middleware patterns
- [Authentication](03-middleware/authentication.js) - Auth middleware
- [Validation](03-middleware/validation.js) - Request validation

### 4. Advanced Features

- [File Uploads](04-advanced/file-uploads.js) - Handling file uploads with Multer
- [Session Management](04-advanced/sessions.js) - Express-session usage
- [Authentication](04-advanced/auth.js) - JWT authentication
- [Security](04-advanced/security.js) - Security best practices

### 5. Database Integration

- [MongoDB](05-database/mongodb.js) - MongoDB with Mongoose
- [PostgreSQL](05-database/postgresql.js) - PostgreSQL with pg
- [Prisma](05-database/prisma.js) - Prisma ORM
- [TypeORM](05-database/typeorm.js) - TypeORM integration

### 6. API Development

- [REST API](06-api/rest-api.js) - RESTful API design
- [Pagination](06-api/pagination.js) - Implementing pagination
- [Filtering & Sorting](06-api/filtering.js) - Query filtering
- [Versioning](06-api/versioning.js) - API versioning strategies

### 7. Testing

- [Unit Tests](07-testing/unit-tests.js) - Testing with Jest
- [Integration Tests](07-testing/integration-tests.js) - Supertest integration
- [Mocking](07-testing/mocking.js) - Mocking dependencies
- [E2E Tests](07-testing/e2e-tests.js) - End-to-end testing

### 8. Production

- [Environment Config](08-production/config.js) - Environment variables
- [Logging](08-production/logging.js) - Winston/Morgan logging
- [Error Handling](08-production/error-handling.js) - Production error handling
- [Performance](08-production/performance.js) - Performance optimization

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Basic JavaScript knowledge

### Installation

```bash
# Install Express
npm install express

# Install common middleware
npm install morgan helmet cors compression

# Install dev dependencies
npm install --save-dev nodemon
```

### Quick Start

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Express!');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

## Express v5 New Features

### 1. Automatic Promise Rejection Handling

```javascript
// Express 4 - Manual error handling required
app.get('/users', (req, res, next) => {
  User.find()
    .then(users => res.json(users))
    .catch(next); // Must catch and pass to next
});

// Express 5 - Automatic!
app.get('/users', async (req, res) => {
  const users = await User.find(); // Errors auto-caught
  res.json(users);
});
```

### 2. Improved Path Matching

```javascript
// More flexible routing with path-to-regexp v6
app.get('/users/:id(\\d+)', (req, res) => {
  // Only matches numeric IDs
});

app.get('/files/:path(.*)', (req, res) => {
  // Matches any path
});
```

### 3. Removed Deprecated APIs

```javascript
// ❌ Express 4
req.param('id'); // Deprecated

// ✅ Express 5
req.params.id;   // Use this
req.query.id;    // Or this for query params
req.body.id;     // Or this for body params
```

## Best Practices

### 1. Project Structure

```
project/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── userController.js
│   │   └── postController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── postRoutes.js
│   ├── services/
│   │   └── emailService.js
│   ├── utils/
│   │   └── helpers.js
│   └── app.js
├── tests/
├── .env
├── .gitignore
├── package.json
└── server.js
```

### 2. Error Handling

```javascript
// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});
```

### 3. Security

```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
```

### 4. Async Error Wrapper (Express 4)

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
}));
```

## Essential npm Packages

### Core
- `express` - Express framework
- `dotenv` - Environment variables
- `cors` - Cross-Origin Resource Sharing

### Security
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting
- `express-mongo-sanitize` - Prevent NoSQL injection
- `xss-clean` - XSS protection

### Middleware
- `morgan` - HTTP request logger
- `compression` - Gzip compression
- `cookie-parser` - Cookie parsing
- `express-session` - Session management

### Validation
- `joi` - Schema validation
- `express-validator` - Request validation

### File Upload
- `multer` - Multipart/form-data
- `express-fileupload` - Alternative file upload

### Database
- `mongoose` - MongoDB ODM
- `pg` - PostgreSQL client
- `prisma` - Modern ORM
- `typeorm` - TypeScript ORM

### Authentication
- `passport` - Authentication middleware
- `jsonwebtoken` - JWT generation/verification
- `bcrypt` - Password hashing

### Testing
- `jest` - Testing framework
- `supertest` - HTTP testing
- `mongodb-memory-server` - In-memory MongoDB

## Common Patterns

### Controller Pattern

```javascript
// controllers/userController.js
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// routes/userRoutes.js
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/users', userController.getUsers);
```

### Service Pattern

```javascript
// services/userService.js
class UserService {
  async findAll() {
    return await User.find();
  }
  
  async findById(id) {
    return await User.findById(id);
  }
  
  async create(userData) {
    return await User.create(userData);
  }
}

module.exports = new UserService();
```

### Repository Pattern

```javascript
// repositories/userRepository.js
class UserRepository {
  async findAll() {
    return await User.find();
  }
  
  async findById(id) {
    return await User.findById(id);
  }
  
  async save(user) {
    return await user.save();
  }
}

module.exports = new UserRepository();
```

## CLI Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest --watchAll",
    "test:coverage": "jest --coverage",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

## Resources

- [Express Official Documentation](https://expressjs.com/)
- [Express GitHub Repository](https://github.com/expressjs/express)
- [Express v5 Beta Guide](https://expressjs.com/en/guide/migrating-5.html)
- [MDN Express Tutorial](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs)
- [Awesome Express](https://github.com/rajikaimal/awesome-express)

## Contributing

Contributions are welcome! Feel free to:

- Add new examples
- Improve documentation
- Fix bugs or typos
- Suggest new topics

## License

This project is open source and available under the MIT License.

---

**Happy coding with Express! 🚀**

Built with ❤️ for the Express community.

