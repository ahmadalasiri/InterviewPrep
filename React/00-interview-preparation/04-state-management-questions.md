# State Management Interview Questions

## Table of Contents

- [State Management Fundamentals](#state-management-fundamentals)
- [Context API](#context-api)
- [Redux and Redux Toolkit](#redux-and-redux-toolkit)
- [Modern State Management](#modern-state-management)
- [Data Fetching Libraries](#data-fetching-libraries)
- [State Management Patterns](#state-management-patterns)

---

## State Management Fundamentals

### Q1: What are the different types of state in React applications?

**Answer:**

**1. Local State** - Component-specific state

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return <div>Count: {count}</div>;
}
```

**2. Shared/Lifted State** - State shared between components

```jsx
function Parent() {
  const [user, setUser] = useState(null);

  return (
    <div>
      <Header user={user} />
      <Content user={user} setUser={setUser} />
    </div>
  );
}
```

**3. Global State** - Application-wide state

```jsx
// Using Context
const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Components />
    </UserContext.Provider>
  );
}
```

**4. Server State** - Data from server/API

```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  return <div>{/* render users */}</div>;
}
```

**5. URL State** - State in URL params/query strings

```jsx
function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q");

  return (
    <div>
      <input
        value={query || ""}
        onChange={(e) => setSearchParams({ q: e.target.value })}
      />
    </div>
  );
}
```

**6. Form State** - Form field values and validation

```jsx
function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  return <form>{/* form fields */}</form>;
}
```

---

### Q2: When should you lift state up vs use Context vs use external state management?

**Answer:**

**Lift State Up** - When 2-3 components need shared state

```jsx
// ✅ Good for simple parent-child sharing
function Parent() {
  const [value, setValue] = useState("");

  return (
    <div>
      <ChildA value={value} />
      <ChildB value={value} onChange={setValue} />
    </div>
  );
}
```

**Context API** - When many components at different levels need state

```jsx
// ✅ Good for theme, auth, language preferences
const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <DeepChild /> {/* Can access theme anywhere */}
    </ThemeContext.Provider>
  );
}
```

**External State Management** - When you need advanced features

```jsx
// ✅ Good for complex apps with:
// - Many global states
// - Complex update logic
// - Time-travel debugging
// - Middleware (logging, analytics)
// - DevTools integration

// Redux, Zustand, Recoil, etc.
```

**Decision Matrix:**

| Scenario                          | Solution               |
| --------------------------------- | ---------------------- |
| 2-3 components, same branch       | Lift state up          |
| Many components, different levels | Context API            |
| Simple global state               | Context API or Zustand |
| Complex state logic               | Redux Toolkit          |
| Server data caching               | React Query/SWR        |
| Form state                        | React Hook Form/Formik |

---

## Context API

### Q3: How does Context API work? What are its limitations?

**Answer:**

**Creating and Using Context:**

```jsx
// 1. Create Context
const UserContext = createContext();

