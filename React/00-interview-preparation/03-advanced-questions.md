# Advanced React Interview Questions

## Table of Contents

- [Virtual DOM and Reconciliation](#virtual-dom-and-reconciliation)
- [Performance Optimization](#performance-optimization)
- [Code Splitting and Lazy Loading](#code-splitting-and-lazy-loading)
- [Higher-Order Components](#higher-order-components)
- [Render Props](#render-props)
- [Error Boundaries](#error-boundaries)
- [Portals](#portals)
- [Refs and Forward Refs](#refs-and-forward-refs)
- [Strict Mode](#strict-mode)

---

## Virtual DOM and Reconciliation

### Q1: What is Virtual DOM? How does React's reconciliation work?

**Answer:**

**Virtual DOM** is a lightweight JavaScript representation of the actual DOM. React uses it to optimize updates by minimizing direct DOM manipulations.

**How it works:**

1. **Render**: Create Virtual DOM tree
2. **Diff**: Compare with previous Virtual DOM (reconciliation)
3. **Update**: Apply minimal changes to real DOM (commit phase)

**Reconciliation Algorithm:**

```jsx
// React's reconciliation process

// 1. Different element types - Replace entire tree
<div>       →    <span>
  <Counter />      <Counter />
</div>           </span>
// Result: Unmount div and Counter, mount new span and Counter

// 2. Same element type, different props - Update props
<div className="before" />  →  <div className="after" />
// Result: Only update className attribute

// 3. Component elements - Update props, don't recreate instance
<Counter value={1} />  →  <Counter value={2} />
// Result: Update props, component instance remains

// 4. Keys in lists - Identify which items changed
// ❌ Without keys
<ul>              →    <ul>
  <li>A</li>             <li>B</li>
  <li>B</li>             <li>A</li>
</ul>                  </ul>
// React thinks both li's changed

// ✅ With keys
<ul>              →    <ul>
  <li key="a">A</li>     <li key="b">B</li>
  <li key="b">B</li>     <li key="a">A</li>
</ul>                  </ul>
// React knows items just reordered
```

**Fiber Architecture (React 16+):**

- **Incremental Rendering**: Break work into chunks
- **Pause and Resume**: Can pause work and come back later
- **Priority**: Prioritize different types of updates
- **Concurrent Mode**: Render multiple versions simultaneously

**Example:**

```jsx
function App() {
  const [count, setCount] = useState(0);

  // When count changes:
  // 1. React creates new Virtual DOM
  // 2. Compares with previous Virtual DOM
  // 3. Calculates minimal changes
  // 4. Applies only necessary updates to real DOM

  return (
    <div>
      <h1>{count}</h1> {/* Only this text node updates */}
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

---

### Q2: How does React Fiber improve performance?

**Answer:**

**React Fiber** is React's reconciliation algorithm rewrite (React 16+). It enables:

**Key Features:**

1. **Incremental Rendering**: Split work into chunks
2. **Pause/Resume**: Pause work if something more important comes up
3. **Priority**: Assign priority to different updates
4. **Concurrent Features**: Multiple renders in progress

**Phases:**

```jsx
// Render Phase (can be interrupted)
- Reconciliation
- Building work-in-progress tree
- Can be paused, aborted, or restarted

// Commit Phase (cannot be interrupted)
- Apply changes to DOM
- Run lifecycle methods
- Must complete synchronously
```

**Priority Levels:**

```jsx
// High Priority (user interactions)
- onClick, onChange, etc.
- Must be responsive

// Low Priority (data fetching, background updates)
- API responses
- Can be deferred

// Example
function App() {
  const [urgent, setUrgent] = useState('');
  const [deferred, setDeferred] = useState('');

  // In React 18+
  const handleChange = (e) => {
    setUrgent(e.target.value); // Urgent update
    startTransition(() => {
      setDeferred(e.target.value); // Low priority
    });
  };

  return (
    <div>
      <input onChange={handleChange} />
      <div>{urgent}</div>
      <SlowList items={deferred} /> {/* Can be deferred */}
    </div>
  );
}
```

---

## Performance Optimization

### Q3: What are the main techniques to optimize React performance?

**Answer:**

**1. React.memo - Prevent unnecessary re-renders:**

```jsx
// Memoize functional component
const ExpensiveComponent = React.memo(({ data }) => {
  console.log("Rendering...");
  return <div>{data}</div>;
});

// With custom comparison
const MemoComponent = React.memo(
  ({ user }) => <div>{user.name}</div>,
  (prevProps, nextProps) => {
    // Return true if equal (skip render)
    return prevProps.user.id === nextProps.user.id;
  }
);

// Parent component
function Parent() {
  const [count, setCount] = useState(0);
  const data = "static"; // Doesn't change

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
      {/* ExpensiveComponent won't re-render when count changes */}
      <ExpensiveComponent data={data} />
    </div>
  );
}
```

**2. useMemo - Memoize expensive calculations:**

```jsx
function ProductList({ products, filter }) {
  // Only recalculates when dependencies change
  const filteredProducts = useMemo(() => {
    console.log("Filtering...");
    return products.filter((p) => p.category === filter);
  }, [products, filter]);

  const totalPrice = useMemo(() => {
    return filteredProducts.reduce((sum, p) => sum + p.price, 0);
  }, [filteredProducts]);

  return (
    <div>
      <p>Total: ${totalPrice}</p>
      {filteredProducts.map((p) => (
        <Product key={p.id} product={p} />
      ))}
    </div>
  );
}
```

**3. useCallback - Memoize functions:**

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ New function on every render
  const handleClick = () => {
    console.log("Clicked");
  };

  // ✅ Memoized function
  const handleClick = useCallback(() => {
    console.log("Clicked");
  }, []);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
      <MemoizedChild onClick={handleClick} />
    </div>
  );
}

const MemoizedChild = React.memo(({ onClick }) => {
  console.log("Child rendered");
  return <button onClick={onClick}>Click Me</button>;
});
```

**4. Code Splitting - Lazy load components:**

```jsx
// Lazy load component
const HeavyComponent = React.lazy(() => import("./HeavyComponent"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}

// Route-based code splitting
const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

**5. Virtualization - Render only visible items:**

```jsx
// Using react-window or react-virtualized
import { FixedSizeList } from "react-window";

function LargeList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>{items[index].name}</div>
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
```

**6. Debouncing and Throttling:**

```jsx
// Debounce search input
function SearchInput() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      // Perform search
      searchAPI(debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}

// Throttle scroll handler
function InfiniteScroll() {
  const handleScroll = useThrottle(() => {
    // Load more items
  }, 200);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return <div>{/* content */}</div>;
}
```

**7. Avoid inline objects and arrays:**

```jsx
// ❌ Bad - New object on every render
function Component() {
  return <Child style={{ color: "red" }} />;
}

// ✅ Good - Stable reference
const style = { color: "red" };
function Component() {
  return <Child style={style} />;
}

// Or use useMemo
function Component() {
  const style = useMemo(() => ({ color: "red" }), []);
  return <Child style={style} />;
}
```

**8. Key optimization strategies:**

```jsx
// Profile with React DevTools Profiler
import { Profiler } from "react";

function App() {
  const onRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    console.log(`${id} took ${actualDuration}ms`);
  };

  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Content />
    </Profiler>
  );
}
```

---

### Q4: What's the difference between React.memo, useMemo, and useCallback?

**Answer:**

**React.memo** - Memoizes component
**useMemo** - Memoizes value
**useCallback** - Memoizes function

**Comparison:**

```jsx
// React.memo - Prevents component re-render
const ChildComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const data = "static";

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
      {/* ChildComponent won't re-render */}
      <ChildComponent data={data} />
    </div>
  );
}

// useMemo - Memoizes computed value
function Component({ data }) {
  const expensiveValue = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  return <div>{expensiveValue}</div>;
}

// useCallback - Memoizes function
function Component() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log("Clicked");
  }, []);

  return <button onClick={handleClick}>Click</button>;
}

// useCallback is equivalent to:
const handleClick = useMemo(() => {
  return () => console.log("Clicked");
}, []);
```

**When to use each:**

| Hook        | Use When                             |
| ----------- | ------------------------------------ |
| React.memo  | Prevent component re-renders         |
| useMemo     | Cache expensive calculations         |
| useCallback | Prevent child re-renders (with memo) |

---

## Code Splitting and Lazy Loading

### Q5: How do you implement code splitting in React?

**Answer:**

**1. React.lazy and Suspense:**

```jsx
// Lazy load component
const LazyComponent = React.lazy(() => import("./LazyComponent"));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}

