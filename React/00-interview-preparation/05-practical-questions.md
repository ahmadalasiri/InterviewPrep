# Practical React Coding Questions

## Table of Contents

- [Component Implementation](#component-implementation)
- [Hooks Implementation](#hooks-implementation)
- [State Management Problems](#state-management-problems)
- [Performance Challenges](#performance-challenges)
- [Real-World Patterns](#real-world-patterns)
- [Debugging and Problem-Solving](#debugging-and-problem-solving)

---

## Component Implementation

### Q1: Implement a controlled form with validation

**Solution:**

```jsx
function SignupForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (data) => {
    const errors = {};

    // Email validation
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
      errors.email = "Invalid email address";
    }

    // Password validation
    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (touched[name]) {
      const newErrors = validate({ ...formData, [name]: value });
      setErrors(newErrors);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const newErrors = validate(formData);
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validate
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Submit
    setIsSubmitting(true);
    try {
      await submitForm(formData);
      alert("Form submitted successfully!");
      // Reset form
      setFormData({ email: "", password: "", confirmPassword: "" });
      setTouched({});
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.email && errors.email && (
          <span className="error">{errors.email}</span>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <span className="error">{errors.confirmPassword}</span>
        )}
      </div>

      {errors.submit && <div className="error">{errors.submit}</div>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Sign Up"}
      </button>
    </form>
  );
}
```

---

### Q2: Implement an autocomplete/typeahead component

**Solution:**

```jsx
function Autocomplete({ suggestions, onSelect, placeholder }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef(null);

  // Filter suggestions based on query
  const filteredSuggestions = useMemo(() => {
    if (!query) return [];
    return suggestions.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, suggestions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setActiveIndex(0);
  };

  const handleSelect = (suggestion) => {
    setQuery(suggestion);
    setIsOpen(false);
    onSelect(suggestion);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;

      case "Enter":
        e.preventDefault();
        if (filteredSuggestions[activeIndex]) {
          handleSelect(filteredSuggestions[activeIndex]);
        }
        break;

      case "Escape":
        setIsOpen(false);
        break;

      default:
        break;
    }
  };

  return (
    <div ref={wrapperRef} className="autocomplete">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
      />

      {isOpen && filteredSuggestions.length > 0 && (
        <ul className="suggestions">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              className={index === activeIndex ? "active" : ""}
              onClick={() => handleSelect(suggestion)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      {isOpen && query && filteredSuggestions.length === 0 && (
        <div className="no-suggestions">No results found</div>
      )}
    </div>
  );
}

// Usage
function App() {
  const suggestions = ["Apple", "Banana", "Orange", "Mango", "Pineapple"];

  const handleSelect = (value) => {
    console.log("Selected:", value);
  };

  return (
    <Autocomplete
      suggestions={suggestions}
      onSelect={handleSelect}
      placeholder="Search fruits..."
    />
  );
}
```

---

### Q3: Implement a modal component with portal

**Solution:**

```jsx
function Modal({ isOpen, onClose, title, children }) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      // Delay unmount for exit animation
      const timer = setTimeout(() => setIsAnimating(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen && !isAnimating) return null;

  return ReactDOM.createPortal(
    <div
      className={`modal-overlay ${isOpen ? "open" : "closing"}`}
      onClick={onClose}
    >
      <div
        className={`modal-content ${isOpen ? "open" : "closing"}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="close-button"
          >
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

// Usage
function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirmation"
      >
        <p>Are you sure you want to continue?</p>
        <button onClick={() => setIsOpen(false)}>Cancel</button>
        <button
          onClick={() => {
            // Handle confirmation
            setIsOpen(false);
          }}
        >
          Confirm
        </button>
      </Modal>
    </div>
  );
}
```

---

## Hooks Implementation

### Q4: Implement usePrevious hook

**Solution:**

```jsx
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// Usage
function Counter() {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {previousCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

---

### Q5: Implement useDebounce hook

**Solution:**

```jsx
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
function SearchComponent() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      // Perform search
      fetch(`/api/search?q=${debouncedQuery}`)
        .then((res) => res.json())
        .then((data) => console.log(data));
    }
  }, [debouncedQuery]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

---

### Q6: Implement useLocalStorage hook

**Solution:**

```jsx
function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  const setValue = (value) => {
    try {
      // Allow value to be a function for same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

// Usage
function App() {
  const [name, setName] = useLocalStorage("name", "");

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p>Stored name: {name}</p>
    </div>
  );
}
```

---

### Q7: Implement useIntersectionObserver hook

**Solution:**

```jsx
function useIntersectionObserver(ref, options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      setEntry(entry);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options.threshold, options.root, options.rootMargin]);

  return { isIntersecting, entry };
}

// Usage - Lazy load images
function LazyImage({ src, alt }) {
  const ref = useRef();
  const { isIntersecting } = useIntersectionObserver(ref, {
    threshold: 0.1,
    rootMargin: "100px",
  });

  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (isIntersecting) {
      setImageSrc(src);
    }
  }, [isIntersecting, src]);

  return (
    <div ref={ref}>
      {imageSrc ? (
        <img src={imageSrc} alt={alt} />
      ) : (
        <div className="placeholder">Loading...</div>
      )}
    </div>
  );
}

// Usage - Infinite scroll
function InfiniteScroll({ loadMore, hasMore }) {
  const ref = useRef();
  const { isIntersecting } = useIntersectionObserver(ref);

  useEffect(() => {
    if (isIntersecting && hasMore) {
      loadMore();
    }
  }, [isIntersecting, hasMore, loadMore]);

  return (
    <div ref={ref} style={{ height: "50px" }}>
      {hasMore && "Loading more..."}
    </div>
  );
}
```

---

## State Management Problems

### Q8: Implement a shopping cart with add/remove/update functionality

**Solution:**

```jsx
function ShoppingCart() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        // Update quantity
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart ({getTotalItems()} items)</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                <img src={item.image} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <p>${item.price}</p>
                </div>
                <div>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div>${(item.price * item.quantity).toFixed(2)}</div>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <h3>Total: ${getTotalPrice().toFixed(2)}</h3>
            <button onClick={clearCart}>Clear Cart</button>
            <button>Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}
```

---

### Q9: Implement a Todo app with filter, sort, and local storage

**Solution:**

```jsx
function TodoApp() {
  const [todos, setTodos] = useLocalStorage("todos", []);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'completed'
  const [sortBy, setSortBy] = useState("date"); // 'date', 'name'

  const addTodo = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTodos([...todos, newTodo]);
    setInput("");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id, newText) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  // Filter todos
  const filteredTodos = useMemo(() => {
    let result = [...todos];

    // Apply filter
    if (filter === "active") {
      result = result.filter((todo) => !todo.completed);
    } else if (filter === "completed") {
      result = result.filter((todo) => todo.completed);
    }

    // Apply sort
    if (sortBy === "name") {
      result.sort((a, b) => a.text.localeCompare(b.text));
    } else {
      result.sort((a, b) => b.createdAt - a.createdAt);
    }

    return result;
  }, [todos, filter, sortBy]);

  const stats = useMemo(
    () => ({
      total: todos.length,
      active: todos.filter((t) => !t.completed).length,
      completed: todos.filter((t) => t.completed).length,
    }),
    [todos]
  );

  return (
    <div className="todo-app">
      <h1>Todo App</h1>

      <form onSubmit={addTodo}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit">Add</button>
      </form>

      <div className="filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All ({stats.total})
        </button>
        <button
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Active ({stats.active})
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed ({stats.completed})
        </button>
      </div>

      <div className="sort">
        <label>
          Sort by:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Date</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
          />
        ))}
      </ul>

      {stats.completed > 0 && (
        <button onClick={clearCompleted}>Clear Completed</button>
      )}
    </div>
  );
}

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    if (editText.trim() && editText !== todo.text) {
      onEdit(todo.id, editText.trim());
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li>
        <input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleEdit();
            if (e.key === "Escape") setIsEditing(false);
          }}
          autoFocus
        />
      </li>
    );
  }

  return (
    <li className={todo.completed ? "completed" : ""}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span onDoubleClick={() => setIsEditing(true)}>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
}
```

---

## Performance Challenges

### Q10: Optimize a slow list rendering

**Problem:** You have a list of 10,000 items that renders slowly.

**Solutions:**

```jsx
// ❌ Problem: Rendering all 10,000 items at once
function SlowList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <ExpensiveComponent item={item} />
        </li>
      ))}
    </ul>
  );
}

