# React Interview Preparation Guide

This folder contains the most common React interview questions organized by difficulty and topic. Use this resource to prepare for React developer interviews at all levels.

## 📋 Table of Contents

### 1. [Basic React Questions](01-basic-questions.md)

- React fundamentals
- Components and JSX
- Props and state basics
- Rendering and lifecycle

### 2. [Hooks Questions](02-hooks-questions.md)

- useState and useEffect
- useContext and useReducer
- Custom hooks
- Hooks rules and best practices

### 3. [Advanced Concepts Questions](03-advanced-questions.md)

- Context API and state management
- Performance optimization
- Code splitting and lazy loading
- Higher-order components and render props

### 4. [State Management Questions](04-state-management-questions.md)

- Redux and Redux Toolkit
- Context API patterns
- Zustand, Recoil, and other libraries
- State management best practices

### 5. [Practical Coding Questions](05-practical-questions.md)

- Component implementations
- Real-world problem solving
- Code challenges and patterns
- Common UI patterns

## 🎯 Interview Preparation Strategy

### Before the Interview

1. **Master React Fundamentals** - Components, props, state, lifecycle
2. **Understand Hooks** - All built-in hooks and custom hooks
3. **Know State Management** - Redux, Context API, or modern alternatives
4. **Performance Optimization** - Memoization, code splitting, lazy loading
5. **Build Real Projects** - Have projects to discuss and showcase
6. **Study Component Patterns** - HOCs, render props, compound components
7. **Learn Testing** - Jest, React Testing Library, integration tests

### During the Interview

1. **Think Component-First** - Break problems into reusable components
2. **Discuss Trade-offs** - Class vs functional, when to optimize, etc.
3. **Start Simple** - Build basic version, then add features
4. **Consider Edge Cases** - Loading states, errors, empty data
5. **Clean Code** - Proper naming, file organization, comments
6. **Explain Decisions** - Why you chose specific patterns or libraries

### Common Interview Formats

- **Concept Questions** - React fundamentals and API knowledge
- **Coding Challenges** - Build components or features live
- **Code Review** - Analyze and improve existing React code
- **System Design** - Design component architecture or full applications
- **Debugging** - Find and fix issues in React applications
- **Performance** - Identify and resolve performance bottlenecks

## 📚 Key Topics to Master

### Core React Concepts

- [ ] JSX syntax and transformation
- [ ] Components (functional vs class)
- [ ] Props and prop types
- [ ] State management
- [ ] Event handling
- [ ] Conditional rendering
- [ ] Lists and keys
- [ ] Forms and controlled components
- [ ] Component lifecycle

### React Hooks

- [ ] useState - state management
- [ ] useEffect - side effects and lifecycle
- [ ] useContext - consuming context
- [ ] useReducer - complex state logic
- [ ] useCallback - memoized callbacks
- [ ] useMemo - memoized values
- [ ] useRef - DOM refs and mutable values
- [ ] useLayoutEffect - synchronous effects
- [ ] useImperativeHandle - customizing ref
- [ ] Custom hooks - reusable logic

### Advanced Patterns

- [ ] Higher-Order Components (HOCs)
- [ ] Render props
- [ ] Compound components
- [ ] Controlled vs uncontrolled components
- [ ] Error boundaries
- [ ] Portals
- [ ] Fragments
- [ ] React.memo and PureComponent
- [ ] Forward refs

### State Management

- [ ] Local component state
- [ ] Lifting state up
- [ ] Context API
- [ ] Redux / Redux Toolkit
- [ ] Zustand, Recoil, Jotai
- [ ] React Query / TanStack Query
- [ ] State machines (XState)

### Performance Optimization

- [ ] React.memo
- [ ] useMemo and useCallback
- [ ] Code splitting (React.lazy)
- [ ] Suspense and lazy loading
- [ ] Virtual scrolling
- [ ] Debouncing and throttling
- [ ] Bundle size optimization
- [ ] React DevTools Profiler

### Routing

- [ ] React Router basics
- [ ] Dynamic routing
- [ ] Protected routes
- [ ] Nested routes
- [ ] URL parameters and query strings
- [ ] Navigation and redirects

### Testing

- [ ] Jest basics
- [ ] React Testing Library
- [ ] Component testing
- [ ] Integration testing
- [ ] Mocking and spies
- [ ] Test-driven development

### Build Tools & Ecosystem

- [ ] Create React App
- [ ] Vite
- [ ] Next.js
- [ ] TypeScript with React
- [ ] ESLint and Prettier
- [ ] PropTypes vs TypeScript