// Route-based splitting
const Home = React.lazy(() => import("./pages/Home"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Profile = React.lazy(() => import("./pages/Profile"));

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

// Named exports
const { ComponentA, ComponentB } = React.lazy(() =>
  import("./Components").then((module) => ({
    default: {
      ComponentA: module.ComponentA,
      ComponentB: module.ComponentB,
    },
  }))
);

// Error boundary with Suspense
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

**2. Dynamic imports:**

```jsx
// Conditional loading
function Component({ showFeature }) {
  const [FeatureComponent, setFeatureComponent] = useState(null);

  useEffect(() => {
    if (showFeature) {
      import("./FeatureComponent").then((module) => {
        setFeatureComponent(() => module.default);
      });
    }
  }, [showFeature]);

  if (!showFeature || !FeatureComponent) return null;
  return <FeatureComponent />;
}

// Load on interaction
function ImageGallery() {
  const [showLightbox, setShowLightbox] = useState(false);
  const [Lightbox, setLightbox] = useState(null);

  const handleImageClick = async () => {
    if (!Lightbox) {
      const module = await import("./Lightbox");
      setLightbox(() => module.default);
    }
    setShowLightbox(true);
  };

  return (
    <div>
      <img onClick={handleImageClick} src="..." alt="..." />
      {showLightbox && Lightbox && <Lightbox />}
    </div>
  );
}
```

**3. Prefetching and preloading:**

```jsx
// Prefetch on hover
function Navigation() {
  const handleMouseEnter = () => {
    // Prefetch component
    import("./Dashboard");
  };

  return (
    <Link to="/dashboard" onMouseEnter={handleMouseEnter}>
      Dashboard
    </Link>
  );
}

// Preload in webpack
const DashboardComponent = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./Dashboard")
);
```

---

## Higher-Order Components

### Q6: What are Higher-Order Components (HOCs)? Provide examples.

**Answer:**

**Higher-Order Component** is a function that takes a component and returns a new component with additional props or functionality.

**Pattern:**

```jsx
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

**Examples:**

```jsx
// 1. Authentication HOC
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return <Navigate to="/login" />;
    }

    return <Component {...props} user={user} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);

