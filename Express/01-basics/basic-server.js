// Express v5 Basic Server
// Complete example demonstrating Express v5 features

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// ===========================
// 1. MIDDLEWARE
// ===========================

// Built-in middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static("public")); // Serve static files

// Custom logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ===========================
// 2. BASIC ROUTES
// ===========================

// Simple GET route
app.get("/", (req, res) => {
  res.send("Welcome to Express v5!");
});

// JSON response
app.get("/api/info", (req, res) => {
  res.json({
    name: "Express v5 API",
    version: "5.0.0-beta",
    timestamp: new Date().toISOString(),
  });
});

// ===========================
// 3. ROUTE PARAMETERS
// ===========================

// Single parameter
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  res.json({
    message: `User ID: ${id}`,
    user: {
      id,
      name: `User ${id}`,
      email: `user${id}@example.com`,
    },
  });
});

// Multiple parameters
app.get("/users/:userId/posts/:postId", (req, res) => {
  const { userId, postId } = req.params;
  res.json({
    userId,
    postId,
    post: {
      id: postId,
      title: `Post ${postId} by User ${userId}`,
      author: userId,
    },
  });
});

// Parameter with regex (only numeric IDs)
app.get("/products/:id(\\d+)", (req, res) => {
  res.json({
    message: "Product with numeric ID",
    productId: req.params.id,
  });
});

// ===========================
// 4. QUERY PARAMETERS
// ===========================

app.get("/search", (req, res) => {
  const { q = "", limit = 10, page = 1, sort = "asc" } = req.query;

  res.json({
    query: q,
    pagination: {
      limit: parseInt(limit),
      page: parseInt(page),
    },
    sort,
    results: [
      { id: 1, title: `Result 1 for "${q}"` },
      { id: 2, title: `Result 2 for "${q}"` },
    ],
  });
});

// ===========================
// 5. POST REQUESTS
// ===========================

app.post("/api/users", (req, res) => {
  const { name, email, age } = req.body;

  // Validation
  if (!name || !email) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Name and email are required",
    });
  }

  // Create user (mock)
  const newUser = {
    id: Date.now(),
    name,
    email,
    age: age || null,
    createdAt: new Date().toISOString(),
  };

  res.status(201).json({
    message: "User created successfully",
    user: newUser,
  });
});

// ===========================
// 6. PUT REQUEST
// ===========================

app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  res.json({
    message: "User updated successfully",
    user: {
      id,
      name,
      email,
      updatedAt: new Date().toISOString(),
    },
  });
});

// ===========================
// 7. PATCH REQUEST
// ===========================

app.patch("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  res.json({
    message: "User partially updated",
    user: {
      id,
      ...updates,
      updatedAt: new Date().toISOString(),
    },
  });
});

// ===========================
// 8. DELETE REQUEST
// ===========================

app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  res.json({
    message: `User ${id} deleted successfully`,
    deletedAt: new Date().toISOString(),
  });
});

// ===========================
// 9. EXPRESS V5 - ASYNC/AWAIT
// ===========================

// Simulated async database operation
const fetchFromDatabase = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === "999") {
        reject(new Error("User not found"));
      } else {
        resolve({ id, name: `User ${id}`, email: `user${id}@example.com` });
      }
    }, 100);
  });
};

// Express v5 automatically catches rejected promises!
app.get("/api/v5/users/:id", async (req, res) => {
  const user = await fetchFromDatabase(req.params.id);
  res.json(user);
});

// No need for try-catch in Express v5 for async routes
// Rejected promises are automatically caught and passed to error handlers

// ===========================
// 10. ROUTE CHAINING
// ===========================

app
  .route("/api/articles")
  .get((req, res) => {
    res.json({ message: "Get all articles" });
  })
  .post((req, res) => {
    res.status(201).json({ message: "Article created", article: req.body });
  });

app
  .route("/api/articles/:id")
  .get((req, res) => {
    res.json({ message: `Get article ${req.params.id}` });
  })
  .put((req, res) => {
    res.json({ message: `Update article ${req.params.id}` });
  })
  .delete((req, res) => {
    res.json({ message: `Delete article ${req.params.id}` });
  });

// ===========================
// 11. REQUEST INFORMATION
// ===========================

app.get("/api/request-info", (req, res) => {
  res.json({
    method: req.method,
    url: req.url,
    originalUrl: req.originalUrl,
    path: req.path,
    params: req.params,
    query: req.query,
    headers: req.headers,
    ip: req.ip,
    hostname: req.hostname,
    protocol: req.protocol,
    secure: req.secure,
    xhr: req.xhr,
  });
});

// ===========================
// 12. RESPONSE METHODS
// ===========================

// Set status code
app.get("/api/status-codes/created", (req, res) => {
  res.status(201).json({ message: "Resource created" });
});

app.get("/api/status-codes/no-content", (req, res) => {
  res.sendStatus(204); // Sends 204 with status text
});

// Set custom headers
app.get("/api/custom-headers", (req, res) => {
  res.set("X-Powered-By", "Express v5");
  res.set("X-Custom-Header", "Custom Value");
  res.json({ message: "Response with custom headers" });
});

// Redirect
app.get("/old-route", (req, res) => {
  res.redirect(301, "/new-route"); // Permanent redirect
});

app.get("/new-route", (req, res) => {
  res.send("You have been redirected!");
});

// Set cookies
app.get("/api/set-cookie", (req, res) => {
  res.cookie("username", "john_doe", {
    maxAge: 900000, // 15 minutes
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Cookie set" });
});

// Clear cookie
app.get("/api/clear-cookie", (req, res) => {
  res.clearCookie("username");
  res.json({ message: "Cookie cleared" });
});

// ===========================
// 13. CONTENT NEGOTIATION
// ===========================

app.get("/api/content-negotiation", (req, res) => {
  if (req.accepts("json")) {
    res.json({ format: "JSON", data: { message: "Hello JSON" } });
  } else if (req.accepts("html")) {
    res.send("<h1>Hello HTML</h1>");
  } else if (req.accepts("text")) {
    res.send("Hello Text");
  } else {
    res.status(406).send("Not Acceptable");
  }
});

// ===========================
// 14. ERROR HANDLING
// ===========================

// Trigger an error
app.get("/api/trigger-error", (req, res) => {
  throw new Error("This is a test error");
});

// 404 handler (must be after all routes)
app.use((req, res, next) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.url}`,
    path: req.path,
  });
});

// Error handling middleware (must have 4 parameters)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      ...(process.env.NODE_ENV === "development" && {
        stack: err.stack,
      }),
    },
  });
});

// ===========================
// 15. START SERVER
// ===========================

const server = app.listen(PORT, () => {
  console.log(`\n=================================`);
  console.log(`🚀 Express v5 Server is running!`);
  console.log(`=================================`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`⏰ Started: ${new Date().toLocaleString()}`);
  console.log(`=================================\n`);

  console.log(`Available routes:`);
  console.log(`  GET    /`);
  console.log(`  GET    /api/info`);
  console.log(`  GET    /users/:id`);
  console.log(`  GET    /search?q=term`);
  console.log(`  POST   /api/users`);
  console.log(`  GET    /api/v5/users/:id (async/await demo)`);
  console.log(`  GET    /api/request-info`);
  console.log(`\n📝 Try: curl http://localhost:${PORT}/api/info`);
  console.log(`\nPress Ctrl+C to stop\n`);
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log("\n\n🛑 Received shutdown signal, closing server gracefully...");

  server.close(() => {
    console.log("✅ Server closed successfully");
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error("⚠️  Forcing shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("💥 UNHANDLED REJECTION! Shutting down...");
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
