# Next.js Practical Coding Questions

## Table of Contents

- [Component Implementation](#component-implementation)
- [Authentication and Authorization](#authentication-and-authorization)
- [Forms and Data Mutations](#forms-and-data-mutations)
- [Real-World Scenarios](#real-world-scenarios)
- [Performance Challenges](#performance-challenges)

---

## Component Implementation

### Q1: Build a blog with dynamic routes, SSG, and ISR

**Challenge:**
Create a blog application with the following requirements:
- List of all posts (SSG)
- Individual post pages (SSG with ISR)
- New posts should appear after 60 seconds
- 404 page for non-existent posts

**Solution:**

```tsx
// types/post.ts
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  author: {
    name: string;
    avatar: string;
  };
}

// lib/api.ts
const API_URL = process.env.API_URL || "https://api.example.com";

export async function getAllPosts(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/posts`, {
    next: { revalidate: 60 }, // ISR - revalidate every 60 seconds
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const res = await fetch(`${API_URL}/posts/${slug}`, {
    next: { revalidate: 60 }, // ISR
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  return res.json();
}

// app/blog/page.tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Blog",
  description: "Read our latest articles",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="border rounded-lg p-6 hover:shadow-lg transition"
          >
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(post.publishedAt)}
                  </p>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import { formatDate } from "@/lib/utils";

// Generate static params for all posts
export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      <div className="flex items-center gap-3 mb-8">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="font-medium">{post.author.name}</p>
          <p className="text-sm text-gray-500">
            {formatDate(post.publishedAt)}
          </p>
        </div>
      </div>

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}

// app/blog/[slug]/not-found.tsx
export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
      <p className="text-gray-600 mb-8">
        The blog post you're looking for doesn't exist.
      </p>
      <Link href="/blog" className="text-blue-600 hover:underline">
        Back to Blog
      </Link>
    </div>
  );
}

// lib/utils.ts
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
```

---

### Q2: Implement infinite scroll with Suspense and streaming

**Challenge:**
Create an infinite scroll component that:
- Loads posts in batches
- Uses Suspense for loading states
- Implements intersection observer
- Handles errors gracefully

**Solution:**

```tsx
// app/feed/page.tsx
import { Suspense } from "react";
import PostList from "@/components/PostList";
import PostListSkeleton from "@/components/PostListSkeleton";

export default function FeedPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Feed</h1>

      <Suspense fallback={<PostListSkeleton />}>
        <PostList />
      </Suspense>
    </div>
  );
}

// components/PostList.tsx
import { getPosts } from "@/lib/api";
import InfiniteScroll from "./InfiniteScroll";

export default async function PostList() {
  const initialPosts = await getPosts(1, 10);

  return <InfiniteScroll initialPosts={initialPosts} />;
}

// components/InfiniteScroll.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Post } from "@/types/post";

interface Props {
  initialPosts: Post[];
}

export default function InfiniteScroll({ initialPosts }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading]);

  async function loadMore() {
    setLoading(true);

    try {
      const response = await fetch(`/api/posts?page=${page + 1}&limit=10`);
      const newPosts = await response.json();

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.id} className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600">{post.excerpt}</p>
          </article>
        ))}
      </div>

      {hasMore && (
        <div ref={observerRef} className="py-8 text-center">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto" />
            </div>
          ) : (
            <p className="text-gray-500">Scroll for more</p>
          )}
        </div>
      )}

      {!hasMore && (
        <p className="text-center py-8 text-gray-500">
          You've reached the end!
        </p>
      )}
    </div>
  );
}

// components/PostListSkeleton.tsx
export default function PostListSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6 mt-1" />
        </div>
      ))}
    </div>
  );
}

// app/api/posts/route.ts
import { NextRequest } from "next/server";
import { getPosts } from "@/lib/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const posts = await getPosts(page, limit);

  return Response.json(posts);
}
```

---

## Authentication and Authorization

### Q3: Implement authentication with protected routes

**Challenge:**
Create an authentication system with:
- Login/logout functionality
- Protected routes
- Session management
- User context

**Solution:**

```tsx
// lib/auth.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(secret);

  cookies().set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function getSession() {
  const token = cookies().get("session")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  cookies().delete("session");
}