// ✅ Solution 1: Virtualization (react-window)
import { FixedSizeList } from "react-window";

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ExpensiveComponent item={items[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}

// ✅ Solution 2: Pagination
function PaginatedList({ items }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 50;

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  }, [items, page]);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  return (
    <div>
      <ul>
        {paginatedItems.map((item) => (
          <li key={item.id}>
            <ExpensiveComponent item={item} />
          </li>
        ))}
      </ul>

      <div>
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ✅ Solution 3: Memoization
const MemoizedItem = React.memo(ExpensiveComponent, (prevProps, nextProps) => {
  return prevProps.item.id === nextProps.item.id;
});

function OptimizedList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <MemoizedItem item={item} />
        </li>
      ))}
    </ul>
  );
}

// ✅ Solution 4: Lazy rendering (render on scroll)
function LazyList({ items }) {
  const [visibleCount, setVisibleCount] = useState(50);
  const observerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => Math.min(prev + 50, items.length));
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [items.length]);

  return (
    <ul>
      {items.slice(0, visibleCount).map((item) => (
        <li key={item.id}>
          <ExpensiveComponent item={item} />
        </li>
      ))}
      {visibleCount < items.length && (
        <div ref={observerRef}>Loading more...</div>
      )}
    </ul>
  );
}
```

---

## Real-World Patterns

### Q11: Implement authentication flow with protected routes

**Solution:**

```jsx
// Auth Context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem("token");
    if (token) {
      verifyToken(token)
        .then((user) => setUser(user))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const { user, token } = await api.login(credentials);
    localStorage.setItem("token", token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Login Component
function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(credentials);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={credentials.email}
        onChange={(e) =>
          setCredentials({ ...credentials, email: e.target.value })
        }
        placeholder="Email"
      />
      <input
        type="password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        placeholder="Password"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

// App with Routes
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

---

## Debugging and Problem-Solving

### Q12: Debug why a component keeps re-rendering

**Problem:** Component re-renders unnecessarily.

**Debugging Steps:**

```jsx
// Step 1: Use React DevTools Profiler
// Record a session and see what's causing re-renders

// Step 2: Add console logs
function Component({ data, onClick }) {
  console.log("Component rendered");
  console.log("data:", data);
  console.log("onClick:", onClick);

  // Use why-did-you-render library
  useWhyDidYouUpdate("Component", { data, onClick });

  return <div>{/* ... */}</div>;
}

// Common causes and fixes:

// ❌ Problem 1: Creating new objects/arrays inline
function Parent() {
  return <Child data={{ value: 1 }} />; // New object every render
}

// ✅ Fix: Memoize or move outside
const data = { value: 1 };
function Parent() {
  return <Child data={data} />;
}

// Or
function Parent() {
  const data = useMemo(() => ({ value: 1 }), []);
  return <Child data={data} />;
}

// ❌ Problem 2: Creating new functions inline
function Parent() {
  return <Child onClick={() => console.log("click")} />;
}

// ✅ Fix: Use useCallback
function Parent() {
  const handleClick = useCallback(() => {
    console.log("click");
  }, []);

  return <Child onClick={handleClick} />;
}

// ❌ Problem 3: Parent re-renders
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
      <ExpensiveChild /> {/* Re-renders when count changes */}
    </div>
  );
}

// ✅ Fix: Memo child component
const ExpensiveChild = React.memo(() => {
  console.log("ExpensiveChild rendered");
  return <div>Child</div>;
});

// ❌ Problem 4: Context value changes
function Provider({ children }) {
  const [user, setUser] = useState(null);

  // New object every render!
  return (
    <Context.Provider value={{ user, setUser }}>{children}</Context.Provider>
  );
}

// ✅ Fix: Memoize context value
function Provider({ children }) {
  const [user, setUser] = useState(null);

  const value = useMemo(() => ({ user, setUser }), [user]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
```

---

This covers practical React coding challenges comprehensively!