function App() {
  return <ProtectedDashboard />;
}

// 2. Loading HOC
function withLoading(Component) {
  return function LoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return <Component {...props} />;
  };
}

// Usage
const UserListWithLoading = withLoading(UserList);

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  return <UserListWithLoading users={users} isLoading={loading} />;
}

// 3. Data fetching HOC
function withData(url) {
  return function (Component) {
    return function DataComponent(props) {
      const [data, setData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            setData(data);
            setLoading(false);
          })
          .catch((err) => {
            setError(err);
            setLoading(false);
          });
      }, []);

      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error.message}</div>;

      return <Component {...props} data={data} />;
    };
  };
}

// Usage
const UserList = ({ data }) => (
  <ul>
    {data.map((user) => (
      <li key={user.id}>{user.name}</li>
    ))}
  </ul>
);

const UserListWithData = withData("/api/users")(UserList);

// 4. Logging HOC
function withLogger(Component) {
  return function LoggedComponent(props) {
    useEffect(() => {
      console.log("Component mounted", Component.name);
      return () => {
        console.log("Component unmounted", Component.name);
      };
    }, []);

    return <Component {...props} />;
  };
}

// 5. Composing HOCs
function compose(...hocs) {
  return (Component) => {
    return hocs.reduceRight((acc, hoc) => hoc(acc), Component);
  };
}

// Usage
const enhance = compose(withAuth, withLoading, withLogger);

const EnhancedComponent = enhance(MyComponent);
```

**HOC Best Practices:**

```jsx
// ✅ Pass unrelated props through
function withExample(Component) {
  return function Enhanced(props) {
    const extraProp = "extra";
    return <Component {...props} extraProp={extraProp} />;
  };
}

// ✅ Set display name for debugging
function withExample(Component) {
  const Enhanced = (props) => <Component {...props} />;

  Enhanced.displayName = `withExample(${
    Component.displayName || Component.name
  })`;

  return Enhanced;
}

