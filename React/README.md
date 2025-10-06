# React - Complete Learning Guide

This repository contains a comprehensive guide to learning React with practical examples and explanations.

## Table of Contents

### 0. Interview Preparation

**[00-interview-preparation/](00-interview-preparation/)** - Complete interview prep guide

- [Basic Questions](00-interview-preparation/01-basic-questions.md) - Components, JSX, props, state
- [Hooks Questions](00-interview-preparation/02-hooks-questions.md) - useState, useEffect, custom hooks
- [Advanced Questions](00-interview-preparation/03-advanced-questions.md) - Performance, HOCs, patterns
- [State Management](00-interview-preparation/04-state-management-questions.md) - Redux, Context, modern solutions
- [Practical Questions](00-interview-preparation/05-practical-questions.md) - Real coding challenges

### 1. Fundamentals

- **01-basics/** - React fundamentals
  - JSX syntax and expressions
  - Components (functional and class)
  - Props and prop types
  - State management basics
  - Event handling

### 2. Hooks

- **02-hooks/** - React Hooks
  - useState - State management
  - useEffect - Side effects and lifecycle
  - useContext - Context consumption
  - useReducer - Complex state logic
  - useCallback - Memoized callbacks
  - useMemo - Memoized values
  - useRef - Refs and mutable values
  - Custom hooks - Reusable logic

### 3. Advanced Patterns

- **03-advanced-patterns/** - Advanced React patterns
  - Higher-Order Components (HOCs)
  - Render Props
  - Compound Components
  - Controlled vs Uncontrolled
  - Error Boundaries
  - Portals
  - Forward Refs

### 4. State Management

- **04-state-management/** - State management solutions
  - Context API
  - Redux and Redux Toolkit
  - Zustand
  - Recoil
  - React Query / TanStack Query

### 5. Performance

- **05-performance/** - Performance optimization
  - React.memo
  - useMemo and useCallback
  - Code splitting
  - Lazy loading
  - Virtualization
  - Profiling

### 6. Routing

- **06-routing/** - React Router
  - Basic routing
  - Dynamic routes
  - Nested routes
  - Protected routes
  - URL parameters

### 7. Forms

- **07-forms/** - Form handling
  - Controlled components
  - Form validation
  - React Hook Form
  - Formik

### 8. Testing

- **08-testing/** - Testing React applications
  - Jest basics
  - React Testing Library
  - Component testing
  - Integration testing
  - Mocking

### 9. TypeScript

- **09-typescript/** - React with TypeScript
  - Component types
  - Props and state types
  - Event types
  - Custom hooks with TypeScript
  - Generic components

### 10. Real-World Projects

- **10-projects/** - Complete project examples
  - Todo App with CRUD operations
  - E-commerce product catalog
  - Social media dashboard
  - Real-time chat application

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Basic JavaScript knowledge
- Understanding of ES6+ features

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to React folder
cd React

# Install dependencies
npm install

# Start development server
npm start
```

## Core React Concepts

### Why React?

1. **Component-Based Architecture** - Build encapsulated components that manage their own state
2. **Declarative** - Design simple views for each state in your application
3. **Learn Once, Write Anywhere** - React Native for mobile, React for web
4. **Virtual DOM** - Efficient updates and rendering
5. **Rich Ecosystem** - Huge community and extensive libraries
6. **Strong Industry Adoption** - Used by Facebook, Netflix, Airbnb, and thousands more

### React Philosophy

- **Composition over Inheritance** - Build complex UIs from simple components
- **Unidirectional Data Flow** - Data flows down from parent to child
- **Single Source of Truth** - State is managed in one place
- **Immutability** - Don't mutate state directly
- **Declarative Programming** - Describe what you want, not how to do it

### Key Concepts to Master

#### 1. Components

```jsx
// Functional Component (Modern)
function Welcome({ name }) {
  return <h1>Hello, {name}</h1>;
}

// Component with State
function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

#### 2. JSX

```jsx
// JSX allows you to write HTML-like code in JavaScript
const element = (
  <div className="container">
    <h1>Title</h1>
    <p>{dynamicContent}</p>
  </div>
);
```

#### 3. Props

```jsx
// Props pass data from parent to child
function Parent() {
  return <Child name="John" age={30} />;
}

function Child({ name, age }) {
  return (
    <div>
      {name} is {age} years old
    </div>
  );
}
```

#### 4. State

```jsx
// State is managed within a component
function Form() {
  const [email, setEmail] = useState("");

  return <input value={email} onChange={(e) => setEmail(e.target.value)} />;
}
```

#### 5. Hooks

```jsx
// Hooks let you use state and other React features
function Component() {
  // State hook
  const [count, setCount] = useState(0);

  // Effect hook
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  // Context hook
  const theme = useContext(ThemeContext);

  return <div>{count}</div>;
}
```

## Essential Hooks

### useState

```jsx
const [state, setState] = useState(initialValue);
```

### useEffect

```jsx
useEffect(() => {
  // Side effect code
  return () => {
    // Cleanup
  };
}, [dependencies]);
```

### useContext

```jsx
const value = useContext(MyContext);
```

### useReducer

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

### useCallback

```jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### useMemo

```jsx
const memoizedValue = useMemo(() => {
  return expensiveComputation(a, b);
}, [a, b]);
```

### useRef

```jsx
const ref = useRef(initialValue);
```

## Best Practices

### Component Design

1. **Keep Components Small and Focused** - Single responsibility principle
2. **Use Functional Components** - Prefer hooks over class components
3. **Extract Reusable Logic** - Create custom hooks
4. **Compose Components** - Build complex UIs from simple components
5. **Props Validation** - Use PropTypes or TypeScript

### State Management

1. **Local State First** - Use local state when possible
2. **Lift State Up** - Share state between siblings by lifting to parent
3. **Context for Global State** - Use Context API for theme, auth, etc.
4. **External Libraries** - Use Redux/Zustand for complex global state
5. **Server State Separately** - Use React Query for API data

### Performance

1. **Avoid Premature Optimization** - Profile before optimizing
2. **Memoization** - Use React.memo, useMemo, useCallback wisely
3. **Code Splitting** - Lazy load components and routes
4. **Virtualization** - For long lists
5. **Debounce and Throttle** - For expensive operations

### Code Organization

```
src/
├── components/          # Reusable components
│   ├── common/         # Shared components
│   ├── layout/         # Layout components
│   └── features/       # Feature-specific components
├── hooks/              # Custom hooks
├── context/            # Context providers
├── utils/              # Utility functions
├── services/           # API services
├── types/              # TypeScript types
├── styles/             # Global styles
└── pages/              # Page components
```

### Testing

1. **Test User Behavior** - Not implementation details
2. **Integration Tests** - Test component interactions
3. **Accessibility** - Test with screen readers
4. **Coverage** - Aim for meaningful coverage, not 100%
5. **Mock External Dependencies** - APIs, timers, etc.

## Common Patterns

### Conditional Rendering

```jsx
// Ternary operator
{
  isLoggedIn ? <Dashboard /> : <Login />;
}

// Logical AND
{
  error && <ErrorMessage />;
}

// Early return
if (!data) return <Loading />;
```

### List Rendering

```jsx
{
  items.map((item) => <Item key={item.id} data={item} />);
}
```

### Form Handling

```jsx
function Form() {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic
  };

  return <form onSubmit={handleSubmit}>{/* fields */}</form>;
}
```

### Data Fetching

```jsx
function Component() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{/* render data */}</div>;
}
```

## React Ecosystem

### State Management

- **Context API** - Built-in React
- **Redux** - Predictable state container
- **Zustand** - Simple and lightweight
- **Recoil** - Atomic state management
- **Jotai** - Primitive and flexible
- **MobX** - Reactive state management

### Data Fetching

- **React Query** - Powerful data fetching
- **SWR** - Data fetching with cache
- **Apollo Client** - GraphQL client
- **RTK Query** - Redux data fetching

### Routing

- **React Router** - Standard routing solution
- **TanStack Router** - Type-safe routing
- **Next.js** - File-based routing

### Forms

- **React Hook Form** - Performant forms
- **Formik** - Form management
- **React Final Form** - Subscription-based

### UI Libraries

- **Material-UI (MUI)** - Material Design
- **Ant Design** - Enterprise UI
- **Chakra UI** - Accessible components
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Re-usable components

### Testing

- **Jest** - JavaScript testing
- **React Testing Library** - Component testing
- **Vitest** - Fast unit testing
- **Cypress** - E2E testing
- **Playwright** - E2E testing

### Build Tools

- **Vite** - Fast dev server
- **Create React App** - Official starter
- **Next.js** - React framework
- **Remix** - Full stack framework

## Learning Path

### Beginner (0-3 months)

1. Learn JavaScript ES6+
2. Understand React basics (components, JSX, props, state)
3. Master useState and useEffect
4. Build simple projects (todo list, calculator)
5. Learn React Router basics

### Intermediate (3-6 months)

1. Master all React hooks
2. Learn Context API
3. Understand performance optimization
4. Learn form handling
5. Study common patterns (HOCs, render props)
6. Build medium-sized projects

### Advanced (6+ months)

1. Master Redux or modern state management
2. Learn TypeScript with React
3. Study advanced patterns and architecture
4. Learn testing strategies
5. Understand Next.js or other frameworks
6. Build production-ready applications

## Resources

### Official Documentation

- [React Documentation](https://react.dev/) - Official React docs
- [React Beta Docs](https://react.dev/learn) - New learning-focused docs
- [React GitHub](https://github.com/facebook/react) - Source code

### Learning Platforms

- [FreeCodeCamp](https://www.freecodecamp.org/) - Free interactive learning
- [Scrimba React Course](https://scrimba.com/learn/learnreact) - Interactive course
- [Epic React by Kent C. Dodds](https://epicreact.dev/) - Comprehensive course
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Blogs and Articles

- [Overreacted](https://overreacted.io/) - Dan Abramov's blog
- [Kent C. Dodds Blog](https://kentcdodds.com/blog) - React best practices
- [Robin Wieruch](https://www.robinwieruch.de/blog) - React tutorials
- [Josh Comeau](https://www.joshwcomeau.com/) - Modern React patterns

### YouTube Channels

- [Web Dev Simplified](https://www.youtube.com/@WebDevSimplified)
- [Codevolution](https://www.youtube.com/@Codevolution)
- [Jack Herrington](https://www.youtube.com/@jherr)
- [Theo - t3.gg](https://www.youtube.com/@t3dotgg)

### Communities

- [React Discord](https://discord.gg/react) - Official Discord server
- [Reactiflux](https://www.reactiflux.com/) - React community
- [Stack Overflow](https://stackoverflow.com/questions/tagged/reactjs) - Q&A
- [Reddit /r/reactjs](https://www.reddit.com/r/reactjs/) - Discussions

## Interview Preparation

Check out the [Interview Preparation](00-interview-preparation/) folder for:

- 150+ React interview questions with detailed answers
- Common coding challenges
- Best practices and patterns
- Performance optimization techniques
- Real-world problem-solving

## Project Ideas

### Beginner Projects

- Todo List with CRUD
- Weather App
- Calculator
- Quiz Application
- Recipe Finder

### Intermediate Projects

- E-commerce Product Catalog
- Blog with Markdown
- Movie Database App
- Chat Application
- Dashboard with Charts

### Advanced Projects

- Social Media Clone
- Real-time Collaboration Tool
- Video Streaming Platform
- Project Management Tool
- Full-stack Application

## Contributing

Feel free to contribute by:

- Adding more examples
- Improving explanations
- Fixing errors
- Adding new patterns

---

**Happy Coding with React! ⚛️**

Master the fundamentals, practice with real projects, and keep building!