## 🚀 Quick Reference

### Component Basics

```jsx
// Functional Component
function Welcome({ name }) {
  return <h1>Hello, {name}</h1>;
}

// With State
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

### Common Hooks Patterns

```jsx
// useState
const [state, setState] = useState(initialValue);

// useEffect
useEffect(() => {
  // Side effect
  return () => {
    // Cleanup
  };
}, [dependencies]);

// useContext
const value = useContext(MyContext);

// useReducer
const [state, dispatch] = useReducer(reducer, initialState);

// useCallback
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// useMemo
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// useRef
const inputRef = useRef(null);
```

### React Patterns

```jsx
// HOC Pattern
const withAuth = (Component) => {
  return (props) => {
    const isAuthenticated = useAuth();
    return isAuthenticated ? <Component {...props} /> : <Login />;
  };
};

// Render Props
<DataProvider render={(data) => <Component data={data} />} />

// Compound Components
<Tabs>
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Content 1</TabPanel>
    <TabPanel>Content 2</TabPanel>
  </TabPanels>
</Tabs>
```

### Performance Optimization

```jsx
// React.memo
const MemoizedComponent = React.memo(Component);

// useMemo
const expensiveValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

// useCallback
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// Code Splitting
const LazyComponent = React.lazy(() => import("./Component"));

<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>;
```

## 📖 Additional Resources

- [React Official Documentation](https://react.dev/)
- [React Beta Docs](https://react.dev/learn) - New official docs
- [Overreacted by Dan Abramov](https://overreacted.io/)
- [Kent C. Dodds Blog](https://kentcdodds.com/blog)
- [React Patterns](https://reactpatterns.com/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [React Interview Questions](https://github.com/sudheerj/reactjs-interview-questions)

## 💡 Pro Tips

1. **Master Hooks** - Modern React is hooks-based, master them thoroughly
2. **Build Projects** - Nothing beats real-world experience
3. **Read Source Code** - Study popular React libraries
4. **Performance Matters** - Know when and how to optimize
5. **TypeScript** - Learn TypeScript with React for better code quality
6. **Testing** - Write tests for your components
7. **Stay Updated** - React evolves quickly, follow updates
8. **Component Design** - Think about reusability and composition

## 🔥 Common Interview Gotchas

1. **Keys in Lists** - Why keys matter and how to use them properly
2. **State Updates** - Asynchronous nature of setState
3. **Closures in useEffect** - Stale closures and dependency arrays
4. **React.memo Pitfalls** - When it doesn't work (objects, functions)
5. **useEffect Dependencies** - Exhaustive deps and infinite loops
6. **Event Handling** - SyntheticEvent and event pooling
7. **Controlled vs Uncontrolled** - Form component patterns
8. **Component Re-renders** - What triggers re-renders

## 🎓 Sample Interview Questions Overview

### Junior Level (0-2 years)

- What is React and why use it?
- Explain JSX
- What are components?
- Difference between props and state
- What is useState hook?
- How to handle events in React?
- What are keys and why are they important?
- Explain useEffect hook

### Mid Level (2-5 years)

- Explain React lifecycle methods and their hook equivalents
- What is Virtual DOM and reconciliation?
- How does Context API work?
- Explain useCallback and useMemo
- What are custom hooks?
- How to optimize React performance?
- Explain error boundaries
- What is code splitting?

### Senior Level (5+ years)

- Design a scalable React application architecture
- Compare state management solutions (Redux vs Context vs Zustand)
- Explain React Fiber and reconciliation algorithm
- How would you implement SSR with React?
- Micro-frontends with React
- Advanced performance optimization strategies
- Design system and component library architecture
- Testing strategies for large React applications

## 📝 Coding Challenge Categories

### Component Building

- Build reusable UI components
- Form handling and validation
- Modal, dropdown, tooltip implementations
- Infinite scroll and pagination

### State Management

- Todo app with different state solutions
- Shopping cart implementation
- Complex form with nested state
- Global state management patterns

### Data Fetching

- API integration with loading/error states
- Data caching strategies
- Optimistic updates
- Real-time data with WebSockets

### Performance

- Optimize slow list rendering
- Prevent unnecessary re-renders
- Code splitting implementation
- Image lazy loading

### Advanced Patterns

- Build custom hooks
- Implement HOC pattern
- Design compound components
- Error boundary implementation

---

**Good luck with your React interview! 🚀**

Remember: Focus on understanding React's core concepts deeply, practice building real components, and always think about user experience and performance.






