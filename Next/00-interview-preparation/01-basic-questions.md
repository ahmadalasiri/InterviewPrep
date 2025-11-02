# Basic Next.js Interview Questions

## Table of Contents

- [What is Next.js?](#what-is-nextjs)
- [Routing Fundamentals](#routing-fundamentals)
- [Rendering Methods](#rendering-methods)
- [Pages and Layouts](#pages-and-layouts)
- [Optimization Features](#optimization-features)

---

## What is Next.js?

### Q1: What is Next.js and why would you use it over Create React App?

**Answer:**
Next.js is a React framework for building full-stack web applications. It provides additional structure, features, and optimizations that are not available in plain React.

**Key Features:**

- **File-Based Routing**: Automatic routing based on file structure
- **Multiple Rendering Modes**: SSR, SSG, ISR, and CSR in one framework
- **Server Components**: Reduce JavaScript bundle size
- **API Routes**: Build backend API endpoints
- **Built-in Optimization**: Images, fonts, and scripts optimized automatically
- **TypeScript Support**: First-class TypeScript support
- **Fast Refresh**: Instant feedback during development

**Why Use Next.js over CRA:**

1. **SEO-Friendly** - Server-side rendering improves SEO
2. **Performance** - Better initial page load with SSR/SSG
3. **Full-Stack** - API routes allow backend development
4. **File-Based Routing** - No need for react-router
5. **Built-in Optimizations** - Image optimization, code splitting, etc.
6. **Production Ready** - Optimized for production out of the box
7. **Flexible Rendering** - Choose rendering method per page

**Example:**

```tsx
// app/page.tsx - Simple Next.js page
export default function Home() {
  return <h1>Hello, Next.js!</h1>;
}

// No router setup needed!
```

---

### Q2: What is the difference between the App Router and Pages Router?

**Answer:**
Next.js has two routing systems: the newer App Router (Next.js 13+) and the legacy Pages Router.

**App Router (app/ directory):**

- **Server Components by default** - Reduces client bundle size
- **Layouts** - Shared UI between routes
- **Streaming** - Progressive rendering with Suspense
- **Server Actions** - Call server functions from client
- **Improved data fetching** - Async components
- **Route groups** - Organize routes without affecting URL

**Pages Router (pages/ directory):**

- **Client Components by default** - Traditional React behavior
- **getStaticProps/getServerSideProps** - Data fetching methods
- **_app.js** - Custom App component
- **API routes in pages/api/** - Backend endpoints

**Comparison:**

```tsx
// App Router (app/page.tsx)
export default async function Page() {
  const data = await fetch("https://api.example.com/data");
  return <div>{data.title}</div>;
}

// Pages Router (pages/index.js)
export async function getServerSideProps() {
  const res = await fetch("https://api.example.com/data");
  const data = await res.json();
  return { props: { data } };
}

export default function Page({ data }) {
  return <div>{data.title}</div>;
}
```

**Recommendation:** Use App Router for new projects. It's the future of Next.js.

---

### Q3: What is file-based routing in Next.js?

**Answer:**
File-based routing means that the file structure in your `app/` or `pages/` directory automatically determines your application's routes.

**App Router Examples:**

```
app/
├── page.tsx                    → /
├── about/
│   └── page.tsx               → /about
├── blog/
│   ├── page.tsx               → /blog
│   └── [slug]/
│       └── page.tsx           → /blog/:slug
└── dashboard/
    ├── layout.tsx             → Layout for /dashboard/*
    ├── page.tsx               → /dashboard
    └── settings/
        └── page.tsx           → /dashboard/settings
```

**Key Points:**

- **page.tsx** - Defines a route's UI
- **layout.tsx** - Shared UI for a segment and its children
- **loading.tsx** - Loading UI for a segment
- **error.tsx** - Error UI for a segment
- **[param]** - Dynamic route segment
- **[...slug]** - Catch-all route segment

**Example:**

```tsx
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Blog Post: {params.slug}</h1>;
}

// Accessible at /blog/hello-world, /blog/my-post, etc.
```

---

## Rendering Methods

### Q4: What are the different rendering methods in Next.js?

**Answer:**
Next.js supports four main rendering methods, each with different use cases:

**1. Static Site Generation (SSG)**

- Pages are generated at build time
- Best for content that doesn't change often
- Fastest performance

```tsx
// Default with fetch cache: 'force-cache'
async function getData() {
  const res = await fetch("https://api.example.com/data", {
    cache: "force-cache",
  });
  return res.json();
}
```

**2. Server-Side Rendering (SSR)**

- Pages are generated on each request
- Best for dynamic, personalized content
- Always fresh data

```tsx
// Use cache: 'no-store'
async function getData() {
  const res = await fetch("https://api.example.com/data", {
    cache: "no-store",
  });
  return res.json();
}
```

**3. Incremental Static Regeneration (ISR)**

- Pages are statically generated but revalidated periodically
- Balance between SSG and SSR
- Best for content that updates occasionally

```tsx
// Revalidate every 60 seconds
async function getData() {
  const res = await fetch("https://api.example.com/data", {
    next: { revalidate: 60 },
  });
  return res.json();
}
```

**4. Client-Side Rendering (CSR)**

- Pages are rendered in the browser
- Best for highly interactive content
- Use 'use client' directive

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

**Choosing the Right Method:**

- **SSG**: Blog posts, documentation, landing pages
- **SSR**: User dashboards, personalized content
- **ISR**: E-commerce product pages, news articles
- **CSR**: Interactive dashboards, real-time data

---

### Q5: What is the difference between Server Components and Client Components?

**Answer:**
Next.js 13+ introduced React Server Components, which are components that render on the server.

**Server Components (Default in App Router):**

- **Render on the server** - No JavaScript sent to client
- **Access backend resources** - Direct database access
- **Better performance** - Smaller bundle size
- **Better security** - Keep sensitive data on server
- **Cannot use** - useState, useEffect, browser APIs

```tsx
// Server Component (default)
async function ServerComponent() {
  const data = await fetch("https://api.example.com/data");
  const json = await data.json();

  return <div>{json.title}</div>;
}
```

**Client Components (with 'use client'):**

- **Render on the client** - JavaScript sent to browser
- **Interactive** - Can use hooks and event handlers
- **Access browser APIs** - localStorage, window, etc.
- **Must use** - For interactivity, hooks, browser APIs

```tsx
// Client Component
"use client";

import { useState } from "react";

export default function ClientComponent() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

**Composition Pattern:**

```tsx
// Server Component (default)
import ClientComponent from "./ClientComponent";

export default async function Page() {
  const data = await getData(); // Server-side

  return (
    <div>
      <h1>{data.title}</h1>
      <ClientComponent /> {/* Client-side interactivity */}
    </div>
  );
}
```

**Best Practice:** Use Server Components by default, and only use Client Components when you need interactivity.

---

## Pages and Layouts

### Q6: What are layouts in Next.js and how do they work?

**Answer:**
Layouts are UI that is shared between multiple pages. They preserve state and don't re-render when navigating between pages.

**Root Layout (Required):**

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>My App Header</header>
        {children}
        <footer>My App Footer</footer>
      </body>
    </html>
  );
}
```

**Nested Layouts:**

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <aside>Dashboard Sidebar</aside>
      <main>{children}</main>
    </div>
  );
}

