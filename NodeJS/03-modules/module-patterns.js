// Module Design Patterns in Node.js

console.log("=== Module Design Patterns ===\n");

// 1. Singleton Pattern
console.log("--- Singleton Pattern ---");

// Modules are cached by default, making them natural singletons
class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }

    this.connected = false;
    this.connectionCount = 0;
    DatabaseConnection.instance = this;
    console.log("✓ Database connection instance created");
  }

  connect() {
    if (!this.connected) {
      this.connected = true;
      this.connectionCount++;
      console.log(`Connected (attempt #${this.connectionCount})`);
    }
    return this;
  }

  disconnect() {
    this.connected = false;
    console.log("Disconnected");
    return this;
  }

  isConnected() {
    return this.connected;
  }
}

// Export single instance
const dbConnection = new DatabaseConnection();
// module.exports = dbConnection;

// Or export the class (it will still be a singleton due to caching)
// module.exports = DatabaseConnection;

// 2. Factory Pattern
console.log("\n--- Factory Pattern ---");

class User {
  constructor(name, role) {
    this.name = name;
    this.role = role;
  }

  getPermissions() {
    return [];
  }
}

class Admin extends User {
  constructor(name) {
    super(name, "admin");
  }

  getPermissions() {
    return ["read", "write", "delete", "manage"];
  }
}

class RegularUser extends User {
  constructor(name) {
    super(name, "user");
  }

  getPermissions() {
    return ["read"];
  }
}

class Guest extends User {
  constructor(name) {
    super(name, "guest");
  }

  getPermissions() {
    return ["read"];
  }
}

// Factory function
function createUser(name, role) {
  switch (role) {
    case "admin":
      return new Admin(name);
    case "user":
      return new RegularUser(name);
    case "guest":
      return new Guest(name);
    default:
      throw new Error(`Unknown role: ${role}`);
  }
}

const admin = createUser("Alice", "admin");
const user = createUser("Bob", "user");

console.log(`${admin.name} permissions:`, admin.getPermissions());
console.log(`${user.name} permissions:`, user.getPermissions());

// module.exports = { createUser };

// 3. Revealing Module Pattern
console.log("\n--- Revealing Module Pattern ---");

const Calculator = (function () {
  // Private variables and functions
  let result = 0;

  function log(operation, value) {
    console.log(`${operation}: ${value}`);
  }

  // Public API
  return {
    add(num) {
      result += num;
      log("Added", num);
      return this;
    },

    subtract(num) {
      result -= num;
      log("Subtracted", num);
      return this;
    },

    multiply(num) {
      result *= num;
      log("Multiplied by", num);
      return this;
    },

    divide(num) {
      if (num === 0) throw new Error("Cannot divide by zero");
      result /= num;
      log("Divided by", num);
      return this;
    },

    getResult() {
      return result;
    },

    reset() {
      result = 0;
      log("Reset", result);
      return this;
    },
  };
})();

Calculator.add(10).subtract(3).multiply(2);
console.log("Result:", Calculator.getResult());

// module.exports = Calculator;

// 4. Dependency Injection Pattern
console.log("\n--- Dependency Injection ---");

class Logger {
  log(message) {
    console.log(`[LOG] ${message}`);
  }

  error(message) {
    console.error(`[ERROR] ${message}`);
  }
}

class UserService {
  constructor(logger, database) {
    this.logger = logger;
    this.database = database;
  }

