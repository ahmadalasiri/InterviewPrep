# Next.js Data Fetching Interview Questions

## Table of Contents

- [Data Fetching Methods](#data-fetching-methods)
- [Server-Side Data Fetching](#server-side-data-fetching)
- [Client-Side Data Fetching](#client-side-data-fetching)
- [API Routes and Route Handlers](#api-routes-and-route-handlers)
- [Server Actions](#server-actions)

---

## Data Fetching Methods

### Q1: What are the different rendering and data fetching methods in Next.js?

**Answer:**
Next.js supports four main rendering strategies with different data fetching approaches.

**1. Static Site Generation (SSG) - Default:**

```tsx
// app/blog/[slug]/page.tsx
async function getPost(slug: string) {
  const res = await fetch(`https://api.example.com/posts/${slug}`, {
    cache: "force-cache", // SSG (default)
  });
  return res.json();
}

export async function generateStaticParams() {
  const posts = await fetch("https://api.example.com/posts").then((r) =>
    r.json()
  );

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return <article>{post.content}</article>;
}
```

**Benefits:**
- Fastest performance (pre-rendered at build time)
- Best for static content
- Can be deployed to CDN

**2. Server-Side Rendering (SSR):**

```tsx
// app/dashboard/page.tsx
async function getData() {
  const res = await fetch("https://api.example.com/user", {
    cache: "no-store", // SSR
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return res.json();
}

export default async function Dashboard() {
  const data = await getData();
  return <div>Welcome, {data.name}</div>;
}
```

**Benefits:**
- Always fresh data
- Can access request-specific data (cookies, headers)
- Best for personalized content

**3. Incremental Static Regeneration (ISR):**

```tsx
// app/products/[id]/page.tsx
async function getProduct(id: string) {
  const res = await fetch(`https://api.example.com/products/${id}`, {
    next: { revalidate: 60 }, // ISR - revalidate every 60 seconds
  });
  return res.json();
}

export default async function Product({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  return <div>{product.name}</div>;
}
```

**Benefits:**
- Balance between SSG and SSR
- Automatically updates stale content
- Best for content that changes occasionally

**4. Client-Side Rendering (CSR):**

```tsx
"use client";

import { useState, useEffect } from "react";

export default function ClientPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{data.title}</div>;
}
```

**Benefits:**
- Highly interactive
- Real-time updates
- Best for user-specific, dynamic content

**Comparison:**

| Method | When     | Use Case                |
| ------ | -------- | ----------------------- |
| SSG    | Build    | Blog posts, docs        |
| SSR    | Request  | User dashboard, auth    |
| ISR    | Interval | Product pages, news     |
| CSR    | Client   | Real-time data, widgets |

---

### Q2: How does data fetching work in App Router vs Pages Router?

**Answer:**
Data fetching is fundamentally different between the two routing systems.

**App Router (Modern):**

```tsx
// app/posts/page.tsx - Async component
async function getPosts() {
  const res = await fetch("https://api.example.com/posts");
  return res.json();
}

export default async function Page() {
  const posts = await getPosts(); // Direct await
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

**Pages Router (Legacy):**

```tsx
// pages/posts.tsx
export async function getServerSideProps() {
  const res = await fetch("https://api.example.com/posts");
  const posts = await res.json();

  return {
    props: { posts },
  };
}

export default function Page({ posts }: { posts: Post[] }) {
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

**Key Differences:**

| Feature                 | App Router        | Pages Router                  |
| ----------------------- | ----------------- | ----------------------------- |
| Data Fetching Location  | In component      | Separate function             |
| Component Type          | Async             | Regular                       |
| Props                   | Direct data use   | Passed as props               |
| SSG                     | cache: force      | getStaticProps                |
| SSR                     | cache: no-store   | getServerSideProps            |
| ISR                     | revalidate        | revalidate in getStaticProps  |
| Error Handling          | error.tsx         | Custom error page             |
| Loading States          | loading.tsx       | Manual                        |

---

## Server-Side Data Fetching

### Q3: How do you fetch data in Server Components?

**Answer:**
Server Components can fetch data directly using async/await without any special APIs.

**Basic Data Fetching:**

```tsx
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch("https://api.example.com/posts");

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

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

**Parallel Data Fetching:**

```tsx
// app/dashboard/page.tsx
async function getUser() {
  const res = await fetch("https://api.example.com/user");
  return res.json();
}

async function getPosts() {
  const res = await fetch("https://api.example.com/posts");
  return res.json();
}

async function getAnalytics() {
  const res = await fetch("https://api.example.com/analytics");
  return res.json();
}

export default async function Dashboard() {
  // Fetch in parallel
  const [user, posts, analytics] = await Promise.all([
    getUser(),
    getPosts(),
    getAnalytics(),
  ]);

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <Posts data={posts} />
      <Analytics data={analytics} />
    </div>
  );
}
```

**Sequential Data Fetching (when needed):**

```tsx
// app/profile/[id]/page.tsx
async function getUser(id: string) {
  const res = await fetch(`https://api.example.com/users/${id}`);
  return res.json();
}

async function getUserPosts(userId: string) {
  const res = await fetch(`https://api.example.com/users/${userId}/posts`);
  return res.json();
}

export default async function Profile({ params }: { params: { id: string } }) {
  // Sequential - posts depend on user
  const user = await getUser(params.id);
  const posts = await getUserPosts(user.id);

  return (
    <div>
      <h1>{user.name}</h1>
      <Posts data={posts} />
    </div>
  );
}
```

**With Request Context:**

```tsx
// app/api/profile/page.tsx
import { cookies, headers } from "next/headers";

async function getProfile() {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  const res = await fetch("https://api.example.com/profile", {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  });

  return res.json();
}

export default async function Profile() {
  const profile = await getProfile();
  return <div>{profile.email}</div>;
}
```

---

### Q4: How do you handle errors in data fetching?

**Answer:**
Next.js provides error.tsx files for handling errors in route segments.

**Error Boundary:**

```tsx
// app/posts/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Error loading posts</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

**Data Fetching with Error Handling:**

```tsx
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch("https://api.example.com/posts");

  if (!res.ok) {
    throw new Error("Failed to fetch posts"); // Caught by error.tsx
  }

  return res.json();
}

export default async function Page() {
  const posts = await getPosts();
  return <div>{/* render posts */}</div>;
}
```

**Custom Error Handling:**

```tsx
// lib/api.ts
export async function fetchAPI<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "API Error");
    }

    return res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

// Usage
async function getPosts() {
  return fetchAPI<Post[]>("https://api.example.com/posts");
}
```

**Not Found:**

```tsx
// app/posts/[id]/page.tsx
import { notFound } from "next/navigation";

async function getPost(id: string) {
  const res = await fetch(`https://api.example.com/posts/${id}`);

  if (res.status === 404) {
    notFound(); // Shows not-found.tsx
  }

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  return res.json();
}

export default async function Page({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  return <article>{post.content}</article>;
}

// app/posts/[id]/not-found.tsx
export default function NotFound() {
  return <h2>Post not found</h2>;
}
```

---

## Client-Side Data Fetching

### Q5: What are the best practices for client-side data fetching?

**Answer:**
Client-side data fetching should be used for interactive, user-specific, or real-time data.

**Using useEffect (Basic):**

```tsx
"use client";

import { useState, useEffect } from "react";

export default function ClientData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{data.title}</div>;
}
```

**Using SWR (Recommended):**

```tsx
"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Profile() {
  const { data, error, isLoading, mutate } = useSWR("/api/user", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <button onClick={() => mutate()}>Refresh</button>
    </div>
  );
}
```

**Using TanStack Query:**

```tsx
"use client";

import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";

function Profile() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetch("/api/profile").then((r) => r.json()),
    staleTime: 60000, // Consider fresh for 1 minute
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return <div>{data.name}</div>;
}

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Profile />
    </QueryClientProvider>
  );
}
```

**Real-Time Data:**

```tsx
"use client";