// 2. Create Provider
function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user
    fetchUser().then((user) => {
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

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// 3. Create Custom Hook
function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}

// 4. Use in Components
function Profile() {
  const { user, logout } = useUser();

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// 5. Wrap App
function App() {
  return (
    <UserProvider>
      <Profile />
    </UserProvider>
  );
}
```

**Context Limitations:**

```jsx
// 1. Performance Issue - All consumers re-render when value changes
const AppContext = createContext();

function Provider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  // ❌ Problem: Any change causes all consumers to re-render
  const value = { user, setUser, theme, setTheme };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Component only needs theme, but re-renders when user changes
function ThemedButton() {
  const { theme } = useContext(AppContext);
  return <button className={theme}>Button</button>;
}

// ✅ Solution 1: Split contexts
const UserContext = createContext();
const ThemeContext = createContext();

function Providers({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}

// ✅ Solution 2: Memoize value
function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const value = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// ✅ Solution 3: Use Context Selector pattern
function useUserSelector(selector) {
  const context = useContext(UserContext);
  return selector(context);
}

// Only re-renders when name changes
function Component() {
  const name = useUserSelector((state) => state.user.name);
  return <div>{name}</div>;
}
```

**Other Limitations:**

1. **No built-in optimization** - All consumers re-render
2. **No middleware** - Can't easily add logging, persistence, etc.
3. **No DevTools** - Harder to debug state changes
4. **No time-travel** - Can't replay actions
5. **Provider hell** - Too many nested providers

---

## Redux and Redux Toolkit

### Q4: What is Redux? How does Redux Toolkit simplify Redux?

**Answer:**

**Redux Core Concepts:**

1. **Store** - Single source of truth
2. **Actions** - Events that describe what happened
3. **Reducers** - Pure functions that specify how state changes
4. **Dispatch** - Send actions to store
5. **Selectors** - Extract data from store

**Traditional Redux:**

```jsx
// Actions
const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";

const increment = () => ({ type: INCREMENT });
const decrement = () => ({ type: DECREMENT });

// Reducer
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case INCREMENT:
      return { ...state, count: state.count + 1 };
    case DECREMENT:
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}

// Store
const store = createStore(counterReducer);

// Component
function Counter() {
  const count = useSelector((state) => state.count);
  const dispatch = useDispatch();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
    </div>
  );
}
```

**Redux Toolkit (Modern Approach):**

```jsx
// Slice with Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { count: 0 },
  reducers: {
    increment: (state) => {
      // ✅ Can "mutate" state (Immer under the hood)
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    incrementByAmount: (state, action) => {
      state.count += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;

// Store
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

// Component
function Counter() {
  const count = useSelector((state) => state.counter.count);
  const dispatch = useDispatch();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  );
}

// Async actions with createAsyncThunk
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk("users/fetchUser", async (userId) => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Component
function UserProfile({ userId }) {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUser(userId));
  }, [userId, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return <div>{data.name}</div>;
}
```

**Redux Toolkit Benefits:**

1. **Less boilerplate** - Automatic action creators
2. **Immer integration** - "Mutate" state safely
3. **DevTools included** - Out of the box
4. **TypeScript support** - Better type inference
5. **Built-in thunks** - Async actions simplified
6. **Best practices** - Enforced by default

---

### Q5: What is RTK Query? How does it compare to React Query?

**Answer:**

**RTK Query** is Redux Toolkit's data fetching solution.

**Basic Usage:**

```jsx
// API Slice
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["User", "Post"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "users",
      providesTags: ["User"],
    }),
    getUser: builder.query({
      query: (id) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    createUser: builder.mutation({
      query: (user) => ({
        url: "users",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `users/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} = api;

// Component
function UserList() {
  const { data: users, isLoading, error } = useGetUsersQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

function EditUser({ userId }) {
  const { data: user } = useGetUserQuery(userId);
  const [updateUser] = useUpdateUserMutation();

  const handleSave = async (updates) => {
    await updateUser({ id: userId, ...updates });
  };

  return <UserForm user={user} onSave={handleSave} />;
}
```

**RTK Query vs React Query:**

| Feature            | RTK Query      | React Query          |
| ------------------ | -------------- | -------------------- |
| Integration        | Redux only     | Any state management |
| Learning curve     | Higher (Redux) | Lower                |
| Bundle size        | Larger (Redux) | Smaller              |
| DevTools           | Redux DevTools | React Query DevTools |
| Caching            | Tag-based      | Key-based            |
| Mutations          | Built-in       | Built-in             |
| Optimistic updates | Supported      | Supported            |
| Best for           | Redux apps     | Any React app        |

---

## Modern State Management

### Q6: Compare Zustand, Recoil, and Jotai. When would you use each?

**Answer:**

**1. Zustand - Simple and lightweight**

```jsx
import create from "zustand";

// Store
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// Component
function Counter() {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
    </div>
  );
}

// Async actions
const useStore = create((set) => ({
  users: [],
  loading: false,
  fetchUsers: async () => {
    set({ loading: true });
    const users = await fetch("/api/users").then((r) => r.json());
    set({ users, loading: false });
  },
}));

// Middleware
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    { name: "counter-storage" }
  )
);
```

**2. Recoil - Atomic state management**

```jsx
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

// Atoms
const countState = atom({
  key: "countState",
  default: 0,
});

const userState = atom({
  key: "userState",
  default: null,
});

// Selectors (derived state)
const doubleCountState = selector({
  key: "doubleCountState",
  get: ({ get }) => {
    const count = get(countState);
    return count * 2;
  },
});

// Async selectors
const userQuery = selector({
  key: "userQuery",
  get: async ({ get }) => {
    const userId = get(userIdState);
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  },
});

// Component
function Counter() {
  const [count, setCount] = useRecoilState(countState);
  const doubleCount = useRecoilValue(doubleCountState);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Double: {doubleCount}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

// App wrapper
function App() {
  return (
    <RecoilRoot>
      <Counter />
    </RecoilRoot>
  );
}
```

**3. Jotai - Primitive and flexible**

```jsx
import { atom, useAtom } from "jotai";

// Atoms
const countAtom = atom(0);
const userAtom = atom(null);

// Derived atoms
const doubleCountAtom = atom((get) => get(countAtom) * 2);

// Write-only atom
const incrementAtom = atom(null, (get, set) =>
  set(countAtom, get(countAtom) + 1)
);

// Async atom
const userAtom = atom(async (get) => {
  const userId = get(userIdAtom);
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
});

// Component
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const [doubleCount] = useAtom(doubleCountAtom);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Double: {doubleCount}</p>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );
}
```

**Comparison:**

| Library | Philosophy   | Bundle Size | Learning Curve | Best For              |
| ------- | ------------ | ----------- | -------------- | --------------------- |
| Zustand | Simple store | ~1KB        | Easy           | Simple global state   |
| Recoil  | Atomic       | ~22KB       | Medium         | Facebook-style apps   |
| Jotai   | Primitive    | ~3KB        | Easy-Medium    | Flexible atomic state |

**When to use:**

- **Zustand**: Simple apps, need lightweight solution
- **Recoil**: Complex dependency graphs, Facebook patterns
- **Jotai**: TypeScript apps, flexible atomic state

---

## Data Fetching Libraries

### Q7: What is React Query (TanStack Query)? What problems does it solve?

**Answer:**

**React Query** is a data fetching and caching library that makes fetching, caching, synchronizing and updating server state simple.

**Problems it solves:**

1. **Caching** - Automatic caching and cache invalidation
2. **Background updates** - Refetch data in background
3. **Deduplication** - Combine duplicate requests
4. **Loading states** - Built-in loading/error handling
5. **Pagination** - Easy pagination and infinite scroll
6. **Optimistic updates** - Update UI before server responds

**Basic Usage:**

```jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Fetch data
function Users() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users");
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Mutations
function CreateUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newUser) => {
      const response = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(newUser),
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleSubmit = (user) => {
    mutation.mutate(user);
  };

  return (
    <form onSubmit={handleSubmit}>
      {mutation.isLoading && <div>Creating...</div>}
      {mutation.isError && <div>Error: {mutation.error.message}</div>}
      {mutation.isSuccess && <div>User created!</div>}
    </form>
  );
}

// Dependent queries
function UserPosts({ userId }) {
  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });

  const { data: posts } = useQuery({
    queryKey: ["posts", userId],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!user, // Only fetch if user exists
  });

  return <div>{/* render posts */}</div>;
}

// Pagination
function PaginatedUsers() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["users", page],
    queryFn: () => fetchUsers(page),
    keepPreviousData: true, // Keep old data while fetching new
  });

  return (
    <div>
      <UserList users={data?.users} />
      <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
        Previous
      </button>
      <button onClick={() => setPage((p) => p + 1)} disabled={!data?.hasMore}>
        Next
      </button>
    </div>
  );
}

// Infinite scroll
function InfiniteUsers() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["users"],
      queryFn: ({ pageParam = 1 }) => fetchUsers(pageParam),
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    });

  return (
    <div>
      {data.pages.map((page) =>
        page.users.map((user) => <UserCard key={user.id} user={user} />)
      )}
      {hasNextPage && (
        <button onClick={fetchNextPage} disabled={isFetchingNextPage}>
          Load More
        </button>
      )}
    </div>
  );
}

// Optimistic updates
function TodoList() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateTodo,
    onMutate: async (newTodo) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      // Snapshot previous value
      const previousTodos = queryClient.getQueryData(["todos"]);

      // Optimistically update
      queryClient.setQueryData(["todos"], (old) => [...old, newTodo]);

      // Return context with snapshot
      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      // Rollback on error
      queryClient.setQueryData(["todos"], context.previousTodos);
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return <div>{/* todos */}</div>;
}
```

**Configuration:**

```jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 3,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Components />
    </QueryClientProvider>
  );
}
```

---

## State Management Patterns

### Q8: What are common state management patterns and anti-patterns?

**Answer:**

**Good Patterns:**

```jsx
// 1. Colocation - Keep state close to where it's used
function Component() {
  // ✅ Local state for local concerns
  const [isOpen, setIsOpen] = useState(false);

  return <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />;
}

// 2. Composition - Build complex UIs from simple components
function UserProfile() {
  return (
    <Card>
      <Avatar />
      <UserInfo />
      <Actions />
    </Card>
  );
}

// 3. Custom hooks - Extract reusable logic
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}

// 4. Derived state - Compute instead of store
function TodoList({ todos }) {
  // ✅ Derive from props
  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div>
      {activeCount} active, {completedCount} completed
    </div>
  );
}

// 5. State machines - Explicit state transitions
const [state, setState] = useState("idle");

const fetchData = async () => {
  setState("loading");
  try {
    const data = await api.fetch();
    setState("success");
  } catch (error) {
    setState("error");
  }
};
```

**Anti-Patterns:**

```jsx
// ❌ 1. Prop drilling - Passing props through many levels
function App() {
  const [user, setUser] = useState(null);
  return <Level1 user={user} setUser={setUser} />;
}

function Level1({ user, setUser }) {
  return <Level2 user={user} setUser={setUser} />;
}

function Level2({ user, setUser }) {
  return <Level3 user={user} setUser={setUser} />;
}

// ✅ Solution: Context or state management library

// ❌ 2. Duplicating state
function Component({ user }) {
  const [name, setName] = useState(user.name); // Duplicate!
  const [email, setEmail] = useState(user.email); // Duplicate!

  // What if user prop changes?
}

// ✅ Solution: Use props directly or derive state
function Component({ user }) {
  // Just use props
  return <div>{user.name} - {user.email}</div>;
}

// ❌ 3. Storing derived state
function TodoList({ todos }) {
  const [totalCount, setTotalCount] = useState(todos.length);
  const [completed, setCompleted] = useState(
    todos.filter(t => t.completed).length
  );

  // Must manually update when todos change!
}

// ✅ Solution: Compute on render
function TodoList({ todos }) {
  const totalCount = todos.length;
  const completed = todos.filter(t => t.completed).length;

  return <div>{completed} / {totalCount}</div>;
}

// ❌ 4. Putting everything in global state
const GlobalState = {
  modalOpen: false, // Should be local!
  tooltipVisible: false, // Should be local!
  user: {...}, // ✅ This belongs in global state
  currentPage: 1 // Could be in URL
};

// ✅ Solution: Only put truly global state in global store

// ❌ 5. Unnecessary re-renders
const value = { user, theme }; // New object every render!

<Context.Provider value={value}>

// ✅ Solution: Memoize
const value = useMemo(() => ({ user, theme }), [user, theme]);
```

**Best Practices:**

1. **Start local, lift when needed**
2. **Use the right tool** - Don't use Redux for everything
3. **Normalize state** - Avoid nested structures
4. **Separate server and client state**
5. **Use TypeScript** - Type-safe state management
6. **Test state logic** - Reducers, actions, selectors

---

This covers state management comprehensively!


