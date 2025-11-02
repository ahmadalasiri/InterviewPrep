# Next.js Interview Preparation Guide

This folder contains the most common Next.js interview questions organized by difficulty and topic. Use this resource to prepare for Next.js developer interviews at all levels.

## 📋 Table of Contents

### 1. [Basic Next.js Questions](01-basic-questions.md)

- Next.js fundamentals
- File-based routing
- Pages and layouts
- Rendering basics
- Image and font optimization

### 2. [Routing Questions](02-routing-questions.md)

- App Router vs Pages Router
- Dynamic routes
- Route groups and parallel routes
- Navigation and linking
- Middleware

### 3. [Advanced Concepts Questions](03-advanced-questions.md)

- Server Components vs Client Components
- Streaming and Suspense
- Data fetching strategies
- Caching and revalidation
- Edge Runtime

### 4. [Data Fetching Questions](04-data-fetching-questions.md)

- SSR, SSG, ISR, and CSR
- Server-side data fetching
- Client-side data fetching
- API routes and route handlers
- Server Actions

### 5. [Practical Coding Questions](05-practical-questions.md)

- Component implementations
- Real-world problem solving
- Code challenges and patterns
- Performance optimization
- Authentication patterns

## 🎯 Interview Preparation Strategy

### Before the Interview

1. **Master Next.js Fundamentals** - Routing, rendering, data fetching
2. **Understand Rendering Strategies** - SSR, SSG, ISR, CSR
3. **Know Server vs Client Components** - When to use each
4. **Study Data Fetching** - All methods and best practices
5. **Build Real Projects** - Have projects to discuss and showcase
6. **Learn Performance Optimization** - Images, fonts, caching
7. **Understand Deployment** - Vercel, Docker, edge functions

### During the Interview

1. **Think Full-Stack** - Next.js handles both frontend and backend
2. **Discuss Trade-offs** - SSR vs SSG vs ISR, when to use each
3. **Start Simple** - Build basic version, then add features
4. **Consider Edge Cases** - Loading states, errors, empty data
5. **Clean Code** - Proper naming, file organization, TypeScript
6. **Explain Decisions** - Why you chose specific rendering strategies

### Common Interview Formats

- **Concept Questions** - Next.js fundamentals and API knowledge
- **Coding Challenges** - Build pages or features live
- **Code Review** - Analyze and improve existing Next.js code
- **System Design** - Design application architecture
- **Debugging** - Find and fix issues in Next.js applications
- **Performance** - Identify and resolve performance bottlenecks

## 📚 Key Topics to Master

### Core Next.js Concepts

- [ ] File-based routing
- [ ] App Router vs Pages Router
- [ ] Pages and layouts
- [ ] Server Components vs Client Components
- [ ] Data fetching methods
- [ ] Rendering strategies (SSR, SSG, ISR, CSR)
- [ ] API routes and route handlers
- [ ] Middleware
- [ ] Image optimization
- [ ] Font optimization

### App Router (Next.js 13+)

- [ ] App directory structure
- [ ] Server Components (default)
- [ ] Client Components ('use client')
- [ ] Route handlers
- [ ] Server Actions
- [ ] Loading and error states
- [ ] Streaming and Suspense
- [ ] Parallel routes
- [ ] Intercepting routes
- [ ] Route groups

### Pages Router (Legacy)

- [ ] Pages directory structure
- [ ] getStaticProps
- [ ] getServerSideProps
- [ ] getStaticPaths
- [ ] API routes
- [ ] _app.js and _document.js
- [ ] Dynamic imports

### Data Fetching

- [ ] Server-side data fetching (async components)
- [ ] Client-side data fetching (useEffect, SWR, React Query)
- [ ] Static generation with fetch
- [ ] Incremental Static Regeneration
- [ ] Caching strategies
- [ ] Revalidation methods

### Optimization

- [ ] Image optimization (next/image)
- [ ] Font optimization (next/font)
- [ ] Script optimization (next/script)
- [ ] Metadata and SEO
- [ ] Bundle analysis
- [ ] Code splitting
- [ ] Core Web Vitals

### Authentication

- [ ] NextAuth.js integration
- [ ] Session management
- [ ] Protected routes
- [ ] API route protection
- [ ] JWT and OAuth

### Deployment

- [ ] Vercel deployment
- [ ] Environment variables
- [ ] Docker deployment
- [ ] Edge functions
- [ ] CI/CD pipelines

## 🚀 Quick Reference

### App Router Structure

