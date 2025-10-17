# TypeScript Basic Interview Questions

## Type System

### Q1: What is the difference between `interface` and `type` in TypeScript?

**Answer:**

Both `interface` and `type` can be used to define types in TypeScript, but they have important differences:

#### **Key Differences:**

| Feature             | Interface                   | Type                    |
| ------------------- | --------------------------- | ----------------------- |
| Extension           | Uses `extends` keyword      | Uses intersection (`&`) |
| Declaration Merging | ✅ Supports                 | ❌ Does not support     |
| Primitives/Unions   | ❌ Cannot use               | ✅ Can use              |
| Mapped Types        | ❌ Limited support          | ✅ Full support         |
| Tuples              | ❌ Limited                  | ✅ Better support       |
| Computed Properties | ❌ Not supported            | ✅ Supported            |
| Performance         | Slightly better for objects | Similar                 |

---

#### **1. Syntax Differences**

```typescript
// Interface
interface User {
  name: string;
  age: number;
}

// Type alias
type User = {
  name: string;
  age: number;
};
```

---

#### **2. Extending/Intersection**

```typescript
// Interface - using extends
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

const myDog: Dog = {
  name: "Buddy",
  breed: "Golden Retriever",
};

// Type - using intersection
type Animal = {
  name: string;
};

type Dog = Animal & {
  breed: string;
};

const myDog: Dog = {
  name: "Buddy",
  breed: "Golden Retriever",
};
```

---

#### **3. Declaration Merging (Only Interface)**

Interfaces with the same name in the same scope are automatically merged:

```typescript
// Interface - declaration merging works
interface User {
  name: string;
}

interface User {
  age: number;
}

// Result: User has both name and age
const user: User = {
  name: "John",
  age: 30,
};

// Type - ERROR: Duplicate identifier
type User = {
  name: string;
};

type User = {
  // ❌ Error!
  age: number;
};
```

**Use case:** Declaration merging is useful for extending third-party library types.

---

#### **4. Union Types (Only Type)**

```typescript
// Type - can create unions
type Status = "pending" | "approved" | "rejected";
type ID = string | number;

// Interface - cannot create unions directly
// This won't work:
// interface Status = "pending" | "approved" | "rejected"; // ❌ Error!
```

---

#### **5. Primitive Types (Only Type)**

```typescript
// Type - can alias primitives
type Name = string;
type Age = number;
type IsActive = boolean;

// Interface - cannot alias primitives
// interface Name = string; // ❌ Error!
```

---

#### **6. Tuple Types**

```typescript
// Type - better for tuples
type Coordinate = [number, number];
type RGB = [red: number, green: number, blue: number];

const point: Coordinate = [10, 20];
const color: RGB = [255, 128, 0];

// Interface - can define tuples but less intuitive
interface Coordinate extends Array<number> {
  0: number;
  1: number;
  length: 2;
}
```

---

#### **7. Mapped Types (Better with Type)**

```typescript
// Type - clean mapped types
type ReadOnly<T> = {
  readonly [K in keyof T]: T[K];
};

type Optional<T> = {
  [K in keyof T]?: T[K];
};

interface User {
  name: string;
  age: number;
}

type ReadonlyUser = ReadOnly<User>;
// Result: { readonly name: string; readonly age: number; }

// Interface - limited mapped type support
interface ReadOnly<T> {
  readonly [K in keyof T]: T[K]; // Works but not idiomatic
}
```

---

#### **8. Computed Properties**

```typescript
// Type - supports computed properties
const key = "name";

type User = {
  [key]: string; // ✅ Works with type
};

// Interface - doesn't support computed properties directly
interface User {
  [key]: string; // ❌ Error with interface
}
```

---

#### **9. Class Implementation**

Both can be implemented by classes:

```typescript
// Interface
interface Flyable {
  fly(): void;
}

class Bird implements Flyable {
  fly() {
    console.log("Flying!");
  }
}

// Type
type Flyable = {
  fly(): void;
};

class Bird implements Flyable {
  fly() {
    console.log("Flying!");
  }
}
```