// app/dashboard/page.tsx
export default function DashboardPage() {
  return <h1>Dashboard</h1>;
  // Will be wrapped in both RootLayout and DashboardLayout
}
```

**Layout Features:**

- **Persistent** - Don't re-render on navigation
- **Nested** - Layouts can be nested
- **Server Components** - Layouts are Server Components by default
- **Data Fetching** - Can fetch data in layouts

---

### Q7: How do you create dynamic routes in Next.js?

**Answer:**
Dynamic routes use brackets `[]` in the file/folder name to create route parameters.

**Single Dynamic Segment:**

```tsx
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Blog Post: {params.slug}</h1>;
}

// Matches: /blog/hello, /blog/world, /blog/anything
```

**Multiple Dynamic Segments:**

```tsx
// app/blog/[category]/[slug]/page.tsx
export default function Post({
  params,
}: {
  params: { category: string; slug: string };
}) {
  return (
    <div>
      <p>Category: {params.category}</p>
      <p>Slug: {params.slug}</p>
    </div>
  );
}

// Matches: /blog/tech/nextjs, /blog/design/colors
```

**Catch-All Routes:**

```tsx
// app/docs/[...slug]/page.tsx
export default function Docs({ params }: { params: { slug: string[] } }) {
  return <h1>Docs: {params.slug.join("/")}</h1>;
}

// Matches: /docs/a, /docs/a/b, /docs/a/b/c
```

**Optional Catch-All Routes:**

```tsx
// app/docs/[[...slug]]/page.tsx
export default function Docs({ params }: { params: { slug?: string[] } }) {
  return <h1>Docs: {params.slug?.join("/") || "Home"}</h1>;
}

