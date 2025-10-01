# Practical Coding Questions

## Real-world Node.js Implementation Challenges

### Q1: Implement a RESTful API for a blog

**Answer:**

```javascript
const express = require("express");
const app = express();

app.use(express.json());

// In-memory database
let posts = [];
let nextId = 1;

// Get all posts
app.get("/api/posts", (req, res) => {
  const { limit = 10, page = 1 } = req.query;
  const start = (page - 1) * limit;
  const end = start + parseInt(limit);

  res.json({
    posts: posts.slice(start, end),
    total: posts.length,
    page: parseInt(page),
    pages: Math.ceil(posts.length / limit),
  });
});

// Get single post
app.get("/api/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  res.json(post);
});

// Create post
app.post("/api/posts", (req, res) => {
  const { title, content, author } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content required" });
  }

  const post = {
    id: nextId++,
    title,
    content,
    author: author || "Anonymous",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  posts.push(post);
  res.status(201).json(post);
});

// Update post
app.put("/api/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  const { title, content } = req.body;

  if (title) post.title = title;
  if (content) post.content = content;
  post.updatedAt = new Date().toISOString();

  res.json(post);
});

// Delete post
app.delete("/api/posts/:id", (req, res) => {
  const index = posts.findIndex((p) => p.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: "Post not found" });
  }

  posts.splice(index, 1);
  res.status(204).send();
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

---

### Q2: Implement file upload with validation

**Answer:**

```javascript
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;

const app = express();

// Configure storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = "./uploads";
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG and GIF allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Single file upload
app.post("/upload/single", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    message: "File uploaded successfully",
    file: {
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
  });
});

// Multiple file upload
app.post("/upload/multiple", upload.array("images", 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  res.json({
    message: `${req.files.length} files uploaded`,
    files: req.files.map((f) => ({
      filename: f.filename,
      size: f.size,
    })),
  });
});

// Error handling
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large (max 5MB)" });
    }
    return res.status(400).json({ error: error.message });
  }
  res.status(500).json({ error: error.message });
});

app.listen(3000);
```

---

### Q3: Implement rate limiting

**Answer:**

```javascript
const express = require("express");
const redis = require("redis");
const app = express();

const client = redis.createClient();

// Token bucket rate limiter
async function rateLimiter(req, res, next) {
  const ip = req.ip;
  const key = `rate_limit:${ip}`;

  const maxRequests = 10;
  const windowSeconds = 60;

  try {
    // Increment request count
    const requests = await client.incr(key);

    if (requests === 1) {
      // Set expiry on first request
      await client.expire(key, windowSeconds);
    }

    if (requests > maxRequests) {
      const ttl = await client.ttl(key);

      res.set("X-RateLimit-Limit", maxRequests);
      res.set("X-RateLimit-Remaining", 0);
      res.set("X-RateLimit-Reset", Date.now() + ttl * 1000);

      return res.status(429).json({
        error: "Too many requests",
        retryAfter: ttl,
      });
    }

    res.set("X-RateLimit-Limit", maxRequests);
    res.set("X-RateLimit-Remaining", maxRequests - requests);

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    next(); // Fail open
  }
}

app.use(rateLimiter);

app.get("/api/data", (req, res) => {
  res.json({ data: "Success" });
});

app.listen(3000);
```

---

### Q4: Implement JWT authentication

**Answer:**

```javascript
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

const JWT_SECRET = "your-secret-key";
const users = []; // In-memory user store

// Register
app.post("/auth/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  // Check if user exists
  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: users.length + 1,
    username,
    password: hashedPassword,
  };

  users.push(user);

  res.status(201).json({
    message: "User registered successfully",
    userId: user.id,
  });
});

// Login
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({
    token,
    expiresIn: "24h",
  });
});

// Auth middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Protected route
app.get("/api/profile", authenticate, (req, res) => {
  res.json({
    user: req.user,
  });
});

app.listen(3000);
```

---

### Q5: Implement WebSocket real-time chat

**Answer:**

```javascript
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Map();

wss.on("connection", (ws) => {
  let username = "";

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case "join":
        username = data.username;
        clients.set(ws, username);

        broadcast(
          {
            type: "user-joined",
            username,
            count: clients.size,
          },
          ws
        );

        ws.send(
          JSON.stringify({
            type: "welcome",
            message: `Welcome ${username}!`,
          })
        );
        break;

      case "message":
        broadcast({
          type: "message",
          username: clients.get(ws),
          message: data.message,
          timestamp: new Date().toISOString(),
        });
        break;
    }
  });

  ws.on("close", () => {
    if (username) {
      clients.delete(ws);

      broadcast({
        type: "user-left",
        username,
        count: clients.size,
      });
    }
  });
});

function broadcast(data, excludeWs = null) {
  const message = JSON.stringify(data);

  wss.clients.forEach((client) => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

server.listen(3000, () => {
  console.log("WebSocket server running on port 3000");
});
```

---

### Q6: Implement cron job scheduler

**Answer:**

```javascript
const cron = require("node-cron");
const nodemailer = require("nodemailer");

class JobScheduler {
  constructor() {
    this.jobs = new Map();
  }

  // Every minute
  scheduleEveryMinute(name, task) {
    const job = cron.schedule("* * * * *", task);
    this.jobs.set(name, job);
    return job;
  }

  // Every hour
  scheduleEveryHour(name, task) {
    const job = cron.schedule("0 * * * *", task);
    this.jobs.set(name, job);
    return job;
  }

  // Daily at specific time
  scheduleDaily(name, hour, minute, task) {
    const job = cron.schedule(`${minute} ${hour} * * *`, task);
    this.jobs.set(name, job);
    return job;
  }

  // Custom cron expression
  schedule(name, cronExpression, task) {
    const job = cron.schedule(cronExpression, task);
    this.jobs.set(name, job);
    return job;
  }

  stop(name) {
    const job = this.jobs.get(name);
    if (job) {
      job.stop();
      this.jobs.delete(name);
    }
  }

  stopAll() {
    this.jobs.forEach((job) => job.stop());
    this.jobs.clear();
  }
}

// Usage
const scheduler = new JobScheduler();

// Cleanup old logs daily at 2 AM
scheduler.scheduleDaily("cleanup-logs", 2, 0, async () => {
  console.log("Cleaning up old logs...");
  // Implementation
});

// Send daily report at 9 AM
scheduler.scheduleDaily("daily-report", 9, 0, async () => {
  console.log("Sending daily report...");
  // Implementation
});

// Health check every 5 minutes
scheduler.schedule("health-check", "*/5 * * * *", async () => {
  console.log("Running health check...");
  // Implementation
});
```

---

These practical examples demonstrate real-world Node.js development patterns!