---

#### **10. Complex Type Operations**

```typescript
// Type - better for complex operations
type Exclude<T, U> = T extends U ? never : T;
type Extract<T, U> = T extends U ? T : never;
type NonNullable<T> = T extends null | undefined ? never : T;

type Status = "active" | "inactive" | "pending";
type ActiveStatus = Exclude<Status, "inactive">; // "active" | "pending"

// Conditional types
type IsString<T> = T extends string ? "yes" : "no";
type Result = IsString<string>; // "yes"
```

---

#### **11. Function Types**

Both work well for function types:

```typescript
// Interface
interface SearchFunc {
  (source: string, subString: string): boolean;
}

// Type
type SearchFunc = (source: string, subString: string) => boolean;

// Type is more common for functions
type Callback = () => void;
type Handler = (event: Event) => void;
```

---

### **When to Use Interface:**

1. **Defining object shapes** - especially for class contracts
2. **Public API definitions** - interfaces are more explicit
3. **When you need declaration merging** - extending third-party types
4. **Object-oriented programming** - interfaces are more OOP-friendly
5. **React component props** - by convention (though types work too)

```typescript
// Good use of interface
interface UserProps {
  name: string;
  age: number;
  onUpdate: (user: User) => void;
}

class UserComponent implements UserProps {
  // ...
}
```

---

### **When to Use Type:**

1. **Union types** - `type Status = "active" | "inactive"`
2. **Tuple types** - `type Coordinate = [number, number]`
3. **Primitive aliases** - `type ID = string`
4. **Complex type transformations** - mapped types, conditional types
5. **Function types** - `type Handler = () => void`
6. **Intersection of different types** - combining multiple shapes

```typescript
// Good use of type
type Result<T> = Success<T> | Error;
type Coordinate = [number, number];
type Callback = () => void;
type ReadOnly<T> = { readonly [K in keyof T]: T[K] };
```

---

### **Performance Considerations:**

- **Interfaces** are slightly faster for type checking of object shapes
- **Types** with complex unions can be slower
- In practice, the difference is negligible for most applications

---

### **Best Practices:**

1. **Be consistent** - Pick one style for your project and stick with it
2. **Prefer interfaces for objects** - especially in OOP contexts
3. **Use types for utility types** - mapped types, conditionals, unions
4. **Use interfaces for public APIs** - better for documentation
5. **Consider declaration merging needs** - if needed, use interface

```typescript
// Good practice: Mix both based on use case
interface User {
  id: string;
  name: string;
  email: string;
}

type UserStatus = "active" | "inactive" | "pending";
type UserRole = "admin" | "user" | "guest";

interface UserWithStatus extends User {
  status: UserStatus;
  role: UserRole;
}

type PartialUser = Partial<User>;
type ReadonlyUser = Readonly<User>;
```

---

### **Real-World Example:**

```typescript
// Define base interfaces for domain models
interface Product {
  id: string;
  name: string;
  price: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// Use types for status, actions, and utilities
type PaymentMethod = "credit" | "debit" | "paypal";
type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

// Combine them
interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  total: number;
}

// Use types for transformations
type OrderSummary = Pick<Order, "id" | "status" | "total">;
type CreateOrderInput = Omit<Order, "id" | "status">;

// Use types for function signatures
type OrderProcessor = (order: Order) => Promise<void>;
type OrderValidator = (order: Order) => boolean;
```

---

### **Quick Decision Tree:**

```
Need unions or primitives? → Use TYPE
Need declaration merging? → Use INTERFACE
Defining object shape for class? → Use INTERFACE
Creating utility types? → Use TYPE
Defining React props? → Either (INTERFACE by convention)
Function signatures? → Use TYPE
Tuple types? → Use TYPE
Simple object type? → Either (be consistent)
```

---

### **Summary:**

- **Interface**: Better for object-oriented programming, class contracts, and public APIs
- **Type**: More flexible, required for unions, tuples, and advanced type operations
- Both can often be used interchangeably for simple object types
- Modern practice: Use both strategically based on the use case

---