// ❌ Don't mutate original component
function withExample(Component) {
  Component.prototype.extra = "extra"; // DON'T DO THIS
  return Component;
}

// ❌ Don't use HOC inside render
function Parent() {
  // ❌ Creates new component on every render
  const EnhancedComponent = withExample(Child);
  return <EnhancedComponent />;
}

// ✅ Apply HOC outside component
const EnhancedChild = withExample(Child);
function Parent() {
  return <EnhancedChild />;
}
```

**HOCs vs Hooks:**

Most HOC patterns can be replaced with hooks:

```jsx
// HOC pattern
const UserProfileWithAuth = withAuth(UserProfile);

// Hook pattern (preferred)
function UserProfile() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <div>Profile: {user.name}</div>;
}
```

---

## Render Props

### Q7: What is the Render Props pattern?

**Answer:**

**Render Props** is a technique for sharing code between components using a prop whose value is a function.

**Examples:**

```jsx
// 1. Basic render prop
function Mouse({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return render(position);
}

// Usage
function App() {
  return (
    <Mouse
      render={({ x, y }) => (
        <div>
          Mouse position: {x}, {y}
        </div>
      )}
    />
  );
}

// 2. Using children as function
function DataProvider({ url, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, [url]);

  return children({ data, loading });
}

// Usage
function App() {
  return (
    <DataProvider url="/api/users">
      {({ data, loading }) =>
        loading ? (
          <div>Loading...</div>
        ) : (
          <ul>
            {data.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        )
      }
    </DataProvider>
  );
}

// 3. Toggle component
function Toggle({ children }) {
  const [on, setOn] = useState(false);

  const toggle = () => setOn(!on);

  return children({ on, toggle });
}

// Usage
function App() {
  return (
    <Toggle>
      {({ on, toggle }) => (
        <div>
          <button onClick={toggle}>Toggle</button>
          {on && <div>Content is visible</div>}
        </div>
      )}
    </Toggle>
  );
}

// 4. Form management
function Form({ onSubmit, children }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return children({
    values,
    errors,
    handleChange,
    handleSubmit,
  });
}

// Usage
function SignupForm() {
  return (
    <Form onSubmit={(values) => console.log(values)}>
      {({ values, handleChange, handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <input
            value={values.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </Form>
  );
}
```

**Render Props vs Hooks:**

```jsx
// Render Props
<Mouse
  render={({ x, y }) => (
    <div>
      {x}, {y}
    </div>
  )}
/>;

// Hook (preferred in modern React)
function Component() {
  const { x, y } = useMouse();
  return (
    <div>
      {x}, {y}
    </div>
  );
}

function useMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return position;
}
```

---

## Error Boundaries

### Q8: What are Error Boundaries? How do you implement them?

**Answer:**

**Error Boundaries** are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI.

**Key Points:**

- Must be class components (no functional equivalent yet)
- Catch errors in render, lifecycle methods, and constructors
- Don't catch errors in event handlers, async code, or error boundary itself

**Implementation:**

```jsx
// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to error reporting service
    console.error("Error caught:", error, errorInfo);
    this.setState({ error, errorInfo });

    // Send to error tracking service
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}

// Multiple error boundaries
function App() {
  return (
    <ErrorBoundary fallback={<div>App Error</div>}>
      <Header />
      <ErrorBoundary fallback={<div>Content Error</div>}>
        <Content />
      </ErrorBoundary>
      <Footer />
    </ErrorBoundary>
  );
}

// With custom fallback
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// Usage with custom fallback
<ErrorBoundary
  fallback={<CustomErrorPage />}
  onError={(error, errorInfo) => logToService(error, errorInfo)}
>
  <App />
</ErrorBoundary>;

// What Error Boundaries DON'T catch
function Component() {
  const [error, setError] = useState(false);

  // ❌ Event handlers (use try-catch)
  const handleClick = () => {
    try {
      throw new Error("Event handler error");
    } catch (err) {
      setError(true);
    }
  };

  // ❌ Async code (use try-catch)
  useEffect(() => {
    async function fetchData() {
      try {
        await fetch("/api/data");
      } catch (err) {
        setError(true);
      }
    }
    fetchData();
  }, []);

  // ✅ Render errors (caught by Error Boundary)
  if (error) {
    throw new Error("Render error");
  }

  return <button onClick={handleClick}>Click</button>;
}
```

---

## Portals

### Q9: What are React Portals? When would you use them?

**Answer:**

**Portals** provide a way to render children into a DOM node that exists outside the parent component's DOM hierarchy.

**Use Cases:**

- Modals
- Tooltips
- Dropdowns
- Notifications

**Syntax:**

```jsx
ReactDOM.createPortal(child, container);
```

**Examples:**

```jsx
// 1. Modal Portal
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

// HTML
// <div id="root"></div>
// <div id="modal-root"></div>

// Usage
function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Modal Title</h2>
        <p>Modal content</p>
      </Modal>
    </div>
  );
}

// 2. Tooltip Portal
function Tooltip({ children, text }) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef();

  const handleMouseEnter = () => {
    const rect = ref.current.getBoundingClientRect();
    setPosition({ x: rect.left, y: rect.top - 30 });
    setIsVisible(true);
  };

  return (
    <>
      <span
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </span>
      {isVisible &&
        ReactDOM.createPortal(
          <div
            className="tooltip"
            style={{
              position: "absolute",
              left: position.x,
              top: position.y,
            }}
          >
            {text}
          </div>,
          document.body
        )}
    </>
  );
}

// 3. Notification System
function NotificationPortal({ notifications }) {
  return ReactDOM.createPortal(
    <div className="notification-container">
      {notifications.map((notification) => (
        <div key={notification.id} className="notification">
          {notification.message}
        </div>
      ))}
    </div>,
    document.getElementById("notification-root")
  );
}
```

**Benefits:**

1. **Escape overflow/z-index issues**
2. **Event bubbling works normally** (even though rendered elsewhere in DOM)
3. **Clean separation of concerns**

---

## Refs and Forward Refs

### Q10: What are refs? How do you use forwardRef?

**Answer:**

**Refs** provide a way to access DOM nodes or React elements created in the render method.

**forwardRef** allows parent components to pass refs down to child components.

**Examples:**

```jsx
// 1. Basic ref usage
function TextInput() {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={handleClick}>Focus Input</button>
    </div>
  );
}

