# Next.js Advanced Interview Questions

## Table of Contents

- [Server Components vs Client Components](#server-components-vs-client-components)
- [Streaming and Suspense](#streaming-and-suspense)
- [Caching and Revalidation](#caching-and-revalidation)
- [Performance Optimization](#performance-optimization)
- [Edge Runtime](#edge-runtime)

---

## Server Components vs Client Components

### Q1: Explain Server Components in detail and when to use them

**Answer:**
React Server Components (RSC) are components that render on the server and send HTML to the client, reducing JavaScript bundle size.

**Server Component (Default in App Router):**

```tsx
// app/posts/page.tsx (Server Component by default)
async function getPosts() {
  const res = await fetch("https://api.example.com/posts");
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

**Benefits of Server Components:**

1. **Reduced Bundle Size** - No JavaScript sent to client
2. **Direct Backend Access** - Database queries, file system
3. **Security** - Keep API keys and secrets on server
4. **Improved Performance** - Less client-side processing
5. **SEO-Friendly** - Fully rendered HTML

**What You CAN do in Server Components:**

- Fetch data with async/await
- Access backend resources directly
- Use Node.js libraries
- Read environment variables
- Access databases
- Read files from filesystem

```tsx
// Server Component with database access
import { db } from "@/lib/database";

export default async function UsersPage() {
  const users = await db.user.findMany();

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**What You CANNOT do in Server Components:**

- Use useState, useEffect, or other hooks
- Use event listeners (onClick, onChange, etc.)
- Use browser APIs (localStorage, window, etc.)
- Use Context API

**When to Use Server Components:**

- Data fetching
- Backend resource access
- Large dependencies
- SEO-critical content
- Static content

---

### Q2: When and how do you use Client Components?

**Answer:**
Client Components are components that run in the browser and can use interactivity, hooks, and browser APIs.

**Creating a Client Component:**

```tsx
// components/Counter.tsx
"use client"; // This directive makes it a Client Component

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

**When to Use Client Components:**

1. **Interactivity** - onClick, onChange, etc.
2. **State** - useState, useReducer
3. **Effects** - useEffect, useLayoutEffect
4. **Browser APIs** - localStorage, window, etc.
5. **Event Listeners** - addEventListener
6. **Custom Hooks** - Any hook usage

**Client Component Examples:**

```tsx
"use client";

// 1. Form with validation
import { useState } from "react";

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Invalid email");
      return;
    }
    // Submit form
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <p>{error}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

```tsx
"use client";

// 2. Using browser APIs
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.add(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return <button onClick={toggleTheme}>Toggle Theme</button>;
}
```

---

### Q3: How do Server and Client Components work together?

**Answer:**
Server and Client Components can be composed together, but there are important rules to follow.

**Composition Patterns:**

**1. Client Component inside Server Component (✅ Correct):**

```tsx
// app/page.tsx (Server Component)
import ClientComponent from "./ClientComponent";

export default async function Page() {
  const data = await fetchData();

  return (
    <div>
      <h1>{data.title}</h1>
      <ClientComponent /> {/* Works! */}
    </div>
  );
}

// ./ClientComponent.tsx
"use client";

export default function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

**2. Server Component inside Client Component (❌ Wrong Way):**

```tsx
// ❌ This doesn't work!
"use client";

import ServerComponent from "./ServerComponent";

export default function ClientComponent() {
  return (
    <div>
      <ServerComponent /> {/* Won't work! */}
    </div>
  );
}
```

**3. Server Component inside Client Component (✅ Correct Way - Using Children):**

```tsx
// app/page.tsx (Server Component)
import ClientComponent from "./ClientComponent";
import ServerComponent from "./ServerComponent";

export default function Page() {
  return (
    <ClientComponent>
      <ServerComponent /> {/* Works! Passed as children */}
    </ClientComponent>
  );
}

// ClientComponent.tsx
"use client";

export default function ClientComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && children}
    </div>
  );
}
```

**4. Passing Props from Server to Client:**

```tsx
// Server Component
export default async function Page() {
  const user = await getUser();

  // ✅ Can pass serializable props
  return <ClientComponent user={user} />;
}

// Client Component
"use client";

export default function ClientComponent({ user }: { user: User }) {
  return <div>Welcome, {user.name}</div>;
}
```

**⚠️ Important Rules:**

- Props passed from Server to Client must be serializable (no functions)
- Cannot import Server Component in Client Component directly
- Can pass Server Component as children to Client Component

---

## Streaming and Suspense

### Q4: How does streaming work in Next.js?

**Answer:**
Streaming allows you to progressively render and send UI to the client as it becomes ready.

**Loading States with Suspense:**

```tsx
// app/dashboard/page.tsx
import { Suspense } from "react";
import { Posts, Analytics, Users } from "./components";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Each component streams independently */}
      <Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </Suspense>

      <Suspense fallback={<AnalyticsSkeleton />}>
        <Analytics />
      </Suspense>

      <Suspense fallback={<UsersSkeleton />}>
        <Users />
      </Suspense>
    </div>
  );
}
```

**Components that take time:**

```tsx
// components/Posts.tsx (Server Component)
async function getPosts() {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Slow
  return fetch("https://api.example.com/posts").then((r) => r.json());
}

