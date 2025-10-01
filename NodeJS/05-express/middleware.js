// Express Middleware

const express = require("express");
const app = express();
const PORT = 3010;

console.log("=== Express Middleware ===\n");

// 1. Built-in Middleware
console.log("--- Built-in Middleware ---");

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/static", express.static("public"));

// 2. Custom Logger Middleware
console.log("--- Custom Logger Middleware ---");

const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next(); // Pass control to next middleware
};

app.use(logger);

// 3. Request Timer Middleware
const requestTimer = (req, res, next) => {
  req.startTime = Date.now();

  // Intercept res.end to calculate duration
  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = Date.now() - req.startTime;
    console.log(`  → Response time: ${duration}ms`);
    originalEnd.apply(res, args);
  };

  next();
};

app.use(requestTimer);

// 4. Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({
      error: "No authorization token provided",
    });
  }

  // Simulate token validation
  if (token === "Bearer valid-token") {
    req.user = {
      id: 1,
      name: "John Doe",
      role: "admin",
    };
    next();
  } else {
    res.status(403).json({
      error: "Invalid token",
    });
  }
};

// 5. Role-based Authorization Middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Not authenticated",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Insufficient permissions",
      });
    }

    next();
  };
};

// 6. Request Validation Middleware
const validateUser = (req, res, next) => {
  const { name, email } = req.body;

  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push("Name is required");
  }

  if (!email || !email.includes("@")) {
    errors.push("Valid email is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      errors,
    });
  }

  next();
};

// 7. Rate Limiting Middleware
const rateLimit = (maxRequests, windowMs) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const userRequests = requests.get(ip);

    // Remove old requests outside the window
    const recentRequests = userRequests.filter((time) => time > windowStart);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        error: "Too many requests, please try again later",
      });
    }

    recentRequests.push(now);
    requests.set(ip, recentRequests);

    next();
  };
};

// 8. CORS Middleware
const cors = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
};

app.use(cors);

// 9. Error Logging Middleware
const errorLogger = (err, req, res, next) => {
  console.error("Error occurred:");
  console.error("  Path:", req.path);
  console.error("  Method:", req.method);
  console.error("  Error:", err.message);
  console.error("  Stack:", err.stack);
  next(err); // Pass to error handler
};

// 10. Error Handler Middleware (must have 4 parameters)
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: {
      message: err.message,
      status: statusCode,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

// Routes

// Public route (no middleware)
app.get("/", (req, res) => {
  res.json({ message: "Public route - no auth required" });
});

// Protected route (requires authentication)
app.get("/profile", authenticate, (req, res) => {
  res.json({
    message: "Protected route",
    user: req.user,
  });
});

// Admin-only route
app.get("/admin", authenticate, authorize("admin"), (req, res) => {
  res.json({
    message: "Admin-only route",
    user: req.user,
  });
});

// Route with validation
app.post("/users", validateUser, (req, res) => {
  res.status(201).json({
    message: "User created",
    user: req.body,
  });
});

// Route with rate limiting
app.get("/api/limited", rateLimit(5, 60000), (req, res) => {
  res.json({
    message: "This route is rate limited to 5 requests per minute",
  });
});

// Route with multiple middleware
app.get("/complex", authenticate, authorize("admin", "user"), (req, res) => {
  res.json({
    message: "Complex route with multiple middleware",
    user: req.user,
  });
});

// Route that throws an error
app.get("/error", (req, res, next) => {
  const error = new Error("This is a test error");
  error.statusCode = 400;
  next(error); // Pass to error handler
});

// Async error handling
app.get("/async-error", async (req, res, next) => {
  try {
    // Simulate async operation that fails
    await Promise.reject(new Error("Async operation failed"));
  } catch (error) {
    next(error);
  }
});

// 11. Conditional Middleware
app.get(
  "/conditional",
  (req, res, next) => {
    // Apply middleware based on condition
    if (req.query.auth === "true") {
      return authenticate(req, res, next);
    }
    next();
  },
  (req, res) => {
    res.json({
      message: "Conditional middleware",
      authenticated: !!req.user,
    });
  }
);

// 12. Router-level Middleware
const apiRouter = express.Router();

// Middleware for this router only
apiRouter.use((req, res, next) => {
  console.log("API Router middleware");
  next();
});

apiRouter.get("/data", (req, res) => {
  res.json({ message: "API data" });
});

apiRouter.get("/status", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api", apiRouter);

// Apply error middleware (must be last)
app.use(errorLogger);
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Middleware server running on http://localhost:${PORT}`);
  console.log("\nTest routes:");
  console.log("  GET  http://localhost:3010/ (public)");
  console.log("  GET  http://localhost:3010/profile (needs auth)");
  console.log(
    '    → curl -H "Authorization: Bearer valid-token" http://localhost:3010/profile'
  );
  console.log("  POST http://localhost:3010/users (with validation)");
  console.log(
    '    → curl -X POST http://localhost:3010/users -H "Content-Type: application/json" -d \'{"name":"John","email":"john@example.com"}\''
  );
  console.log("  GET  http://localhost:3010/error (test error handling)");
  console.log("\nPress Ctrl+C to stop\n");
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n✓ Server shutting down");
  process.exit(0);
});

// Summary
console.log("--- Middleware Summary ---");
console.log("✓ Built-in middleware (json, urlencoded, static)");
console.log("✓ Custom logger and timer middleware");
console.log("✓ Authentication and authorization");
console.log("✓ Request validation");
console.log("✓ Rate limiting");
console.log("✓ CORS handling");
console.log("✓ Error handling middleware");
console.log("✓ Router-level middleware\n");

module.exports = app;

