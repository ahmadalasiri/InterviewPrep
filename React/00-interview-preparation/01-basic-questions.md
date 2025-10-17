# Basic React Interview Questions

## Table of Contents

- [What is React?](#what-is-react)
- [Components and JSX](#components-and-jsx)
- [Props and State](#props-and-state)
- [Events and Rendering](#events-and-rendering)
- [Lists and Keys](#lists-and-keys)

---

## What is React?

### Q1: What is React and why would you use it?

**Answer:**
React is a JavaScript library for building user interfaces, developed and maintained by Facebook (Meta). It focuses on creating reusable UI components.

**Key Features:**

- **Component-Based**: Build encapsulated components that manage their own state
- **Declarative**: Describe how UI should look, React handles updates
- **Virtual DOM**: Efficient updates through diffing algorithm
- **Unidirectional Data Flow**: Predictable data flow from parent to child
- **Learn Once, Write Anywhere**: React Native for mobile, React for web

**Why Use React:**

1. **Reusable Components** - Build once, use everywhere
2. **Virtual DOM** - Fast and efficient updates
3. **Rich Ecosystem** - Huge community and libraries
4. **Developer Experience** - Great tools (React DevTools, hot reload)
5. **Flexibility** - Can integrate with any backend or use with other libraries
6. **Strong Community** - Extensive resources and support
7. **Industry Adoption** - Used by Facebook, Netflix, Airbnb, etc.

**Example:**

```jsx
// Simple React component
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Usage
<Welcome name="World" />;
```

---

### Q2: What is JSX?

**Answer:**
JSX (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript. It's syntactic sugar for `React.createElement()`.

**Key Points:**

- JSX is not valid JavaScript - it needs to be transpiled (via Babel)
- JSX produces React elements
- You can embed JavaScript expressions using `{}`
- JSX prevents injection attacks by escaping values

**Examples:**

```jsx
// JSX syntax
const element = <h1>Hello, world!</h1>;

// Equivalent JavaScript
const element = React.createElement("h1", null, "Hello, world!");

// JSX with expressions
const name = "John";
const element = <h1>Hello, {name}!</h1>;

// JSX with attributes
const element = <img src={user.avatarUrl} alt={user.name} />;

// JSX with children
const element = (
  <div>
    <h1>Title</h1>
    <p>Description</p>
  </div>
);

// JavaScript expressions in JSX
const element = (
  <div>
    <h1>{2 + 2}</h1>
    <p>{user.isActive ? "Active" : "Inactive"}</p>
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  </div>
);
```

**JSX Rules:**

1. Must return a single root element (or use Fragment)
2. Close all tags (including self-closing tags)
3. Use camelCase for attributes (className, onClick)
4. Use `{}` for JavaScript expressions

```jsx
// ❌ Wrong - Multiple root elements
return (
  <h1>Title</h1>
  <p>Text</p>
);

// ✅ Correct - Single root element
return (
  <div>
    <h1>Title</h1>
    <p>Text</p>
  </div>
);

// ✅ Correct - Using Fragment
return (
  <>
    <h1>Title</h1>
    <p>Text</p>
  </>
);
```

---

## Components and JSX

### Q3: What are React components? What's the difference between functional and class components?

**Answer:**

**Components** are the building blocks of React applications. They are reusable pieces of UI that can have their own logic and styling.

**Functional Components:**

- Simple JavaScript functions
- Receive props as parameter
- Return JSX
- Use hooks for state and lifecycle (since React 16.8)

**Class Components:**

- ES6 classes extending `React.Component`
- Have lifecycle methods
- Use `this.state` and `this.props`
- More verbose syntax

**Examples:**

```jsx
// Functional Component (Modern - Preferred)
function Welcome({ name }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// Class Component (Legacy)
class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    return (
      <div>
        <h1>Hello, {this.props.name}!</h1>
        <p>Count: {this.state.count}</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Increment
        </button>
      </div>
    );
  }
}
```

**Comparison:**

| Feature        | Functional      | Class             |
| -------------- | --------------- | ----------------- |
| Syntax         | Simpler         | More verbose      |
| State          | useState hook   | this.state        |
| Lifecycle      | useEffect hook  | Lifecycle methods |
| `this` keyword | Not needed      | Required          |
| Performance    | Slightly better | Slightly slower   |
| Modern React   | ✅ Recommended  | ⚠️ Legacy         |

**Best Practice:** Use functional components with hooks for all new code.

---

### Q4: What are Props in React?

**Answer:**
Props (short for properties) are arguments passed to React components. They are read-only and passed from parent to child components.

**Key Points:**

- Props are immutable (cannot be modified by the child component)
- Passed as attributes to components
- Can be any JavaScript value (strings, numbers, objects, functions, etc.)
- Used to customize and configure components

**Examples:**

```jsx
// Parent component passing props
function App() {
  const user = {
    name: "John Doe",
    age: 30,
    email: "john@example.com",
  };

  return (
    <div>
      <Greeting name="Alice" />
      <UserCard user={user} onEdit={() => console.log("Edit")} />
      <Button type="primary" disabled={false}>
        Click Me
      </Button>
    </div>
  );
}

// Child component receiving props
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Multiple props
function UserCard({ user, onEdit }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>Age: {user.age}</p>
      <p>Email: {user.email}</p>
      <button onClick={onEdit}>Edit</button>
    </div>
  );
}

// Props with children
function Button({ type, disabled, children }) {
  return (
    <button className={`btn btn-${type}`} disabled={disabled}>
      {children}
    </button>
  );
}

// Default props
function Greeting({ name = "Guest" }) {
  return <h1>Hello, {name}!</h1>;
}

// Destructuring props
function UserInfo({ name, age, email }) {
  return (
    <div>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
    </div>
  );
}

// Rest props (spread)
function Container({ className, ...otherProps }) {
  return <div className={`container ${className}`} {...otherProps} />;
}
```

**Props vs State:**

| Props              | State                    |
| ------------------ | ------------------------ |
| Passed from parent | Managed within component |
| Immutable          | Mutable (via setState)   |
| External data      | Internal data            |
| Read-only          | Read-write               |

---

### Q5: What is State in React?

**Answer:**
State is a JavaScript object that stores component data that can change over time. When state changes, the component re-renders.

**Key Points:**

- State is managed within the component
- State is mutable (can be changed)
- Changing state triggers re-render
- State updates are asynchronous
- Use `useState` hook in functional components

**Examples:**

```jsx
// Basic state with useState
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// State with objects
function UserForm() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    age: 0,
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form>
      <input
        name="name"
        value={user.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        name="email"
        value={user.email}
        onChange={handleChange}
        placeholder="Email"
      />
    </form>
  );
}

// State with arrays
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    setTodos([...todos, { id: Date.now(), text: input }]);
    setInput("");
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => removeTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Functional updates (when new state depends on previous)
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    // ✅ Correct - functional update
    setCount((prevCount) => prevCount + 1);
  };

  const incrementMultiple = () => {
    // This will increment by 3
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={incrementMultiple}>Increment by 3</button>
    </div>
  );
}
```

**State Best Practices:**

1. **Initialize with appropriate type**
2. **Use functional updates when new state depends on old**
3. **Don't mutate state directly** - always create new objects/arrays
4. **Keep state minimal** - derive values when possible
5. **Lift state up** when multiple components need access

---

## Events and Rendering

### Q6: How do you handle events in React?

**Answer:**
React handles events using camelCase syntax and passes functions as event handlers.

**Key Points:**

- Use camelCase (onClick, onChange, onSubmit)
- Pass function reference, not function call
- React uses SyntheticEvent (cross-browser wrapper)
- Need to call preventDefault() explicitly

**Examples:**

```jsx
// Basic event handling
function Button() {
  const handleClick = () => {
    console.log("Button clicked");
  };

  return <button onClick={handleClick}>Click Me</button>;
}

// Event with parameters
function TodoList() {
  const [todos, setTodos] = useState(["Task 1", "Task 2"]);

  const deleteTodo = (index) => {
    console.log("Deleting todo:", index);
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>
          {todo}
          {/* Use arrow function to pass parameters */}
          <button onClick={() => deleteTodo(index)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

// Form events
function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log("Form submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} />
      <input name="email" value={formData.email} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
}

// Common event types
function EventExamples() {
  return (
    <div>
      {/* Click events */}
      <button onClick={(e) => console.log("Click", e)}>Click</button>
      <button onDoubleClick={() => console.log("Double click")}>
        Double Click
      </button>

      {/* Mouse events */}
      <div
        onMouseEnter={() => console.log("Mouse enter")}
        onMouseLeave={() => console.log("Mouse leave")}
      >
        Hover me
      </div>

      {/* Keyboard events */}
      <input
        onKeyDown={(e) => console.log("Key down:", e.key)}
        onKeyUp={(e) => console.log("Key up:", e.key)}
      />

      {/* Focus events */}
      <input
        onFocus={() => console.log("Focus")}
        onBlur={() => console.log("Blur")}
      />

      {/* Change events */}
      <input onChange={(e) => console.log("Value:", e.target.value)} />
      <select onChange={(e) => console.log("Selected:", e.target.value)}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </select>
    </div>
  );
}

// Event object properties
function EventDetails() {
  const handleClick = (e) => {
    console.log("Event type:", e.type);
    console.log("Target element:", e.target);
    console.log("Current target:", e.currentTarget);
    console.log("Mouse position:", e.clientX, e.clientY);
  };

  return <button onClick={handleClick}>Click for details</button>;
}
```

**Event Handling Patterns:**

```jsx
// ❌ Wrong - calling function immediately
<button onClick={handleClick()}>Click</button>

// ✅ Correct - passing function reference
<button onClick={handleClick}>Click</button>

// ✅ Correct - arrow function for parameters
<button onClick={() => handleClick(id)}>Click</button>

// ✅ Correct - arrow function inline
<button onClick={(e) => console.log(e)}>Click</button>
```

---

### Q7: What is conditional rendering in React?

**Answer:**
Conditional rendering in React works the same way as conditions in JavaScript. You can use if statements, ternary operators, or logical && operator to conditionally render components.

**Examples:**

```jsx
// Using if-else
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  } else {
    return <h1>Please sign in.</h1>;
  }
}

// Using ternary operator
function Greeting({ isLoggedIn }) {
  return (
    <div>{isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please sign in.</h1>}</div>
  );
}

// Using logical && operator
function Mailbox({ unreadMessages }) {
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 && (
        <h2>You have {unreadMessages.length} unread messages.</h2>
      )}
    </div>
  );
}

// Preventing component rendering
function WarningBanner({ warn }) {
  if (!warn) {
    return null; // Don't render anything
  }

  return <div className="warning">Warning!</div>;
}

// Multiple conditions
function UserStatus({ user }) {
  if (!user) {
    return <div>Loading...</div>;
  }

  if (user.isBlocked) {
    return <div>Account blocked</div>;
  }

  if (!user.isVerified) {
    return <div>Please verify your email</div>;
  }

  return <div>Welcome, {user.name}!</div>;
}

// Switch-like pattern with object
function StatusMessage({ status }) {
  const messages = {
    loading: <div>Loading...</div>,
    error: <div>Error occurred</div>,
    success: <div>Success!</div>,
    idle: <div>Ready</div>,
  };

  return messages[status] || <div>Unknown status</div>;
}

// Inline conditional with variable
function TodoItem({ todo }) {
  const statusIcon = todo.completed ? "✓" : "○";
  const statusClass = todo.completed ? "completed" : "pending";

  return (
    <div className={statusClass}>
      {statusIcon} {todo.text}
    </div>
  );
}
```

**Common Patterns:**

```jsx
// Show loading, error, or data
function DataDisplay({ data, loading, error }) {
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  return <div>{data.map(item => <div key={item.id}>{item.name}</div>)}</div>;
}

// Conditional className
<div className={`item ${isActive ? 'active' : ''}`}>

// Conditional styles
<div style={{ color: isError ? 'red' : 'black' }}>
```

---

## Lists and Keys

### Q8: How do you render lists in React? Why are keys important?

**Answer:**
Lists are rendered using JavaScript's `map()` function. Keys help React identify which items have changed, been added, or removed.

**Rendering Lists:**

```jsx
// Basic list rendering
function TodoList() {
  const todos = [
    { id: 1, text: "Learn React", completed: false },
    { id: 2, text: "Build app", completed: false },
    { id: 3, text: "Deploy", completed: true },
  ];

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}

// List with component
function UserList({ users }) {
  return (
    <div>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

// Nested lists
function Categories({ categories }) {
  return (
    <div>
      {categories.map((category) => (
        <div key={category.id}>
          <h2>{category.name}</h2>
          <ul>
            {category.items.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

**Why Keys Are Important:**

1. **Performance** - React uses keys to efficiently update the DOM
2. **Identity** - Keys give elements a stable identity across renders
3. **State Preservation** - Keys help preserve component state
4. **Re-ordering** - Keys enable proper re-ordering of elements

**Key Rules:**

```jsx
// ✅ Good - Unique stable IDs
{
  items.map((item) => <li key={item.id}>{item.name}</li>);
}

// ✅ Good - When no stable IDs and list doesn't reorder
{
  items.map((item, index) => <li key={index}>{item.name}</li>);
}

// ❌ Bad - Random values
{
  items.map((item) => <li key={Math.random()}>{item.name}</li>);
}

// ❌ Bad - Non-unique keys
{
  items.map((item) => <li key="same-key">{item.name}</li>);
}

// ❌ Bad - No key
{
  items.map((item) => <li>{item.name}</li>);
}
```

**Keys Best Practices:**

1. **Use stable IDs** when available (database IDs)
2. **Use index as key** only if:
   - Items have no stable IDs
   - List is static (no reordering, filtering, or inserting)
3. **Keys must be unique** among siblings (not globally)
4. **Don't use array index** if list can change order

**Example Problems Without Proper Keys:**

```jsx
// Problem: Using index when list reorders
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "First", completed: false },
    { id: 2, text: "Second", completed: false },
  ]);

  // ❌ Bad - using index
  return (
    <ul>
      {todos.map((todo, index) => (
        <TodoItem key={index} todo={todo} />
      ))}
    </ul>
  );

  // ✅ Good - using stable ID
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
```

---

## Quick Practice Questions

### Q9: What's wrong with this code?

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={setCount(count + 1)}>Count: {count}</button>;
}
```

**Answer:**

The onClick handler is **calling** the function immediately instead of passing a reference.

**Fix:**

```jsx
<button onClick={() => setCount(count + 1)}>Count: {count}</button>
```

---

### Q10: What will happen when you click the button?

```jsx
function Example() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  return <button onClick={handleClick}>Count: {count}</button>;
}
```

**Answer:**

Count will increase by **1**, not 3.

**Explanation:**

- State updates are batched
- All three calls use the same `count` value
- They all set count to the same value (count + 1)

**Fix with functional updates:**

```jsx
const handleClick = () => {
  setCount((c) => c + 1);
  setCount((c) => c + 1);
  setCount((c) => c + 1);
}; // Now it increases by 3
```

---

This covers the basic React interview questions. Master these fundamentals before moving on to hooks and advanced concepts!






