// HTTP Module in Node.js

const http = require("http");
const url = require("url");

console.log("=== HTTP Module in Node.js ===\n");

// 1. Basic HTTP Server
console.log("--- Creating Basic HTTP Server ---");

const basicServer = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello, World!\n");
});

const PORT1 = 3000;

basicServer.listen(PORT1, () => {
  console.log(`✓ Basic server running at http://localhost:${PORT1}/`);
  console.log("  Try: curl http://localhost:3000\n");
});

// 2. Server with Routing
const PORT2 = 3001;

const routingServer = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Set common headers
  res.setHeader("Content-Type", "application/json");

  // Routing
  if (pathname === "/" && req.method === "GET") {
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        message: "Welcome to the API",
        endpoints: ["/", "/users", "/about"],
      })
    );
  } else if (pathname === "/users" && req.method === "GET") {
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        users: [
          { id: 1, name: "John Doe" },
          { id: 2, name: "Jane Smith" },
        ],
      })
    );
  } else if (pathname === "/about" && req.method === "GET") {
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        app: "Node.js HTTP Server",
        version: "1.0.0",
      })
    );
  } else {
    res.statusCode = 404;
    res.end(
      JSON.stringify({
        error: "Route not found",
      })
    );
  }
});

routingServer.listen(PORT2, () => {
  console.log(`✓ Routing server running at http://localhost:${PORT2}/`);
  console.log("  Try: curl http://localhost:3001/users\n");
});

// 3. Server with Query Parameters
const PORT3 = 3002;

const queryServer = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const query = parsedUrl.query;

  res.setHeader("Content-Type", "application/json");

  if (parsedUrl.pathname === "/search") {
    const { q, limit = 10 } = query;

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        query: q || "",
        limit: parseInt(limit),
        results: [`Result for: ${q || "all"}`],
      })
    );
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

queryServer.listen(PORT3, () => {
  console.log(`✓ Query server running at http://localhost:${PORT3}/`);
  console.log('  Try: curl "http://localhost:3002/search?q=nodejs&limit=5"\n');
});

// 4. Server with POST Data
const PORT4 = 3003;

const postServer = http.createServer((req, res) => {
  if (req.url === "/api/users" && req.method === "POST") {
    let body = "";

    // Collect data chunks
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    // Process complete data
    req.on("end", () => {
      try {
        const userData = JSON.parse(body);

        res.setHeader("Content-Type", "application/json");
        res.statusCode = 201;
        res.end(
          JSON.stringify({
            message: "User created",
            user: {
              id: Date.now(),
              ...userData,
            },
          })
        );
      } catch (error) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            error: "Invalid JSON",
          })
        );
      }
    });
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

postServer.listen(PORT4, () => {
  console.log(`✓ POST server running at http://localhost:${PORT4}/`);
  console.log(
    '  Try: curl -X POST http://localhost:3003/api/users -H "Content-Type: application/json" -d \'{"name":"John"}\'\n'
  );
});

// 5. Server with Different Content Types
const PORT5 = 3004;

const contentServer = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname;

  if (pathname === "/html") {
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Hello HTML</h1><p>This is HTML content</p>");
  } else if (pathname === "/json") {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "JSON response" }));
  } else if (pathname === "/xml") {
    res.setHeader("Content-Type", "application/xml");
    res.end('<?xml version="1.0"?><message>XML response</message>');
  } else if (pathname === "/text") {
    res.setHeader("Content-Type", "text/plain");
    res.end("Plain text response");
  } else {
    res.statusCode = 404;
    res.end("Not found");
  }
});

contentServer.listen(PORT5, () => {
  console.log(`✓ Content server running at http://localhost:${PORT5}/`);
  console.log("  Try: curl http://localhost:3004/html\n");
});

// 6. Server with Custom Headers
const PORT6 = 3005;

const headerServer = http.createServer((req, res) => {
  // Set multiple headers
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Powered-By", "Node.js");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("X-Custom-Header", "Custom Value");

  // Or set multiple headers at once
  res.writeHead(200, {
    "Cache-Control": "no-cache",
    "X-Response-Time": "50ms",
  });

  res.end(
    JSON.stringify({
      message: "Response with custom headers",
      headers: req.headers,
    })
  );
});

headerServer.listen(PORT6, () => {
  console.log(`✓ Header server running at http://localhost:${PORT6}/`);
});

// 7. Making HTTP Requests
setTimeout(() => {
  console.log("\n--- Making HTTP Requests ---");

  // GET request
  const options = {
    hostname: "localhost",
    port: 3001,
    path: "/users",
    method: "GET",
  };

  const req = http.request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log("✓ HTTP Request Response:", data);
    });
  });

  req.on("error", (error) => {
    console.error("✗ Request error:", error.message);
  });

  req.end();
}, 1000);

// 8. Server with Error Handling
const PORT7 = 3006;

const errorServer = http.createServer((req, res) => {
  try {
    if (req.url === "/error") {
      throw new Error("Intentional error");
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Success" }));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      })
    );
  }
});

// Handle server errors
errorServer.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`✗ Port ${PORT7} is already in use`);
  } else {
    console.error("✗ Server error:", error);
  }
});

errorServer.listen(PORT7, () => {
  console.log(
    `✓ Error handling server running at http://localhost:${PORT7}/\n`
  );
});

// 9. Server with Request Logging
const PORT8 = 3007;

const logServer = http.createServer((req, res) => {
  // Log request details
  const timestamp = new Date().toISOString();
  const { method, url: reqUrl, headers } = req;

  console.log(`[${timestamp}] ${method} ${reqUrl}`);
  console.log(`  User-Agent: ${headers["user-agent"] || "Unknown"}`);

  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      message: "Request logged",
      method,
      url: reqUrl,
      timestamp,
    })
  );
});

logServer.listen(PORT8, () => {
  console.log(`✓ Logging server running at http://localhost:${PORT8}/`);
});

// Cleanup on exit
process.on("SIGINT", () => {
  console.log("\n\n--- Shutting down servers ---");
  basicServer.close();
  routingServer.close();
  queryServer.close();
  postServer.close();
  contentServer.close();
  headerServer.close();
  errorServer.close();
  logServer.close();
  console.log("✓ All servers closed");
  process.exit(0);
});

console.log("--- Summary ---");
console.log("Multiple HTTP servers are now running on different ports");
console.log("Press Ctrl+C to stop all servers\n");
console.log("✓ Basic server concepts demonstrated");
console.log("✓ Routing and query parameters");
console.log("✓ POST data handling");
console.log("✓ Content types and headers");
console.log("✓ Error handling and logging");

