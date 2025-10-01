# Node.js - Complete Learning Guide

This repository contains a comprehensive guide to learning Node.js with practical examples and explanations.

## Table of Contents

### 1. Basic Syntax & Fundamentals

- [Variables and Scoping](01-basic-syntax/variables.js) - var, let, const, and scoping rules
- [Data Types](01-basic-syntax/data-types.js) - Primitive types, objects, arrays, and type checking
- [Functions](01-basic-syntax/functions.js) - Function declarations, expressions, arrow functions
- [Template Literals](01-basic-syntax/template-literals.js) - String interpolation and multi-line strings
- [Destructuring](01-basic-syntax/destructuring.js) - Object and array destructuring

### 2. Asynchronous Programming

- [Callbacks](02-async-programming/callbacks.js) - Callback patterns and callback hell
- [Promises](02-async-programming/promises.js) - Promise creation, chaining, and error handling
- [Async/Await](02-async-programming/async-await.js) - Modern asynchronous programming
- [Event Loop](02-async-programming/event-loop.js) - Understanding the Node.js event loop
- [Timers](02-async-programming/timers.js) - setTimeout, setInterval, setImmediate

### 3. Modules & Package Management

- [CommonJS Modules](03-modules/commonjs.js) - require() and module.exports
- [ES6 Modules](03-modules/es6-modules.mjs) - import/export syntax
- [NPM Basics](03-modules/npm-guide.md) - Package management with npm
- [Package.json](03-modules/package-guide.md) - Understanding package.json configuration

### 4. Core Node.js Modules

- [File System (fs)](04-core-modules/file-system.js) - Reading and writing files
- [HTTP Module](04-core-modules/http-server.js) - Creating HTTP servers
- [Path Module](04-core-modules/path.js) - Working with file paths
- [Events](04-core-modules/events.js) - EventEmitter and custom events
- [Streams](04-core-modules/streams.js) - Readable, writable, and transform streams
- [Buffer](04-core-modules/buffer.js) - Working with binary data

### 5. Express.js Framework

- [Basic Server](05-express/basic-server.js) - Creating an Express application
- [Routing](05-express/routing.js) - Route parameters, query strings, and HTTP methods
- [Middleware](05-express/middleware.js) - Built-in, third-party, and custom middleware
- [Error Handling](05-express/error-handling.js) - Error middleware and best practices
- [RESTful API](05-express/rest-api.js) - Building RESTful endpoints

### 6. Database Integration

- [MongoDB with Mongoose](06-database/mongodb.js) - MongoDB connection and CRUD operations
- [MySQL](06-database/mysql.js) - Working with MySQL databases
- [PostgreSQL](06-database/postgresql.js) - PostgreSQL integration
- [Database Patterns](06-database/patterns.js) - Repository pattern and connection pooling

### 7. Testing

- [Unit Testing with Jest](07-testing/jest-testing.js) - Writing unit tests
- [Integration Testing](07-testing/integration-testing.js) - Testing APIs and services
- [Mocking](07-testing/mocking.js) - Mocking dependencies
- [Test Coverage](07-testing/coverage.md) - Measuring and improving test coverage

### 8. Advanced Concepts

- [Clustering](08-advanced/clustering.js) - Multi-process Node.js applications
- [Child Processes](08-advanced/child-processes.js) - Spawning and forking processes
- [Worker Threads](08-advanced/worker-threads.js) - Running JavaScript in parallel
- [Performance](08-advanced/performance.js) - Profiling and optimization
- [Security](08-advanced/security.js) - Security best practices
- [Debugging](08-advanced/debugging.js) - Debugging techniques and tools

## Getting Started

1. Install Node.js from [nodejs.org](https://nodejs.org/)
2. Verify installation:
   ```bash
   node --version
   npm --version
   ```
3. Navigate to each topic folder and run the examples:
   ```bash
   node filename.js
   ```

## Key Node.js Concepts

### Why Node.js?

- **Asynchronous & Event-Driven**: Non-blocking I/O operations
- **Fast Execution**: Built on Chrome's V8 JavaScript engine
- **Single Language**: Use JavaScript for both frontend and backend
- **NPM Ecosystem**: Largest package ecosystem in the world
- **Scalability**: Efficient handling of concurrent connections
- **Community**: Large, active community and extensive resources

### Node.js Philosophy

- **Asynchronous by default**
- **Small core, extensive modules**
- **Event-driven architecture**
- **Non-blocking I/O**
- **Callback and promise patterns**

## Best Practices

1. **Error Handling**: Always handle errors in callbacks and promises
2. **Async/Await**: Prefer async/await over callbacks and promise chains
3. **Environment Variables**: Use `.env` files for configuration
4. **Security**: Validate inputs, sanitize data, use HTTPS
5. **Logging**: Implement proper logging (Winston, Morgan)
6. **Testing**: Write unit and integration tests
7. **Code Style**: Use ESLint and Prettier for consistent code
8. **Dependencies**: Keep dependencies updated and minimal

## Common Patterns

### Callback Pattern

```javascript
fs.readFile("file.txt", "utf8", (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});
```

### Promise Pattern

```javascript
readFileAsync("file.txt")
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

### Async/Await Pattern

```javascript
async function readFile() {
  try {
    const data = await readFileAsync("file.txt");
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

## Essential npm Packages

### Development Tools

- `nodemon` - Auto-restart on file changes
- `eslint` - Code linting
- `prettier` - Code formatting

### Web Frameworks

- `express` - Fast, minimalist web framework
- `koa` - Next generation web framework
- `fastify` - Fast and low overhead web framework

### Utilities

- `lodash` - Utility library
- `moment` / `date-fns` - Date manipulation
- `dotenv` - Environment variable management
- `axios` - HTTP client

### Database

- `mongoose` - MongoDB ODM
- `sequelize` - SQL ORM
- `pg` - PostgreSQL client
- `mysql2` - MySQL client

### Testing

- `jest` - Testing framework
- `mocha` - Test framework
- `chai` - Assertion library
- `supertest` - HTTP testing

## Resources

- [Official Node.js Documentation](https://nodejs.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [You Don't Know Node](https://github.com/azat-co/you-dont-know-node)
- [Node.js Design Patterns](https://www.nodejsdesignpatterns.com/)
- [Express.js Documentation](https://expressjs.com/)
- [NPM Documentation](https://docs.npmjs.com/)

## Project Structure Example

```
my-node-project/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── app.js
├── tests/
├── config/
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

Happy coding with Node.js! 🚀