import { useState, useEffect } from "react";

export default function LiveData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // WebSocket connection
    const ws = new WebSocket("wss://api.example.com/live");

    ws.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    return () => ws.close();
  }, []);

  return <div>{data?.value}</div>;
}
```

---

## API Routes and Route Handlers

### Q6: How do you create API routes in Next.js App Router?

**Answer:**
In App Router, API routes are created using route handlers in the `app/api` directory.

**Basic Route Handler:**

```tsx
// app/api/hello/route.ts
export async function GET(request: Request) {
  return Response.json({ message: "Hello, World!" });
}

export async function POST(request: Request) {
  const data = await request.json();
  return Response.json({ received: data }, { status: 201 });
}
```

**All HTTP Methods:**

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

export async function PUT(request: Request) {
  const data = await request.json();
  const user = await updateUser(data);
  return Response.json(user);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  await deleteUser(id);
  return Response.json({ success: true });
}

export async function PATCH(request: Request) {
  const data = await request.json();
  const user = await patchUser(data);
  return Response.json(user);
}
```

**Dynamic Route Handler:**

```tsx
// app/api/users/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUser(params.id);

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json(user);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await deleteUser(params.id);
  return Response.json({ success: true });
}
```

**Request Data:**

```tsx
// app/api/posts/route.ts
export async function POST(request: Request) {
  // JSON body
  const body = await request.json();

  // Query parameters
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  // Headers
  const contentType = request.headers.get("content-type");

  // Cookies
  const token = request.cookies.get("token");

  return Response.json({ body, category, contentType });
}
```