// app/api/auth/login/route.ts
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Verify credentials (example)
  const user = await verifyCredentials(email, password);

  if (!user) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await createSession(user.id);

  return Response.json({ success: true, user });
}

// app/api/auth/logout/route.ts
import { deleteSession } from "@/lib/auth";

export async function POST() {
  await deleteSession();
  return Response.json({ success: true });
}

// app/api/auth/me/route.ts
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserById(session.userId);

  return Response.json(user);
}

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await getSession();

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect to dashboard if already logged in
  if (request.nextUrl.pathname === "/login") {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};

// app/login/page.tsx
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6">
        <h1 className="text-3xl font-bold mb-6">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}

// components/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>
      )}

      <div>
        <label className="block mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

// app/dashboard/page.tsx
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = await getUserById(session.userId);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user.name}!</h2>
        <p className="text-gray-600">{user.email}</p>
      </div>
    </div>
  );
}

// components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
}
```

---

## Forms and Data Mutations

### Q4: Build a form with Server Actions and validation

**Challenge:**
Create a contact form with:
- Server-side validation
- Progressive enhancement
- Loading states
- Success/error handling

**Solution:**

```tsx
// lib/validations.ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// app/actions.ts
"use server";

import { contactSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function submitContactForm(formData: FormData) {
  // Validate form data
  const validatedFields = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, message } = validatedFields.data;

  try {
    // Save to database
    await db.contact.create({
      data: { name, email, message },
    });

    // Send email notification
    await sendEmail({
      to: "admin@example.com",
      subject: "New Contact Form Submission",
      html: `<p>From: ${name} (${email})</p><p>${message}</p>`,
    });

    revalidatePath("/contact");

    return { success: true };
  } catch (error) {
    return {
      error: "Failed to submit form. Please try again.",
    };
  }
}

// app/contact/page.tsx
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      <ContactForm />
    </div>
  );
}

// components/ContactForm.tsx
"use client";