// Matches: /docs, /docs/a, /docs/a/b, /docs/a/b/c
```

**Generate Static Params (for SSG):**

```tsx
export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function Page({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>;
}
```

---

## Optimization Features

### Q8: How does Next.js optimize images?

**Answer:**
Next.js provides the `<Image>` component that automatically optimizes images for better performance.

**Features:**

- **Automatic lazy loading** - Images load when entering viewport
- **Responsive images** - Serves appropriate size for device
- **Modern formats** - Converts to WebP/AVIF when supported
- **Blur placeholder** - Shows blur while loading
- **Priority loading** - For above-the-fold images

**Basic Usage:**

```tsx
import Image from "next/image";

export default function Page() {
  return (
    <Image
      src="/photo.jpg"
      alt="Photo"
      width={500}
      height={300}
    />
  );
}
```

**Advanced Usage:**

```tsx
import Image from "next/image";

export default function Page() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      priority // Load immediately (above the fold)
      placeholder="blur" // Show blur while loading
      blurDataURL="data:image/jpeg;base64,..." // Custom blur
      quality={90} // Image quality (default 75)
      fill // Fill parent container
      sizes="(max-width: 768px) 100vw, 50vw" // Responsive sizes
    />
  );
}
```

**Remote Images:**

```tsx
// next.config.js
module.exports = {
  images: {
    domains: ["example.com"],
    // Or use remotePatterns (more secure)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/images/**",
      },
    ],
  },
};
```

**Benefits:**

- **Smaller file sizes** - Up to 70% smaller
- **Faster page loads** - Lazy loading by default
- **Better Core Web Vitals** - Improves LCP, CLS
- **Automatic format selection** - WebP, AVIF when supported

---

### Q9: How does Next.js optimize fonts?

**Answer:**
Next.js provides `next/font` to automatically optimize and load fonts.

**Google Fonts:**

```tsx
// app/layout.tsx
import { Inter, Roboto_Mono } from "next/font/google";

// Primary font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// Code font
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**Local Fonts:**

```tsx
import localFont from "next/font/local";

const myFont = localFont({
  src: "./fonts/my-font.woff2",
  display: "swap",
  variable: "--font-custom",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={myFont.variable}>
      <body>{children}</body>
    </html>
  );
}
```

**Benefits:**

- **Zero layout shift** - Font metrics calculated at build time
- **No external requests** - Fonts are self-hosted automatically
- **Automatic subset** - Only loads required characters
- **Preloaded** - Fonts are preloaded for better performance

**Using Font Variables:**

```css
/* globals.css */
h1 {
  font-family: var(--font-custom);
}

code {
  font-family: var(--font-mono);
}
```

---

### Q10: What is the purpose of metadata in Next.js?

**Answer:**
Metadata in Next.js controls SEO-related information like title, description, Open Graph tags, etc.

**Static Metadata:**

```tsx
// app/page.tsx
export const metadata = {
  title: "My App",
  description: "This is my awesome app",
  keywords: ["nextjs", "react", "web"],
  authors: [{ name: "John Doe" }],
  openGraph: {
    title: "My App",
    description: "This is my awesome app",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "My App",
    description: "This is my awesome app",
    images: ["/twitter-image.jpg"],
  },
};

export default function Page() {
  return <h1>Home</h1>;
}
```

**Dynamic Metadata:**

```tsx
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default function Page({ params }) {
  return <article>...</article>;
}
```

**Metadata Merging:**

```tsx
// app/layout.tsx (Root)
export const metadata = {
  title: {
    default: "My App",
    template: "%s | My App", // Page title | My App
  },
};

// app/about/page.tsx
export const metadata = {
  title: "About", // Becomes "About | My App"
};
```

**Benefits:**

- **SEO optimization** - Better search engine rankings
- **Social sharing** - Rich previews on social media
- **Type-safe** - TypeScript support for metadata
- **Automatic generation** - Generates meta tags automatically

---

### Q11: How does navigation work in Next.js?

**Answer:**
Next.js provides the `<Link>` component and `useRouter` hook for navigation.

**Link Component:**

```tsx
import Link from "next/link";

export default function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/blog/post-1">Blog Post</Link>

      {/* With dynamic content */}
      <Link href={`/blog/${post.slug}`}>{post.title}</Link>

      {/* Prefetch disabled */}
      <Link href="/contact" prefetch={false}>
        Contact
      </Link>
    </nav>
  );
}
```

**Programmatic Navigation:**

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        router.push("/dashboard");
        // router.replace('/dashboard') // No history entry
        // router.back() // Go back
        // router.forward() // Go forward
        // router.refresh() // Refresh page
      }}
    >
      Go to Dashboard
    </button>
  );
}
```

**Scroll Behavior:**

```tsx
// Disable scroll to top on navigation
<Link href="/about" scroll={false}>
  About
</Link>

// Programmatic scroll control
router.push("/about", { scroll: false });
```

**Features:**

- **Automatic code splitting** - Each route loads only needed code
- **Prefetching** - Links are prefetched in viewport
- **Client-side navigation** - No full page reload
- **Scroll restoration** - Maintains scroll position

---

### Q12: What are loading states in Next.js?

**Answer:**
Next.js provides `loading.tsx` files to show loading UI while a route segment loads.

**Basic Loading State:**

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <div>Loading dashboard...</div>;
}

// app/dashboard/page.tsx
export default async function Dashboard() {
  const data = await fetchData(); // This causes loading state
  return <div>{data.title}</div>;
}
```