**Response Types:**

```tsx
// JSON response
return Response.json({ data: "value" });

// Text response
return new Response("Hello", { status: 200 });

// Redirect
return Response.redirect("https://example.com");

// Custom headers
return Response.json(
  { data: "value" },
  {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  }
);
```

---

### Q7: How do you implement authentication in API routes?

**Answer:**
Authentication in API routes typically involves validating tokens or sessions.

**JWT Authentication:**

```tsx
// lib/auth.ts
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createToken(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

// app/api/protected/route.ts
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  const data = await getProtectedData(payload.userId);
  return Response.json(data);
}
```

**Session-Based Authentication:**

```tsx
// app/api/profile/route.ts
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserFromSession(session.value);

  if (!user) {
    return Response.json({ error: "Invalid session" }, { status: 401 });
  }

  return Response.json(user);
}
```

**Middleware Function:**

```tsx
// lib/middleware.ts
export async function withAuth(
  request: Request,
  handler: (request: Request, user: User) => Promise<Response>
) {
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await verifyToken(token);

  if (!user) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  return handler(request, user);
}

// Usage
// app/api/protected/route.ts
import { withAuth } from "@/lib/middleware";

export async function GET(request: Request) {
  return withAuth(request, async (request, user) => {
    const data = await getData(user.id);
    return Response.json(data);
  });
}
```

---

## Server Actions

### Q8: What are Server Actions and how do you use them?

**Answer:**
Server Actions are asynchronous functions that run on the server and can be called directly from Client Components.

**Basic Server Action:**

```tsx
// app/actions.ts
"use server";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  const post = await db.post.create({
    data: { title, content },
  });

  return { success: true, post };
}

// app/create-post/page.tsx
import { createPost } from "../actions";

export default function CreatePost() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="Title" />
      <textarea name="content" placeholder="Content" />
      <button type="submit">Create Post</button>
    </form>
  );
}
```

**With Client Component:**

```tsx
// app/actions.ts
"use server";

export async function updateUser(userId: string, name: string) {
  const user = await db.user.update({
    where: { id: userId },
    data: { name },
  });

  return user;
}

// components/UserForm.tsx
"use client";

import { updateUser } from "@/app/actions";
import { useState } from "react";

export default function UserForm({ userId }: { userId: string }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await updateUser(userId, name);
      console.log("Updated:", user);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update"}
      </button>
    </form>
  );
}
```

**Revalidation with Server Actions:**

```tsx
// app/actions.ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function createPost(formData: FormData) {
  const post = await db.post.create({
    data: {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
    },
  });

  // Revalidate specific path
  revalidatePath("/posts");

  // Or revalidate by tag
  revalidateTag("posts");

  return { success: true, post };
}
```

**Progressive Enhancement:**

```tsx
// app/actions.ts
"use server";

import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const post = await db.post.create({
    data: {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
    },
  });

  redirect(`/posts/${post.id}`); // Works without JavaScript
}

// app/create-post/page.tsx
import { createPost } from "../actions";

export default function Page() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit">Create</button>
    </form>
  );
}
```

**Benefits of Server Actions:**

- No API routes needed
- Type-safe
- Progressive enhancement
- Automatic revalidation
- Direct database access

---

## Summary

**Key Takeaways:**

1. **Rendering Methods** - SSG, SSR, ISR, CSR
2. **Server-Side Fetching** - Async components, direct fetch
3. **Client-Side Fetching** - useEffect, SWR, TanStack Query
4. **API Routes** - Route handlers in app/api
5. **Server Actions** - Server functions callable from client
6. **Error Handling** - error.tsx, try-catch
7. **Caching** - force-cache, no-store, revalidate

**Interview Tips:**

- Know when to use each rendering method
- Understand Server vs Client data fetching
- Be familiar with Server Actions
- Practice creating API routes
- Understand caching strategies

---

**Next:** [Practical Questions](05-practical-questions.md)