export default async function Posts() {
  const posts = await getPosts();

  return (
    <div>
      {posts.map((post) => (
        <article key={post.id}>{post.title}</article>
      ))}
    </div>
  );
}
```

**Benefits:**

1. **Faster First Byte** - Show page immediately
2. **Progressive Loading** - Components load as ready
3. **Better UX** - Users see something quickly
4. **Parallel Fetching** - All Suspense boundaries fetch in parallel

**Real-World Example:**

```tsx
// app/product/[id]/page.tsx
import { Suspense } from "react";

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div>
      {/* Critical content - load immediately */}
      <ProductInfo id={params.id} />

      {/* Non-critical - can stream */}
      <Suspense fallback={<div>Loading reviews...</div>}>
        <Reviews id={params.id} />
      </Suspense>

      <Suspense fallback={<div>Loading recommendations...</div>}>
        <Recommendations id={params.id} />
      </Suspense>
    </div>
  );
}
```

---

### Q5: What is the loading.tsx file and how does it work?

**Answer:**
`loading.tsx` is a special file that creates a loading UI for a route segment automatically using Suspense.

**Basic Usage:**

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div>
      <p>Loading dashboard...</p>
      <Spinner />
    </div>
  );
}

// app/dashboard/page.tsx
export default async function Dashboard() {
  const data = await fetchData(); // This triggers loading.tsx
  return <div>{data.title}</div>;
}
```

**How it works:**

```tsx
// Next.js automatically wraps your page like this:
<Suspense fallback={<Loading />}>
  <Page />
</Suspense>
```

**Nested Loading States:**

```
app/
├── dashboard/
│   ├── loading.tsx          → Shows while dashboard/* loads
│   ├── page.tsx
│   ├── settings/
│   │   ├── loading.tsx      → Shows while settings loads
│   │   └── page.tsx
│   └── profile/
│       └── page.tsx         → Uses parent loading.tsx
```

**Skeleton UI:**

```tsx
// app/products/loading.tsx
export default function Loading() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded mt-2" />
          <div className="h-4 bg-gray-200 rounded mt-1 w-2/3" />
        </div>
      ))}
    </div>
  );
}
```

---

## Caching and Revalidation

### Q6: Explain Next.js caching strategies in detail

**Answer:**
Next.js provides multiple caching layers to optimize performance.

**1. Request Memoization:**

Automatic deduplication of identical requests in a single render pass.

```tsx
// Both calls are deduplicated automatically
async function getUser(id: string) {
  return fetch(`https://api.example.com/users/${id}`);
}