**Streaming with Suspense:**

```tsx
// app/dashboard/page.tsx
import { Suspense } from "react";
import { Posts, Weather } from "./components";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <Suspense fallback={<div>Loading posts...</div>}>
        <Posts />
      </Suspense>

      <Suspense fallback={<div>Loading weather...</div>}>
        <Weather />
      </Suspense>
    </div>
  );
}
```

**Benefits:**

- **Instant loading UI** - Shows immediately
- **Automatic** - Works with Server Components
- **Progressive rendering** - Stream content as it loads
- **Better UX** - Users see feedback immediately

---

### Q13: How does error handling work in Next.js?

**Answer:**
Next.js provides `error.tsx` files to handle errors in route segments.

**Error Boundary:**

```tsx
// app/dashboard/error.tsx
"use client"; // Error components must be Client Components

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

**Global Error Boundary:**

```tsx
// app/global-error.tsx
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Global error occurred!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

**Not Found Page:**

```tsx
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <p>Could not find requested resource</p>
    </div>
  );
}

// Trigger manually
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  return <div>{post.title}</div>;
}
```

**Benefits:**

- **Graceful degradation** - Errors don't crash entire app
- **User feedback** - Show meaningful error messages
- **Recovery options** - Allow users to retry
- **Isolated** - Errors are isolated to route segments

---

### Q14: What are route groups in Next.js?

**Answer:**
Route groups allow you to organize routes without affecting the URL structure. Create them by wrapping folder names in parentheses.

**Example:**

```
app/
├── (marketing)/
│   ├── about/
│   │   └── page.tsx      → /about
│   ├── contact/
│   │   └── page.tsx      → /contact
│   └── layout.tsx        → Marketing layout
├── (dashboard)/
│   ├── settings/
│   │   └── page.tsx      → /settings
│   ├── profile/
│   │   └── page.tsx      → /profile
│   └── layout.tsx        → Dashboard layout
└── layout.tsx            → Root layout
```

**Use Cases:**

```tsx
// app/(marketing)/layout.tsx
export default function MarketingLayout({ children }) {
  return (
    <div>
      <nav>Marketing Nav</nav>
      {children}
    </div>
  );
}

// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <div>
      <nav>Dashboard Nav</nav>
      {children}
    </div>
  );
}
```

**Benefits:**

- **Organization** - Group related routes
- **Multiple layouts** - Different layouts for different sections
- **No URL impact** - Parentheses don't appear in URL
- **Separation of concerns** - Clear project structure

---

### Q15: What is the difference between `redirect` and `notFound` in Next.js?

**Answer:**
Both are server-side navigation functions but serve different purposes.

**redirect():**

```tsx
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect("/login"); // Redirect to login
  }

  return <div>Protected content</div>;
}

// Can also use in Server Actions
async function handleSubmit(formData) {
  "use server";

  const result = await createPost(formData);
  redirect(`/posts/${result.id}`);
}
```

**notFound():**

```tsx
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const post = await getPost(params.id);

  if (!post) {
    notFound(); // Shows nearest not-found.tsx
  }

  return <div>{post.title}</div>;
}

// app/not-found.tsx
export default function NotFound() {
  return <h1>404 - Not Found</h1>;
}
```

**Key Differences:**

| Feature       | redirect()                | notFound()               |
| ------------- | ------------------------- | ------------------------ |
| Purpose       | Navigate to another page  | Show 404 error           |
| Status Code   | 307 (Temporary) or 308    | 404 (Not Found)          |
| Fallback File | N/A                       | not-found.tsx            |
| Use Case      | Auth, form submissions    | Missing resources        |

---

## Summary

**Key Takeaways:**

1. **Next.js is a React framework** - Provides structure and features beyond React
2. **App Router is the future** - Use it for new projects
3. **File-based routing** - File structure determines routes
4. **Multiple rendering methods** - SSG, SSR, ISR, CSR
5. **Server Components** - Default in App Router, reduce bundle size
6. **Built-in optimization** - Images, fonts, scripts
7. **Layouts** - Shared UI that persists
8. **Metadata** - SEO and social sharing
9. **Error handling** - Graceful error boundaries
10. **Loading states** - Better user experience

**Interview Tips:**

- Understand the difference between App Router and Pages Router
- Know when to use each rendering method
- Explain Server vs Client Components clearly
- Be familiar with optimization features
- Practice creating dynamic routes
- Understand layout composition

---

**Next:** [Routing Questions](02-routing-questions.md)