// 2. forwardRef
const FancyInput = React.forwardRef((props, ref) => (
  <input ref={ref} className="fancy-input" {...props} />
));

// Usage
function Parent() {
  const inputRef = useRef(null);

  return (
    <div>
      <FancyInput ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </div>
  );
}

// 3. useImperativeHandle - Customize exposed ref
const CustomInput = React.forwardRef((props, ref) => {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    clear: () => {
      inputRef.current.value = "";
    },
    getValue: () => {
      return inputRef.current.value;
    },
  }));

  return <input ref={inputRef} {...props} />;
});

// Usage
function Parent() {
  const customInputRef = useRef(null);

  const handleClick = () => {
    customInputRef.current.focus();
    const value = customInputRef.current.getValue();
    console.log(value);
    customInputRef.current.clear();
  };

  return (
    <div>
      <CustomInput ref={customInputRef} />
      <button onClick={handleClick}>Actions</button>
    </div>
  );
}
```

---

## Strict Mode

### Q11: What is React Strict Mode?

**Answer:**

**Strict Mode** is a tool for highlighting potential problems in an application. It activates additional checks and warnings for its descendants.

**Features:**

```jsx
import { StrictMode } from "react";

function App() {
  return (
    <StrictMode>
      <Component />
    </StrictMode>
  );
}

// Strict Mode helps with:
// 1. Identifying components with unsafe lifecycles
// 2. Warning about legacy string ref API
// 3. Detecting unexpected side effects
// 4. Detecting legacy context API
// 5. Ensuring reusable state (React 18+)
```

**Behaviors in Strict Mode:**

```jsx
// Double-invokes functions to detect side effects:
// - Component function bodies
// - useState/useReducer/useMemo initializers
// - Class component constructor/render/shouldComponentUpdate

function Component() {
  console.log("Rendered"); // Logs twice in development
  const [state] = useState(() => {
    console.log("State init"); // Logs twice
    return 0;
  });

  return <div>{state}</div>;
}
```

**Note:** Strict Mode only runs in development mode, not production.

---

This covers advanced React concepts comprehensively!