  async createUser(userData) {
    try {
      this.logger.log(`Creating user: ${userData.name}`);
      // const user = await this.database.insert('users', userData);
      this.logger.log("User created successfully");
      return userData;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`);
      throw error;
    }
  }

  async getUser(id) {
    this.logger.log(`Fetching user: ${id}`);
    // const user = await this.database.findById('users', id);
    return { id, name: "John Doe" };
  }
}

const logger = new Logger();
const mockDatabase = {
  insert: () => Promise.resolve({ id: 1 }),
  findById: () => Promise.resolve({ id: 1, name: "John" }),
};

const userService = new UserService(logger, mockDatabase);
// module.exports = { UserService };

// 5. Strategy Pattern
console.log("\n--- Strategy Pattern ---");

// Different payment strategies
class CreditCardPayment {
  pay(amount) {
    console.log(`Paid $${amount} using Credit Card`);
    return { success: true, method: "credit_card", amount };
  }
}

class PayPalPayment {
  pay(amount) {
    console.log(`Paid $${amount} using PayPal`);
    return { success: true, method: "paypal", amount };
  }
}

class CryptoPayment {
  pay(amount) {
    console.log(`Paid $${amount} using Cryptocurrency`);
    return { success: true, method: "crypto", amount };
  }
}

class PaymentProcessor {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  processPayment(amount) {
    return this.strategy.pay(amount);
  }
}

const processor = new PaymentProcessor(new CreditCardPayment());
processor.processPayment(100);

processor.setStrategy(new PayPalPayment());
processor.processPayment(50);

// module.exports = { PaymentProcessor, CreditCardPayment, PayPalPayment };

// 6. Observer Pattern (Event Emitter)
console.log("\n--- Observer Pattern ---");

const EventEmitter = require("events");

class NewsPublisher extends EventEmitter {
  publishNews(news) {
    console.log(`\nPublishing: ${news.title}`);
    this.emit("news", news);
  }

  publishBreakingNews(news) {
    console.log(`\n🚨 BREAKING: ${news.title}`);
    this.emit("breaking-news", news);
  }
}

const publisher = new NewsPublisher();

// Subscribers
publisher.on("news", (news) => {
  console.log(`Email subscriber received: ${news.title}`);
});

publisher.on("news", (news) => {
  console.log(`SMS subscriber received: ${news.title}`);
});

publisher.on("breaking-news", (news) => {
  console.log(`🔔 Push notification: ${news.title}`);
});

publisher.publishNews({ title: "Regular News Article" });
publisher.publishBreakingNews({ title: "Important Breaking News" });

// module.exports = NewsPublisher;

// 7. Middleware Pattern
console.log("\n--- Middleware Pattern ---");

class MiddlewareManager {
  constructor() {
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  async execute(context) {
    let index = 0;

    const next = async () => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++];
        await middleware(context, next);
      }
    };

    await next();
    return context;
  }
}

// Example middlewares
const authMiddleware = async (context, next) => {
  console.log("🔒 Authentication check...");
  context.authenticated = true;
  await next();
};

const loggingMiddleware = async (context, next) => {
  console.log(`📝 Logging: ${context.method} ${context.url}`);
  await next();
};

const validationMiddleware = async (context, next) => {
  console.log("✓ Validation passed");
  context.validated = true;
  await next();
};

const manager = new MiddlewareManager();
manager.use(loggingMiddleware).use(authMiddleware).use(validationMiddleware);

// Execute middleware chain
(async () => {
  const context = { method: "GET", url: "/api/users" };
  await manager.execute(context);
  console.log("Final context:", context);
})();

// module.exports = MiddlewareManager;

// 8. Module Configuration Pattern
console.log("\n--- Configuration Pattern ---");

class ConfigurableService {
  constructor(options = {}) {
    this.config = {
      timeout: options.timeout || 5000,
      retries: options.retries || 3,
      baseURL: options.baseURL || "http://localhost",
      debug: options.debug || false,
    };
  }

  configure(options) {
    this.config = { ...this.config, ...options };
    return this;
  }

  getConfig() {
    return { ...this.config };
  }

  request(endpoint) {
    if (this.config.debug) {
      console.log(`Request to: ${this.config.baseURL}${endpoint}`);
      console.log(`Timeout: ${this.config.timeout}ms`);
    }
    return `Request sent to ${this.config.baseURL}${endpoint}`;
  }
}

const service = new ConfigurableService({
  timeout: 3000,
  debug: true,
});

service.request("/api/data");

// module.exports = ConfigurableService;

// 9. Namespace Pattern
console.log("\n--- Namespace Pattern ---");

const MyApp = {
  utils: {
    formatDate(date) {
      return date.toISOString();
    },
    validateEmail(email) {
      return email.includes("@");
    },
  },

  services: {
    user: {
      create() {
        console.log("User created");
      },
      update() {
        console.log("User updated");
      },
    },
    auth: {
      login() {
        console.log("User logged in");
      },
      logout() {
        console.log("User logged out");
      },
    },
  },

  config: {
    apiVersion: "v1",
    environment: "development",
  },
};

console.log("Email valid:", MyApp.utils.validateEmail("test@example.com"));
MyApp.services.user.create();

// module.exports = MyApp;

// 10. Best Practices
console.log("\n--- Module Pattern Best Practices ---");

/*
1. Single Responsibility Principle:
   - Each module should have one clear purpose

2. Dependency Injection:
   - Pass dependencies as constructor arguments
   - Makes testing easier

3. Configuration:
   - Accept configuration objects
   - Provide sensible defaults

4. Encapsulation:
   - Keep internals private
   - Expose minimal public API

5. Error Handling:
   - Handle errors appropriately
   - Don't swallow errors silently

6. Documentation:
   - Document exported functions
   - Include usage examples

7. Testing:
   - Write testable code
   - Avoid global state

8. Naming:
   - Use clear, descriptive names
   - Follow naming conventions

9. Modularity:
   - Keep modules small and focused
   - Compose larger functionality from smaller modules

10. Versioning:
    - Use semantic versioning
    - Document breaking changes
*/

console.log("\n✓ Module patterns completed");