import { submitContactForm } from "@/app/actions";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {pending ? "Sending..." : "Send Message"}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useFormState(submitContactForm, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      alert("Message sent successfully!");
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded">{state.error}</div>
      )}

      <div>
        <label htmlFor="name" className="block mb-2 font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="w-full border rounded px-3 py-2"
          required
        />
        {state?.errors?.name && (
          <p className="text-red-600 text-sm mt-1">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block mb-2 font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full border rounded px-3 py-2"
          required
        />
        {state?.errors?.email && (
          <p className="text-red-600 text-sm mt-1">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block mb-2 font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="w-full border rounded px-3 py-2"
          required
        />
        {state?.errors?.message && (
          <p className="text-red-600 text-sm mt-1">
            {state.errors.message[0]}
          </p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
```

---

## Real-World Scenarios

### Q5: Build a search with debouncing and URL state

**Challenge:**
Create a search feature with:
- Debounced input
- URL state management
- Server-side filtering
- Loading states

**Solution:**

```tsx
// app/search/page.tsx
import { Suspense } from "react";
import SearchInput from "@/components/SearchInput";
import SearchResults from "@/components/SearchResults";
import SearchSkeleton from "@/components/SearchSkeleton";

type SearchPageProps = {
  searchParams: { q?: string };
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Search</h1>

      <SearchInput initialQuery={query} />

      {query && (
        <Suspense key={query} fallback={<SearchSkeleton />}>
          <SearchResults query={query} />
        </Suspense>
      )}

      {!query && (
        <p className="text-gray-500 mt-8">Enter a search query to begin</p>
      )}
    </div>
  );
}

// components/SearchInput.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchInput({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  const updateURL = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    router.push(`/search?${params.toString()}`);
  }, 300);

  function handleChange(value: string) {
    setQuery(value);
    updateURL(value);
  }

  return (
    <div className="relative">
      <input
        type="search"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search..."
        className="w-full border rounded-lg px-4 py-3 pr-10"
      />
      <svg
        className="absolute right-3 top-3.5 h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}

// components/SearchResults.tsx
import { searchPosts } from "@/lib/api";
import Link from "next/link";

export default async function SearchResults({ query }: { query: string }) {
  const results = await searchPosts(query);

  if (results.length === 0) {
    return (
      <div className="mt-8 text-center">
        <p className="text-gray-600">No results found for "{query}"</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <p className="text-gray-600 mb-4">
        Found {results.length} result{results.length !== 1 ? "s" : ""} for "
        {query}"
      </p>

      <div className="space-y-4">
        {results.map((post) => (
          <article key={post.id} className="border rounded-lg p-6">
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl font-semibold mb-2 hover:text-blue-600">
                {post.title}
              </h2>
              <p className="text-gray-600">{post.excerpt}</p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

// components/SearchSkeleton.tsx
export default function SearchSkeleton() {
  return (
    <div className="mt-8 space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6 mt-1" />
        </div>
      ))}
    </div>
  );
}

// lib/api.ts
export async function searchPosts(query: string): Promise<Post[]> {
  const res = await fetch(
    `https://api.example.com/posts/search?q=${encodeURIComponent(query)}`,
    {
      cache: "no-store", // Always fresh results
    }
  );

  if (!res.ok) {
    throw new Error("Failed to search posts");
  }

  return res.json();
}
```

---

## Performance Challenges

### Q6: Optimize a slow dashboard with multiple data sources

**Challenge:**
Optimize a dashboard that:
- Loads data from multiple sources
- Has slow API responses
- Needs to show loading states
- Should load critical data first

**Solution:**

```tsx
// app/dashboard/page.tsx
import { Suspense } from "react";
import UserInfo from "./UserInfo";
import RecentActivity from "./RecentActivity";
import Analytics from "./Analytics";
import QuickActions from "./QuickActions";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Critical - load immediately */}
        <div className="md:col-span-2">
          <UserInfo />
        </div>

        <div>
          <QuickActions />
        </div>

        {/* Non-critical - stream when ready */}
        <div className="md:col-span-2">
          <Suspense fallback={<ActivitySkeleton />}>
            <RecentActivity />
          </Suspense>
        </div>

        <div>
          <Suspense fallback={<AnalyticsSkeleton />}>
            <Analytics />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// app/dashboard/UserInfo.tsx (Server Component)
import { getUser } from "@/lib/api";

export default async function UserInfo() {
  const user = await getUser();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Welcome Back!</h2>
      <p className="text-gray-600">{user.name}</p>
      <p className="text-sm text-gray-500">{user.email}</p>
    </div>
  );
}

// app/dashboard/RecentActivity.tsx (Server Component)
async function getActivity() {
  // Slow API call
  const res = await fetch("https://api.example.com/activity", {
    cache: "no-store",
  });
  return res.json();
}

export default async function RecentActivity() {
  const activity = await getActivity();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <ul className="space-y-3">
        {activity.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <span className="text-gray-500">{item.time}</span>
            <span>{item.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// app/dashboard/Analytics.tsx (Server Component)
async function getAnalytics() {
  // Another slow API call
  const res = await fetch("https://api.example.com/analytics", {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });
  return res.json();
}

export default async function Analytics() {
  const analytics = await getAnalytics();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Analytics</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Page Views</p>
          <p className="text-2xl font-bold">{analytics.pageViews}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Visitors</p>
          <p className="text-2xl font-bold">{analytics.visitors}</p>
        </div>
      </div>
    </div>
  );
}

// app/dashboard/QuickActions.tsx (Client Component)
"use client";

export default function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-2">
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          New Post
        </button>
        <button className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300">
          View Reports
        </button>
      </div>
    </div>
  );
}

// Skeleton components
function ActivitySkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="h-4 bg-gray-200 rounded w-16" />
            <div className="h-4 bg-gray-200 rounded flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i}>
            <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Summary

**Key Takeaways:**

1. **Component Implementation** - Build real features with proper patterns
2. **Authentication** - Implement secure auth with sessions
3. **Forms** - Use Server Actions for progressive enhancement
4. **Real-World Scenarios** - Search, filters, infinite scroll
5. **Performance** - Optimize with Suspense and streaming

**Interview Tips:**

- Understand the full picture (client + server)
- Think about edge cases and errors
- Consider performance implications
- Use progressive enhancement
- Write clean, maintainable code

---

**Congratulations!** You've completed the Next.js interview preparation guide. Practice these patterns and build real projects to solidify your understanding.