export default async function Page() {
  const user1 = await getUser("1"); // Fetches
  const user2 = await getUser("1"); // Uses cached result

  return <div>{user1.name}</div>;
}
```

**2. Data Cache:**

Persistent cache across requests and deployments.

```tsx
// Default: cache: 'force-cache' (Static Site Generation)
fetch("https://api.example.com/data", {
  cache: "force-cache", // Cached indefinitely
});

// No caching (Server-Side Rendering)
fetch("https://api.example.com/data", {
  cache: "no-store", // Never cached
});

// Revalidate periodically (Incremental Static Regeneration)
fetch("https://api.example.com/data", {
  next: { revalidate: 3600 }, // Revalidate every hour
});
```

**3. Full Route Cache:**

Entire route is cached at build time.

```tsx
// This page is fully cached at build time
export default async function Page() {
  const data = await fetch("https://api.example.com/data", {
    cache: "force-cache",
  });

  return <div>{data.title}</div>;
}

// This page is NOT cached
export const dynamic = "force-dynamic";

export default async function Page() {
  return <div>Always fresh</div>;
}
```

**4. Router Cache:**

Client-side cache of visited routes.

- Cached in memory
- Lasts 30 seconds for dynamic routes
- Lasts 5 minutes for static routes
- Cleared on page refresh

**Opt-out of Caching:**

```tsx
// Opt out at page level
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Or per fetch
fetch(url, { cache: "no-store" });
fetch(url, { next: { revalidate: 0 } });
```

---

### Q7: How do you revalidate cached data?

**Answer:**
Next.js provides multiple methods to revalidate (refresh) cached data.

**1. Time-Based Revalidation (ISR):**

```tsx
// Revalidate every 60 seconds
export async function getData() {
  const res = await fetch("https://api.example.com/data", {
    next: { revalidate: 60 },
  });
  return res.json();
}

// Or at page level
export const revalidate = 60;

export default async function Page() {
  const data = await getData();
  return <div>{data.title}</div>;
}
```

**2. On-Demand Revalidation:**

```tsx
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: "Invalid secret" }, { status: 401 });
  }

  // Revalidate specific path
  revalidatePath("/posts");

  // Revalidate specific tag
  revalidateTag("posts");

  return Response.json({ revalidated: true });
}
```

**3. Tag-Based Revalidation:**

```tsx
// Fetch with tags
async function getPosts() {
  const res = await fetch("https://api.example.com/posts", {
    next: { tags: ["posts"] },
  });
  return res.json();
}

// Revalidate all fetches with 'posts' tag
import { revalidateTag } from "next/cache";

revalidateTag("posts");
```

**4. Path-Based Revalidation:**

```tsx
import { revalidatePath } from "next/cache";

// Revalidate specific page
revalidatePath("/blog/post-1");

// Revalidate all blog posts
revalidatePath("/blog/[slug]", "page");

// Revalidate layout
revalidatePath("/blog", "layout");
```

**Real-World Example - Blog CMS:**

```tsx
// app/api/webhook/route.ts
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const { type, slug } = await request.json();

  if (type === "post.published") {
    revalidateTag("posts");
    revalidateTag(`post-${slug}`);
  }

  return Response.json({ revalidated: true });
}

// app/blog/[slug]/page.tsx
async function getPost(slug: string) {
  const res = await fetch(`https://api.example.com/posts/${slug}`, {
    next: { tags: ["posts", `post-${slug}`] },
  });
  return res.json();
}
```

---

## Performance Optimization

### Q8: What are the best practices for optimizing Next.js performance?

**Answer:**
Next.js provides many built-in optimizations and best practices.

**1. Use Server Components by Default:**

```tsx
// ✅ Server Component (default)
async function Page() {
  const data = await fetchData();
  return <div>{data.title}</div>;
}

// ❌ Avoid unnecessary Client Components
"use client";

function Page() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  return <div>{data?.title}</div>;
}
```

**2. Optimize Images:**

```tsx
import Image from "next/image";

// ✅ Good
<Image
  src="/photo.jpg"
  alt="Photo"
  width={500}
  height={300}
  loading="lazy" // or priority for above-fold
