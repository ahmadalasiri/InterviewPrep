// Basic Express Server

// NOTE: Install Express first: npm install express

const express = require("express");
const app = express();
const PORT = 3000;

console.log("=== Basic Express Server ===\n");

// Middleware to parse JSON
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// 1. Basic Routes
console.log("--- Basic Routes ---");

// GET route
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Route with response types
app.get("/json", (req, res) => {
  res.json({
    message: "JSON response",
    timestamp: new Date().toISOString(),
  });
});

app.get("/html", (req, res) => {
  res.send("<h1>HTML Response</h1><p>This is HTML from Express</p>");
});

// 2. Route Parameters
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
    },
  });
});

// 3. Query Parameters
app.get("/search", (req, res) => {
  const { q, limit = 10, page = 1 } = req.query;

  res.json({
    query: q,
    limit: parseInt(limit),
    page: parseInt(page),
    results: [`Result 1 for "${q}"`, `Result 2 for "${q}"`],
  });
});

// 4. POST Request
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  // Validation
  if (!name || !email) {
    return res.status(400).json({
      error: "Name and email are required",
    });
  }

  // Create user
  const newUser = {
    id: Date.now(),
    name,
    email,
    createdAt: new Date().toISOString(),
  };

  res.status(201).json({
    message: "User created successfully",
    user: newUser,
  });
});

// 5. PUT Request (Update)
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  res.json({
    message: "User updated",
    user: {
      id,
      name,
      email,
      updatedAt: new Date().toISOString(),
    },
  });
});

// 6. DELETE Request
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  res.json({
    message: `User ${id} deleted successfully`,
  });
});

// 7. Status Codes
app.get("/status/ok", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.get("/status/created", (req, res) => {
  res.status(201).json({ status: "Created" });
});

app.get("/status/badrequest", (req, res) => {
  res.status(400).json({ error: "Bad Request" });
});

app.get("/status/notfound", (req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.get("/status/servererror", (req, res) => {
  res.status(500).json({ error: "Internal Server Error" });
});

// 8. Request Information
app.get("/request-info", (req, res) => {
  res.json({
    method: req.method,
    url: req.url,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl,
    path: req.path,
    params: req.params,
    query: req.query,
    headers: req.headers,
    ip: req.ip,
    protocol: req.protocol,
    hostname: req.hostname,
  });
});

// 9. Response Methods
app.get("/response-methods", (req, res) => {
  // res.send() - Send any type
  // res.json() - Send JSON
  // res.sendFile() - Send file
  // res.redirect() - Redirect
  // res.status() - Set status code
  // res.set() - Set header

  res.set("X-Custom-Header", "CustomValue");
  res.json({ message: "Various response methods available" });
});

// 10. Redirect
app.get("/old-route", (req, res) => {
  res.redirect(301, "/new-route");
});

app.get("/new-route", (req, res) => {
  res.send("You have been redirected!");
});

// 11. Download File
app.get("/download", (req, res) => {
  const file = `${__dirname}/../package.json`;
  res.download(file, "downloaded-package.json", (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(500).send("Could not download file");
    }
  });
});

// 12. Send File
app.get("/file", (req, res) => {
  const file = `${__dirname}/../package.json`;
  res.sendFile(file, (err) => {
    if (err) {
      console.error("Send file error:", err);
      res.status(500).send("Could not send file");
    }
  });
});

// 13. Setting Cookies
app.get("/set-cookie", (req, res) => {
  res.cookie("username", "john_doe", {
    maxAge: 900000,
    httpOnly: true,
  });
  res.send("Cookie has been set");
});

app.get("/clear-cookie", (req, res) => {
  res.clearCookie("username");
  res.send("Cookie has been cleared");
});

// 14. Custom Headers
app.get("/custom-headers", (req, res) => {
  res.set({
    "X-Powered-By": "My Express App",
    "X-Custom-Header": "Custom Value",
    "Content-Type": "application/json",
  });

  res.json({ message: "Response with custom headers" });
});

// 15. Route Chaining
app
  .route("/api/product")
  .get((req, res) => {
    res.json({ message: "Get all products" });
  })
  .post((req, res) => {
    res.json({ message: "Create product" });
  })
  .put((req, res) => {
    res.json({ message: "Update product" });
  })
  .delete((req, res) => {
    res.json({ message: "Delete product" });
  });

// 16. 404 Handler (must be last)
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Express server running on http://localhost:${PORT}`);
  console.log("\nAvailable routes:");
  console.log("  GET  http://localhost:3000/");
  console.log("  GET  http://localhost:3000/json");
  console.log("  GET  http://localhost:3000/users/123");
  console.log("  GET  http://localhost:3000/search?q=nodejs");
  console.log("  POST http://localhost:3000/users");
  console.log("\nTry: curl http://localhost:3000/json");
  console.log("Press Ctrl+C to stop the server\n");
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n✓ Server shutting down gracefully");
  process.exit(0);
});

module.exports = app;

