# Next.js - Complete Learning Guide

This repository contains a comprehensive guide to learning Next.js with practical examples and explanations.

## Table of Contents

### 0. Interview Preparation

**[00-interview-preparation/](00-interview-preparation/)** - Complete interview prep guide

- [Basic Questions](00-interview-preparation/01-basic-questions.md) - Next.js fundamentals, routing, rendering
- [Routing Questions](00-interview-preparation/02-routing-questions.md) - App Router, Pages Router, navigation
- [Advanced Questions](00-interview-preparation/03-advanced-questions.md) - Server Components, streaming, middleware
- [Data Fetching Questions](00-interview-preparation/04-data-fetching-questions.md) - SSR, SSG, ISR, RSC
- [Practical Questions](00-interview-preparation/05-practical-questions.md) - Real coding challenges

### 1. Fundamentals

- **01-basics/** - Next.js fundamentals
  - Project structure
  - File-based routing
  - Pages and layouts
  - Navigation and linking
  - Image and font optimization

### 2. Routing

- **02-routing/** - Next.js routing systems
  - App Router (Next.js 13+)
  - Pages Router (legacy)
  - Dynamic routes
  - Route groups
  - Parallel routes
  - Intercepting routes

### 3. Rendering

- **03-rendering/** - Rendering strategies
  - Server-Side Rendering (SSR)
  - Static Site Generation (SSG)
  - Incremental Static Regeneration (ISR)
  - Client-Side Rendering (CSR)
  - Server Components vs Client Components

### 4. Data Fetching

- **04-data-fetching/** - Data fetching patterns
  - Server-side data fetching
  - Client-side data fetching
  - Streaming and Suspense
  - Caching strategies
  - Revalidation

### 5. API Routes

- **05-api-routes/** - Building APIs
  - Route handlers
  - API routes (Pages Router)
  - Middleware
  - Authentication
  - Database integration

### 6. Styling

- **06-styling/** - Styling solutions
  - CSS Modules
  - Tailwind CSS
  - Global styles
  - CSS-in-JS
  - Sass support

### 7. Optimization

- **07-optimization/** - Performance optimization
  - Image optimization
  - Font optimization
  - Script optimization
  - Metadata and SEO
  - Bundle analysis
  - Core Web Vitals

### 8. Authentication

- **08-authentication/** - Auth strategies
  - NextAuth.js
  - Session management
  - Protected routes
  - API route protection
  - OAuth providers

### 9. Deployment

- **09-deployment/** - Deployment strategies
  - Vercel deployment
  - Docker deployment
  - Environment variables
  - CI/CD pipelines
  - Edge functions

### 10. Real-World Projects

- **10-projects/** - Complete project examples
  - Blog with MDX
  - E-commerce store
  - Dashboard application
  - Multi-tenant SaaS

## Getting Started

### Prerequisites

- Node.js (v18.17 or higher)
- npm, yarn, pnpm, or bun
- React knowledge
- Understanding of ES6+ features

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to Next folder
cd Next

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## Core Next.js Concepts

### Why Next.js?

1. **Full-Stack Framework** - Build both frontend and backend
2. **File-Based Routing** - Intuitive routing based on file structure
3. **Multiple Rendering Modes** - SSR, SSG, ISR, and CSR in one framework
4. **Server Components** - Reduce JavaScript bundle size
5. **Built-in Optimization** - Images, fonts, scripts optimized automatically
6. **Edge Runtime** - Deploy to the edge for low latency
7. **Great Developer Experience** - Fast Refresh, TypeScript support, and more

### Next.js Philosophy

- **Performance by Default** - Optimizations built-in
- **Flexibility** - Choose rendering strategy per page
- **Progressive Enhancement** - Works without JavaScript
- **Developer Experience** - Fast iteration and debugging
- **Production Ready** - Built for scale

### Key Concepts to Master

#### 1. App Router (Next.js 13+)

```tsx
// app/page.tsx - Server Component by default
export default function Page() {
  return <h1>Home Page</h1>;
}

// app/layout.tsx - Root layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

#### 2. Server Components

```tsx
// Server Component (default in App Router)
async function ServerComponent() {
  const data = await fetch("https://api.example.com/data");
  const json = await data.json();

  return <div>{json.title}</div>;
}

// Client Component (with 'use client')
"use client";

function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

#### 3. Dynamic Routes

```tsx
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>;
}

// Generate static params
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

#### 4. Data Fetching

```tsx
// Server-side data fetching
async function getData() {
  const res = await fetch("https://api.example.com/data", {
    cache: "force-cache", // SSG
    // cache: 'no-store', // SSR
    // next: { revalidate: 60 } // ISR
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data.title}</div>;
}
```

#### 5. API Routes

```tsx
// app/api/hello/route.ts
export async function GET(request: Request) {
  return Response.json({ message: "Hello, Next.js!" });
}

export async function POST(request: Request) {
  const data = await request.json();
  return Response.json({ success: true, data });
}
```

## Essential Features

### Image Optimization

```tsx
import Image from "next/image";

<Image
  src="/photo.jpg"
  alt="Photo"
  width={500}
  height={300}
  priority // Load eagerly
  placeholder="blur" // Blur while loading
/>;
```

### Font Optimization

```tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

### Metadata

```tsx
// Static metadata
export const metadata = {
  title: "My Page",
  description: "Page description",
};

// Dynamic metadata
export async function generateMetadata({ params }) {
  const post = await getPost(params.id);
  return {
    title: post.title,
    description: post.excerpt,
  };
}
```

### Middleware

```tsx
// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request: Request) {
  // Auth check
  const token = request.cookies.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

## Rendering Strategies

### Static Site Generation (SSG)

```tsx
// Default with fetch cache: 'force-cache'
async function getData() {
  const res = await fetch("https://api.example.com/data", {
    cache: "force-cache",
  });
  return res.json();
}
```

### Server-Side Rendering (SSR)

```tsx
// Use cache: 'no-store'
async function getData() {
  const res = await fetch("https://api.example.com/data", {
    cache: "no-store",
  });
  return res.json();
}
```

### Incremental Static Regeneration (ISR)

```tsx
// Revalidate every 60 seconds
async function getData() {
  const res = await fetch("https://api.example.com/data", {
    next: { revalidate: 60 },
  });
  return res.json();
}
```

### Client-Side Rendering (CSR)

```tsx
"use client";

import { useState, useEffect } from "react";

export default function ClientPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return <div>{data?.title}</div>;
}
```

## Best Practices

### Routing

1. **Use App Router** - Modern approach with better features
2. **Organize by Features** - Group related routes together
3. **Use Route Groups** - Organize without affecting URL structure
4. **Parallel Routes** - Show multiple pages in the same layout
5. **Loading States** - Use loading.tsx for better UX

### Performance

1. **Server Components** - Default to server components
2. **Image Optimization** - Always use next/image
3. **Font Optimization** - Use next/font
4. **Code Splitting** - Automatic with dynamic imports
5. **Caching Strategy** - Choose appropriate cache settings
6. **Edge Functions** - Use for low-latency endpoints

### Data Fetching

1. **Fetch in Server Components** - Reduce client bundle
2. **Parallel Data Fetching** - Fetch data in parallel
3. **Streaming** - Use Suspense for progressive rendering
4. **Revalidation** - Set appropriate revalidation times
5. **Error Handling** - Use error.tsx for error boundaries

### Code Organization

```
app/
├── (marketing)/          # Route group
│   ├── page.tsx         # Home page
│   ├── about/           # About page
│   └── layout.tsx       # Marketing layout
├── (dashboard)/         # Route group
│   ├── dashboard/       # Dashboard routes
│   └── layout.tsx       # Dashboard layout
├── api/                 # API routes
│   └── users/
│       └── route.ts
├── layout.tsx           # Root layout
├── loading.tsx          # Global loading
└── error.tsx            # Global error

components/              # Reusable components
├── ui/                 # UI components
├── forms/              # Form components
└── layouts/            # Layout components

lib/                    # Utility functions
├── db.ts              # Database utilities
├── auth.ts            # Auth utilities
└── utils.ts           # General utilities
```

## Common Patterns

### Loading States

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

### Error Handling

```tsx
// app/dashboard/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Streaming with Suspense

```tsx
import { Suspense } from "react";

export default function Page() {
  return (
    <div>
      <h1>My Page</h1>
      <Suspense fallback={<div>Loading posts...</div>}>
        <Posts />
      </Suspense>
    </div>
  );
}
```

## Next.js Ecosystem

### Essential Libraries

- **NextAuth.js** - Authentication
- **Prisma** - Database ORM
- **Drizzle** - TypeScript ORM
- **tRPC** - End-to-end typesafe APIs
- **Zod** - Schema validation
- **React Hook Form** - Form management
- **TanStack Query** - Data fetching
- **Zustand** - State management

### UI Libraries

- **shadcn/ui** - Re-usable components
- **Radix UI** - Unstyled components
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations

### Deployment Platforms

- **Vercel** - Optimal for Next.js
- **Netlify** - JAMstack platform
- **Railway** - Full-stack platform
- **AWS** - Amazon cloud
- **Docker** - Containerization

## Learning Path

### Beginner (0-3 months)

1. Learn React fundamentals
2. Understand Next.js basics and file-based routing
3. Master Pages Router or App Router
4. Build simple pages with SSG
5. Learn Image and Font optimization

### Intermediate (3-6 months)

1. Master all rendering strategies (SSR, SSG, ISR)
2. Learn API routes and server actions
3. Understand Server vs Client Components
4. Study authentication patterns
5. Build medium-sized projects

### Advanced (6+ months)

1. Master streaming and Suspense
2. Learn advanced caching strategies
3. Study middleware and edge functions
4. Understand performance optimization
5. Build production-ready applications
6. Deploy to various platforms

## Resources

### Official Documentation

- [Next.js Documentation](https://nextjs.org/docs) - Official docs
- [Next.js Learn](https://nextjs.org/learn) - Interactive tutorial
- [Next.js Blog](https://nextjs.org/blog) - Updates and announcements
- [Next.js GitHub](https://github.com/vercel/next.js) - Source code

### Learning Platforms

- [Next.js Learn Course](https://nextjs.org/learn) - Official interactive course
- [Mastering Next.js](https://masteringnextjs.com/) - Lee Robinson's course
- [Next.js 14 Tutorial](https://youtube.com/@leerob) - Video tutorials

### Blogs and Articles

- [Vercel Blog](https://vercel.com/blog) - Next.js updates
- [Lee Robinson's Blog](https://leerob.io/) - Next.js VP
- [Next.js Weekly](https://nextjsweekly.com/) - Newsletter
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples) - Official examples

### YouTube Channels

- [Lee Robinson](https://www.youtube.com/@leerob) - VP of Next.js
- [Theo - t3.gg](https://www.youtube.com/@t3dotgg) - Next.js expert
- [Jack Herrington](https://www.youtube.com/@jherr) - Advanced patterns
- [Web Dev Simplified](https://www.youtube.com/@WebDevSimplified) - Tutorials

### Communities

- [Next.js Discord](https://nextjs.org/discord) - Official Discord
- [Vercel Community](https://github.com/vercel/next.js/discussions) - GitHub Discussions
- [Stack Overflow](https://stackoverflow.com/questions/tagged/next.js) - Q&A
- [Reddit /r/nextjs](https://www.reddit.com/r/nextjs/) - Discussions

## Interview Preparation

Check out the [Interview Preparation](00-interview-preparation/) folder for:

- 150+ Next.js interview questions with detailed answers
- Common coding challenges
- Best practices and patterns
- Performance optimization techniques
- Real-world problem-solving

## Project Ideas

### Beginner Projects

- Personal Blog with MDX
- Portfolio Website
- Landing Page
- Documentation Site
- Image Gallery

### Intermediate Projects

- E-commerce Store
- Multi-page Marketing Site
- Blog with CMS Integration
- Dashboard Application
- API with Database

### Advanced Projects

- Multi-tenant SaaS
- Social Media Platform
- Real-time Chat Application
- Video Streaming Platform
- Full-stack Marketplace

## Contributing

Feel free to contribute by:

- Adding more examples
- Improving explanations
- Fixing errors
- Adding new patterns

---

**Happy Coding with Next.js! ▲**

Master the fundamentals, practice with real projects, and keep building!