/>;

// ❌ Avoid regular img tags
<img src="/photo.jpg" alt="Photo" />
```

**3. Code Splitting with Dynamic Imports:**

```tsx
import dynamic from "next/dynamic";

// Lazy load component
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable SSR if not needed
});

export default function Page() {
  return (
    <div>
      <h1>Page</h1>
      <HeavyComponent />
    </div>
  );
}
```

**4. Optimize Fonts:**

```tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Prevent layout shift
  preload: true,
});
```

**5. Use Streaming:**

```tsx
import { Suspense } from "react";

export default function Page() {
  return (
    <div>
      <Header /> {/* Loads immediately */}
      <Suspense fallback={<Skeleton />}>
        <SlowComponent /> {/* Streams when ready */}
      </Suspense>
    </div>
  );
}
```

**6. Optimize Third-Party Scripts:**

```tsx
import Script from "next/script";

export default function Page() {
  return (
    <>
      {/* Load after page is interactive */}
      <Script src="https://example.com/script.js" strategy="lazyOnload" />

      {/* Load before page is interactive */}
      <Script src="https://example.com/critical.js" strategy="beforeInteractive" />
    </>
  );
}
```

**7. Bundle Analysis:**

```bash
# Install analyzer
npm install @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({});

# Run analysis
ANALYZE=true npm run build
```

---

## Edge Runtime

### Q9: What is Edge Runtime and when should you use it?

**Answer:**
Edge Runtime is a lightweight runtime that runs your code at the edge (closer to users) for lower latency.

**Enabling Edge Runtime:**

```tsx
// app/api/hello/route.ts
export const runtime = "edge"; // Enable Edge Runtime

export async function GET(request: Request) {
  return Response.json({ message: "Hello from the edge!" });
}
```

**Edge Runtime Limitations:**

- No Node.js APIs (fs, path, etc.)
- Smaller API surface
- No native modules
- Size limit (1MB after compression)

**When to Use Edge Runtime:**

1. **Low-latency APIs** - Responses from nearest edge location
2. **Authentication** - Fast auth checks
3. **Redirects** - Geographic redirects
4. **A/B testing** - Edge-based experiments
5. **Personalization** - Fast content customization

**Example - Geolocation:**

```tsx
// middleware.ts
export const config = {
  runtime: "edge",
};

export function middleware(request: NextRequest) {
  const country = request.geo?.country || "US";
  const city = request.geo?.city || "Unknown";

  // Redirect based on location
  if (country === "FR") {
    return NextResponse.redirect(new URL("/fr", request.url));
  }

  return NextResponse.next();
}
```

**Example - Edge API Route:**

```tsx
// app/api/users/route.ts
export const runtime = "edge";

export async function GET(request: Request) {
  const users = await fetch("https://api.example.com/users", {
    headers: {
      "x-forwarded-for": request.headers.get("x-forwarded-for") || "",
    },
  });

  return Response.json(await users.json());
}
```

**Node.js Runtime (Default):**

```tsx
// app/api/files/route.ts
// Uses Node.js runtime by default

import { readFile } from "fs/promises";

export async function GET() {
  const data = await readFile("./data.json", "utf-8");
  return Response.json(JSON.parse(data));
}
```

---

## Summary

**Key Takeaways:**

1. **Server Components** - Default in App Router, reduce bundle size
2. **Client Components** - Use 'use client' for interactivity
3. **Streaming** - Progressive rendering with Suspense
4. **Caching** - Multiple layers: request, data, route, router
5. **Revalidation** - Time-based, on-demand, tag-based
6. **Performance** - Server Components, image optimization, code splitting
7. **Edge Runtime** - Low latency, limited API surface

**Interview Tips:**

- Explain the benefits of Server Components
- Know when to use Client Components
- Understand caching strategies
- Be familiar with revalidation methods
- Practice optimizing performance
- Understand Edge Runtime use cases

---

**Next:** [Data Fetching Questions](04-data-fetching-questions.md)