```tsx
app/
├── layout.tsx          # Root layout
├── page.tsx            # Home page
├── loading.tsx         # Loading UI
├── error.tsx           # Error UI
├── not-found.tsx       # 404 page
├── blog/
│   ├── [slug]/
│   │   └── page.tsx    # Dynamic route
│   └── page.tsx
└── api/
    └── users/
        └── route.ts    # API route
```

### Server Component (Default)

```tsx
// app/page.tsx
async function getData() {
  const res = await fetch("https://api.example.com/data", {
    cache: "force-cache", // SSG
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data.title}</div>;
}
```

### Client Component

```tsx
// components/counter.tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

### Data Fetching Patterns

```tsx
// Static Site Generation (SSG)
fetch(url, { cache: "force-cache" });

// Server-Side Rendering (SSR)
fetch(url, { cache: "no-store" });

// Incremental Static Regeneration (ISR)
fetch(url, { next: { revalidate: 60 } });
```

### Route Handler (API)

```tsx
// app/api/users/route.ts
export async function GET(request: Request) {
  const users = await getUsers();
  return Response.json(users);
}

export async function POST(request: Request) {
  const data = await request.json();
  const user = await createUser(data);
  return Response.json(user, { status: 201 });
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
  };
}
```

### Image Optimization

```tsx
import Image from "next/image";

<Image
  src="/photo.jpg"
  alt="Photo"
  width={500}
  height={300}
  priority
  placeholder="blur"
/>;
```

## 📖 Additional Resources

- [Next.js Official Documentation](https://nextjs.org/docs)
- [Next.js Learn Course](https://nextjs.org/learn)
- [Vercel Blog](https://vercel.com/blog)
- [Lee Robinson's Blog](https://leerob.io/)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [Next.js Discord](https://nextjs.org/discord)

## 💡 Pro Tips

1. **Master App Router** - It's the future of Next.js
2. **Understand Server Components** - They're the default in App Router
3. **Learn Rendering Strategies** - Know when to use SSR vs SSG vs ISR
4. **Build Projects** - Nothing beats real-world experience
5. **TypeScript** - Use TypeScript for better development experience
6. **Performance** - Always optimize images and fonts
7. **Stay Updated** - Next.js evolves quickly, follow updates
8. **Read Documentation** - The official docs are excellent

## 🔥 Common Interview Gotchas

1. **Server vs Client Components** - Understanding when to use 'use client'
2. **Data Fetching Methods** - Knowing which method to use when
3. **Caching Strategies** - Understanding cache behavior
4. **Hydration Errors** - Server/client mismatch issues
5. **Dynamic Routes** - generateStaticParams for SSG
6. **Metadata** - SEO optimization
7. **Image Optimization** - Using next/image properly
8. **Route Handlers vs API Routes** - App Router vs Pages Router
9. **Middleware** - When and how to use it
10. **Environment Variables** - NEXT_PUBLIC_ prefix for client

## 🎓 Sample Interview Questions Overview

### Junior Level (0-2 years)

- What is Next.js and why use it over Create React App?
- Explain file-based routing in Next.js
- What is the difference between SSR and SSG?
- How do you create a dynamic route?
- What is the purpose of next/image?
- How do you fetch data in Next.js?
- What is the App Router?
- Explain layouts in Next.js

### Mid Level (2-5 years)

- Explain the difference between Server and Client Components
- What is Incremental Static Regeneration (ISR)?
- How does caching work in Next.js?
- Explain middleware in Next.js
- How do you optimize performance in Next.js?
- What are route handlers?
- Explain streaming and Suspense
- How do you implement authentication in Next.js?

### Senior Level (5+ years)

- Design a scalable Next.js application architecture
- Compare rendering strategies and when to use each
- Explain the Next.js compilation and rendering process
- How would you implement a multi-tenant SaaS with Next.js?
- Explain edge runtime vs Node.js runtime
- Advanced caching and revalidation strategies
- Micro-frontends with Next.js
- Performance optimization at scale

## 📝 Coding Challenge Categories

### Routing & Navigation

- Build dynamic routes with parameters
- Implement nested layouts
- Create parallel routes
- Set up protected routes

### Data Fetching

- Implement SSG, SSR, and ISR
- Create API routes
- Handle loading and error states
- Implement server actions

### Components

- Build reusable Server Components
- Create Client Components with state
- Implement forms with Server Actions
- Build authentication flow

### Performance

- Optimize images and fonts
- Implement code splitting
- Set up proper caching
- Improve Core Web Vitals

### Full-Stack

- Build REST API with route handlers
- Implement database integration
- Create authentication system
- Build real-time features

---

**Good luck with your Next.js interview! 🚀**

Remember: Focus on understanding Next.js core concepts deeply, practice building real applications, and always think about performance and user experience.

