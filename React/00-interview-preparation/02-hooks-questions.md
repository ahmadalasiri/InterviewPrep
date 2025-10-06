# React Hooks Interview Questions

## Table of Contents

- [Introduction to Hooks](#introduction-to-hooks)
- [useState Hook](#usestate-hook)
- [useEffect Hook](#useeffect-hook)
- [useContext Hook](#usecontext-hook)
- [useReducer Hook](#usereducer-hook)
- [useMemo and useCallback](#usememo-and-usecallback)
- [useRef Hook](#useref-hook)
- [Custom Hooks](#custom-hooks)
- [Hooks Rules and Best Practices](#hooks-rules-and-best-practices)

---

## Introduction to Hooks

### Q1: What are React Hooks? Why were they introduced?

**Answer:**
Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8.

**Why Hooks Were Introduced:**

1. **Reuse Stateful Logic** - Share logic between components without HOCs or render props
2. **Simplify Complex Components** - Break down complex components into smaller functions
3. **No Classes** - Use state and other React features without writing a class
4. **Better Code Organization** - Group related logic together instead of splitting across lifecycle methods

**Built-in Hooks:**

```jsx
// State Management
useState
useReducer

// Side Effects
useEffect
useLayoutEffect

// Context
useContext

// Performance
useMemo
useCallback

// Refs
useRef
useImperativeHandle

// Other
useDebugValue
useId (React 18+)
useTransition (React 18+)
useDeferredValue (React 18+)
```

**Example - Before and After Hooks:**

```jsx
// Before Hooks (Class Component)
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  componentDidMount() {
    document.title = `Count: ${this.state.count}`;
  }

  componentDidUpdate() {
    document.title = `Count: ${this.state.count}`;
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Increment
        </button>
      </div>
    );
  }
}

// After Hooks (Functional Component)
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

---

## useState Hook

### Q2: How does useState work? Explain with examples.

**Answer:**
`useState` is a Hook that lets you add state to functional components. It returns an array with the current state value and a function to update it.

**Syntax:**

```jsx
const [state, setState] = useState(initialValue);
```

**Basic Examples:**

```jsx
// Simple state
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Multiple state variables
function Form() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(0);

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={age} onChange={(e) => setAge(Number(e.target.value))} />
    </form>
  );
}

// State with object
function UserForm() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    age: 0,
  });

  const handleChange = (field, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };

  return (
    <form>
      <input
        value={user.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />
    </form>
  );
}

// State with array
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text }]);
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div>
      {todos.map((todo) => (
        <div key={todo.id}>
          <span>{todo.text}</span>
          <button onClick={() => toggleTodo(todo.id)}>Toggle</button>
          <button onClick={() => removeTodo(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

// Lazy initial state (computed only once)
function ExpensiveComponent({ data }) {
  // ❌ Bad - computed on every render
  const [state, setState] = useState(computeExpensiveValue(data));

  // ✅ Good - computed only once
  const [state, setState] = useState(() => computeExpensiveValue(data));

  return <div>{state}</div>;
}

// Functional updates (when new state depends on previous)
function Counter() {
  const [count, setCount] = useState(0);

  // ❌ Potential issue - may use stale value
  const increment = () => {
    setCount(count + 1);
  };

  // ✅ Better - always uses current value
  const increment = () => {
    setCount((prevCount) => prevCount + 1);
  };

  // Example where functional update is necessary
  const incrementMultiple = () => {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1); // Increments by 3
  };

  return <button onClick={increment}>Count: {count}</button>;
}
```

**Key Points:**

1. **State updates are asynchronous**
2. **React may batch multiple setState calls**
3. **Functional updates use the latest state**
4. **Lazy initialization for expensive computations**
5. **State is preserved between re-renders**

---

## useEffect Hook

### Q3: What is useEffect? How does it work?

**Answer:**
`useEffect` lets you perform side effects in function components. It's similar to `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` combined.

**Syntax:**

```jsx
useEffect(() => {
  // Side effect code
  return () => {
    // Cleanup code (optional)
  };
}, [dependencies]);
```

**Examples:**

```jsx
// Run on every render
useEffect(() => {
  console.log("Rendered!");
});

// Run only once (on mount)
useEffect(() => {
  console.log("Component mounted");
}, []);

// Run when dependencies change
useEffect(() => {
  console.log("Count changed:", count);
}, [count]);

// With cleanup
useEffect(() => {
  const timer = setInterval(() => {
    console.log("Tick");
  }, 1000);

  return () => {
    clearInterval(timer); // Cleanup on unmount
  };
}, []);

// Data fetching
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();

        if (!cancelled) {
          setUser(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      cancelled = true; // Cleanup: cancel fetch on unmount
    };
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>User: {user.name}</div>;
}

// Event listeners
function WindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      {size.width} x {size.height}
    </div>
  );
}

// Document title
function PageTitle({ title }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <h1>{title}</h1>;
}

// Local storage sync
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

**useEffect Lifecycle Equivalents:**

```jsx
// componentDidMount
useEffect(() => {
  console.log("Mounted");
}, []);

// componentDidUpdate (specific props)
useEffect(() => {
  console.log("Props changed");
}, [prop1, prop2]);

// componentWillUnmount
useEffect(() => {
  return () => {
    console.log("Unmounting");
  };
}, []);

// componentDidMount + componentWillUnmount
useEffect(() => {
  console.log("Mounted");
  return () => {
    console.log("Unmounting");
  };
}, []);
```

**Common Pitfalls:**

```jsx
// ❌ Missing dependencies
useEffect(() => {
  console.log(count); // 'count' should be in dependencies
}, []);

// ❌ Infinite loop
useEffect(() => {
  setCount(count + 1); // Updates state on every render
});

// ❌ Not cleaning up subscriptions
useEffect(() => {
  const subscription = api.subscribe();
  // Missing cleanup! Memory leak!
}, []);

// ✅ Correct
useEffect(() => {
  const subscription = api.subscribe();
  return () => subscription.unsubscribe();
}, []);
```

---

### Q4: What's the difference between useEffect and useLayoutEffect?

**Answer:**

**useEffect:**

- Runs **after** browser paint
- Asynchronous
- Doesn't block browser painting
- Use for most side effects

**useLayoutEffect:**

- Runs **before** browser paint
- Synchronous
- Blocks browser painting until complete
- Use when you need to read/mutate DOM before paint

**When to use useLayoutEffect:**

```jsx
// Measuring DOM elements
function Tooltip() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef();

  useLayoutEffect(() => {
    const rect = ref.current.getBoundingClientRect();
    setPosition({ x: rect.left, y: rect.top });
  }, []);

  return (
    <div ref={ref} style={{ left: position.x, top: position.y }}>
      Tooltip
    </div>
  );
}

// Preventing visual flicker
function AnimatedBox() {
  const ref = useRef();

  // ❌ useEffect - might see flash
  useEffect(() => {
    ref.current.style.opacity = "1";
  }, []);

  // ✅ useLayoutEffect - no flash
  useLayoutEffect(() => {
    ref.current.style.opacity = "1";
  }, []);

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      Box
    </div>
  );
}
```

**Rule of Thumb:** Start with useEffect, only use useLayoutEffect if you see visual issues.

---

## useContext Hook

### Q5: How does useContext work? Provide examples.

**Answer:**
`useContext` lets you subscribe to React context without nesting. It accepts a context object and returns the current context value.

**Syntax:**

```jsx
const value = useContext(MyContext);
```

**Examples:**

```jsx
// Creating and using context
import { createContext, useContext, useState } from "react";

// Create context
const ThemeContext = createContext();

// Provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Consumer component
function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: theme === "light" ? "#fff" : "#333",
        color: theme === "light" ? "#333" : "#fff",
      }}
    >
      Toggle Theme
    </button>
  );
}

// App structure
function App() {
  return (
    <ThemeProvider>
      <ThemedButton />
    </ThemeProvider>
  );
}

// Auth context example
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    checkAuth().then((user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const login = async (credentials) => {
    const user = await api.login(credentials);
    setUser(user);
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

// Using auth in components
function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// Multiple contexts
const UserContext = createContext();
const SettingsContext = createContext();

function Dashboard() {
  const user = useContext(UserContext);
  const settings = useContext(SettingsContext);

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Theme: {settings.theme}</p>
    </div>
  );
}
```

**Benefits over Consumer:**

```jsx
// ❌ Old way with Consumer (nested)
function Button() {
  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <UserContext.Consumer>
          {(user) => (
            <button style={{ color: theme.color }}>{user.name}</button>
          )}
        </UserContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
}

// ✅ New way with useContext (clean)
function Button() {
  const theme = useContext(ThemeContext);
  const user = useContext(UserContext);

  return <button style={{ color: theme.color }}>{user.name}</button>;
}
```

---

## useReducer Hook

### Q6: What is useReducer? When should you use it over useState?

**Answer:**
`useReducer` is a Hook for managing complex state logic. It's an alternative to useState that's more suitable for complex state updates or when next state depends on previous state.

**Syntax:**

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

**Basic Example:**

```jsx
// Reducer function
function counterReducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

// Component using useReducer
function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </div>
  );
}

// Complex example: Todo list
const initialState = {
  todos: [],
  filter: "all",
};

function todoReducer(state, action) {
  switch (action.type) {
    case "add_todo":
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload,
            completed: false,
          },
        ],
      };

    case "toggle_todo":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };

    case "delete_todo":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };

    case "set_filter":
      return {
        ...state,
        filter: action.payload,
      };

    case "clear_completed":
      return {
        ...state,
        todos: state.todos.filter((todo) => !todo.completed),
      };

    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      dispatch({ type: "add_todo", payload: input });
      setInput("");
    }
  };

  const filteredTodos = state.todos.filter((todo) => {
    if (state.filter === "active") return !todo.completed;
    if (state.filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      <div>
        <button
          onClick={() => dispatch({ type: "set_filter", payload: "all" })}
        >
          All
        </button>
        <button
          onClick={() => dispatch({ type: "set_filter", payload: "active" })}
        >
          Active
        </button>
        <button
          onClick={() => dispatch({ type: "set_filter", payload: "completed" })}
        >
          Completed
        </button>
      </div>

      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() =>
                dispatch({ type: "toggle_todo", payload: todo.id })
              }
            />
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.text}
            </span>
            <button
              onClick={() =>
                dispatch({ type: "delete_todo", payload: todo.id })
              }
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <button onClick={() => dispatch({ type: "clear_completed" })}>
        Clear Completed
      </button>
    </div>
  );
}
```

**When to use useReducer over useState:**

1. **Complex state logic** - Multiple sub-values or complex updates
2. **Next state depends on previous** - Especially with multiple updates
3. **State transitions** - When state follows specific patterns
4. **Testing** - Reducer functions are easier to test
5. **Performance** - Pass dispatch down instead of callbacks

**useState vs useReducer:**

```jsx
// Simple state - useState is better
const [count, setCount] = useState(0);

// Complex state - useReducer is better
const [state, dispatch] = useReducer(reducer, {
  count: 0,
  step: 1,
  history: [],
});
```

---

## useMemo and useCallback

### Q7: What are useMemo and useCallback? When should you use them?

**Answer:**

**useMemo** - Memoizes computed values
**useCallback** - Memoizes functions

Both are used for performance optimization to avoid expensive recalculations or unnecessary re-renders.

**useMemo Examples:**

```jsx
// Expensive calculation
function ProductList({ products, filter }) {
  // ❌ Recalculates on every render
  const filteredProducts = products.filter((p) => p.category === filter);

  // ✅ Only recalculates when dependencies change
  const filteredProducts = useMemo(() => {
    console.log("Filtering products...");
    return products.filter((p) => p.category === filter);
  }, [products, filter]);

  return (
    <ul>
      {filteredProducts.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}

// Complex computation
function Chart({ data }) {
  const chartData = useMemo(() => {
    // Expensive data transformation
    return data.map((item) => ({
      ...item,
      computed: complexCalculation(item),
    }));
  }, [data]);

  return <ChartComponent data={chartData} />;
}
```

**useCallback Examples:**

```jsx
// Preventing child re-renders
function Parent() {
  const [count, setCount] = useState(0);
  const [other, setOther] = useState(0);

  // ❌ New function on every render
  const handleClick = () => {
    setCount(count + 1);
  };

  // ✅ Same function reference unless count changes
  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  // Even better with functional update
  const handleClick = useCallback(() => {
    setCount((c) => c + 1);
  }, []); // No dependencies needed

  return (
    <div>
      <Child onClick={handleClick} />
      <button onClick={() => setOther(other + 1)}>Other: {other}</button>
    </div>
  );
}

// Child wrapped in React.memo won't re-render if props don't change
const Child = React.memo(({ onClick }) => {
  console.log("Child rendered");
  return <button onClick={onClick}>Click</button>;
});

// With dependencies
function SearchComponent() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const handleSearch = useCallback(
    (searchTerm) => {
      console.log("Searching:", searchTerm, "in", category);
      // Perform search
    },
    [category]
  ); // Recreate when category changes

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <SearchResults query={query} onSearch={handleSearch} />
    </div>
  );
}
```

**When to use them:**

```jsx
// ✅ Good use cases for useMemo
- Expensive calculations
- Complex data transformations
- Filtering/sorting large lists
- Creating objects/arrays passed to dependencies

// ✅ Good use cases for useCallback
- Functions passed to optimized child components
- Functions in useEffect dependencies
- Functions passed to custom hooks
- Event handlers passed to many children

// ❌ Don't overuse (premature optimization)
- Simple calculations
- Primitive values
- Components that always re-render anyway
```

**Complete Example:**

```jsx
function DataTable({ data, sortBy }) {
  // Memoize expensive sort operation
  const sortedData = useMemo(() => {
    console.log("Sorting data...");
    return [...data].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price") return a.price - b.price;
      return 0;
    });
  }, [data, sortBy]);

  // Memoize callback to prevent child re-renders
  const handleDelete = useCallback((id) => {
    console.log("Deleting:", id);
    // Delete logic
  }, []);

  return (
    <table>
      <tbody>
        {sortedData.map((item) => (
          <TableRow key={item.id} item={item} onDelete={handleDelete} />
        ))}
      </tbody>
    </table>
  );
}

const TableRow = React.memo(({ item, onDelete }) => {
  console.log("Rendering row:", item.id);
  return (
    <tr>
      <td>{item.name}</td>
      <td>{item.price}</td>
      <td>
        <button onClick={() => onDelete(item.id)}>Delete</button>
      </td>
    </tr>
  );
});
```

---

## useRef Hook

### Q8: What is useRef? What are its use cases?

**Answer:**
`useRef` returns a mutable ref object whose `.current` property persists across renders. It doesn't cause re-renders when updated.

**Use Cases:**

1. **Accessing DOM elements**
2. **Storing mutable values** that don't trigger re-renders
3. **Keeping previous values**
4. **Storing timers/intervals**

**Examples:**

```jsx
// 1. Accessing DOM elements
function TextInput() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}

// 2. Storing mutable values (doesn't trigger re-render)
function Counter() {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <div>
      <p>Count: {count}</p>
      <p>Renders: {renderCount.current}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}

// 3. Storing previous value
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

function Component({ value }) {
  const previousValue = usePrevious(value);

  return (
    <div>
      <p>Current: {value}</p>
      <p>Previous: {previousValue}</p>
    </div>
  );
}

// 4. Storing timers
function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
  };

  const stop = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const reset = () => {
    stop();
    setTime(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div>
      <p>Time: {time}s</p>
      {!isRunning ? (
        <button onClick={start}>Start</button>
      ) : (
        <button onClick={stop}>Stop</button>
      )}
      <button onClick={reset}>Reset</button>
    </div>
  );
}

// 5. Avoiding stale closures
function Chat() {
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const socket = connectToSocket();

    socket.on("message", (newMessage) => {
      // messagesRef.current always has latest value
      setMessages([...messagesRef.current, newMessage]);
    });

    return () => socket.disconnect();
  }, []); // No dependencies needed

  return <div>{/* ... */}</div>;
}
```

**useRef vs useState:**

```jsx
// useState - triggers re-render
const [count, setCount] = useState(0);
setCount(1); // Component re-renders

// useRef - doesn't trigger re-render
const countRef = useRef(0);
countRef.current = 1; // No re-render
```

---

## Custom Hooks

### Q9: What are custom hooks? How do you create them?

**Answer:**
Custom hooks are JavaScript functions that start with "use" and can call other hooks. They let you extract component logic into reusable functions.

**Examples:**

```jsx
// 1. useLocalStorage - Persist state in localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setStoredValue = (newValue) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(error);
    }
  };

  return [value, setStoredValue];
}

// Usage
function App() {
  const [name, setName] = useLocalStorage("name", "");
  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}

// 2. useFetch - Data fetching
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url);
        const json = await response.json();

        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}

// Usage
function Users() {
  const { data, loading, error } = useFetch("/api/users");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// 3. useDebounce - Debounce values
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchInput() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      // Perform search
      console.log("Searching for:", debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}

// 4. useToggle - Boolean toggle
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);

  return [value, toggle];
}

// Usage
function Modal() {
  const [isOpen, toggleOpen] = useToggle(false);

  return (
    <div>
      <button onClick={toggleOpen}>Open Modal</button>
      {isOpen && <div onClick={toggleOpen}>Modal Content</div>}
    </div>
  );
}

// 5. useWindowSize - Track window dimensions
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

// Usage
function ResponsiveComponent() {
  const { width } = useWindowSize();

  return <div>{width < 768 ? <MobileView /> : <DesktopView />}</div>;
}
```

**Best Practices for Custom Hooks:**

1. **Name starts with "use"**
2. **Compose other hooks**
3. **Return values (array or object)**
4. **Follow hooks rules**
5. **Keep them focused and reusable**

---

## Hooks Rules and Best Practices

### Q10: What are the rules of hooks?

**Answer:**

**Two Main Rules:**

1. **Only Call Hooks at the Top Level**

   - Don't call hooks inside loops, conditions, or nested functions
   - Ensures hooks are called in the same order every render

2. **Only Call Hooks from React Functions**
   - Call from functional components
   - Call from custom hooks
   - Don't call from regular JavaScript functions

**Examples:**

```jsx
// ❌ Wrong - Conditional hook
function Component({ condition }) {
  if (condition) {
    useState(0); // ERROR!
  }
}

// ✅ Correct - Conditional value
function Component({ condition }) {
  const [value, setValue] = useState(0);

  if (condition) {
    setValue(1);
  }
}

// ❌ Wrong - Hook in loop
function Component({ items }) {
  items.forEach((item) => {
    useState(item); // ERROR!
  });
}

// ✅ Correct - State for array
function Component({ items }) {
  const [selectedItems, setSelectedItems] = useState([]);
}

// ❌ Wrong - Hook after early return
function Component({ user }) {
  if (!user) return null;

  const [name, setName] = useState(""); // ERROR!
}

// ✅ Correct - Hook before early return
function Component({ user }) {
  const [name, setName] = useState("");

  if (!user) return null;

  return <div>{name}</div>;
}
```

**Best Practices:**

1. **Use ESLint plugin** - `eslint-plugin-react-hooks`
2. **Extract logic to custom hooks**
3. **Use exhaustive dependencies** in useEffect
4. **Clean up side effects**
5. **Use functional updates** when state depends on previous
6. **Memoize only when needed** - Don't premature optimize

---

This covers React Hooks interview questions comprehensively!


