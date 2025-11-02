# Next.js Routing Interview Questions

## Table of Contents

- [App Router vs Pages Router](#app-router-vs-pages-router)
- [Dynamic Routing](#dynamic-routing)
- [Route Groups and Organization](#route-groups-and-organization)
- [Navigation](#navigation)
- [Middleware](#middleware)

---

## App Router vs Pages Router

### Q1: What are the key differences between App Router and Pages Router?

**Answer:**
Next.js supports two routing systems with significant differences in architecture and features.

**App Router (app/ directory - Next.js 13+):**

```tsx
// app/page.tsx
export default async function Page() {
  const data = await fetch("https://api.example.com/data");
  const json = await data.json();
  return <div>{json.title}</div>;
}
```

- Server Components by default
- Built-in layouts
- Streaming with Suspense
- Route handlers (app/api/*/route.ts)
- Server Actions
- Parallel and intercepting routes

**Pages Router (pages/ directory - Legacy):**

```tsx
// pages/index.tsx
export async function getServerSideProps() {
  const res = await fetch("https://api.example.com/data");
  const data = await res.json();
  return { props: { data } };
}

export default function Page({ data }) {
  return <div>{data.title}</div>;
}
```

- Client Components by default
- getStaticProps / getServerSideProps
- _app.js for global layout
- API routes (pages/api/*.ts)
- getInitialProps (legacy)

**Feature Comparison:**

| Feature | App Router | Pages Router |
|---------|-----------|--------------|
| Default Component Type | Server | Client |
| Layouts | Built-in | Manual (_app.js) |
| Data Fetching | Async components | getServerSideProps |
| Streaming | ✅ Yes | ❌ No |
| Server Actions | ✅ Yes | ❌ No |
| Parallel Routes | ✅ Yes | ❌ No |

---

### Q2: How do you migrate from Pages Router to App Router?

**Answer:**
Migration from Pages Router to App Router requires careful planning and can be done incrementally.

**Step-by-Step Migration:**

**1. Enable App Router:**

```tsx
// next.config.js
module.exports = {
  experimental: {
    appDir: true, // Enable app directory
  },
};
```

**2. Create app/ directory:**

```
my-app/
├── app/              # New App Router
│   ├── layout.tsx
│   └── page.tsx
├── pages/            # Legacy Pages Router (still works)
│   └── old-page.tsx
```

**3. Convert _app.js to layout.tsx:**

```tsx
// Before: pages/_app.js
function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
}

// After: app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

**4. Convert getServerSideProps:**

```tsx
// Before: pages/post.tsx
export async function getServerSideProps({ params }) {
  const post = await getPost(params.id);
  return { props: { post } };
}

export default function Post({ post }) {
  return <div>{post.title}</div>;
}

// After: app/post/[id]/page.tsx
async function getPost(id: string) {
  const res = await fetch(`https://api.example.com/posts/${id}`, {
    cache: "no-store", // SSR
  });
  return res.json();
}

export default async function Post({ params }) {
  const post = await getPost(params.id);
  return <div>{post.title}</div>;
}
```

**5. Convert API routes:**

```tsx
// Before: pages/api/users.ts
export default function handler(req, res) {
  if (req.method === "GET") {
    res.json({ users: [] });
  }
}

// After: app/api/users/route.ts
export async function GET(request: Request) {
  return Response.json({ users: [] });
}
```

**Migration Tips:**

- Both routers can coexist
- Migrate page by page
- Test thoroughly after each migration
- Update data fetching patterns
- Convert client-side code to 'use client'

---

## Dynamic Routing

### Q3: Explain all types of dynamic routes in Next.js App Router

**Answer:**
Next.js supports several dynamic routing patterns using brackets in file names.

**1. Single Dynamic Segment ([param]):**

```tsx
// app/blog/[slug]/page.tsx
export default function Page({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>;
}

// Matches:
// /blog/hello → params.slug = 'hello'
// /blog/world → params.slug = 'world'
```

**2. Multiple Dynamic Segments:**

```tsx
// app/shop/[category]/[product]/page.tsx
export default function Page({
  params,
}: {
  params: { category: string; product: string };
}) {
  return (
    <div>
      <p>Category: {params.category}</p>
      <p>Product: {params.product}</p>
    </div>
  );
}

// Matches:
// /shop/electronics/laptop
// /shop/clothing/shirt
```

**3. Catch-All Segments ([...param]):**

```tsx
// app/docs/[...slug]/page.tsx
export default function Page({ params }: { params: { slug: string[] } }) {
  return <h1>Docs: {params.slug.join("/")}</h1>;
}

// Matches:
// /docs/getting-started → slug = ['getting-started']
// /docs/api/reference → slug = ['api', 'reference']
// /docs/a/b/c/d → slug = ['a', 'b', 'c', 'd']
// Does NOT match: /docs
```

**4. Optional Catch-All Segments ([[...param]]):**

```tsx
// app/shop/[[...slug]]/page.tsx
export default function Page({ params }: { params: { slug?: string[] } }) {
  if (!params.slug) {
    return <h1>Shop Home</h1>;
  }
  return <h1>Category: {params.slug.join("/")}</h1>;
}

// Matches:
// /shop → slug = undefined
// /shop/electronics → slug = ['electronics']
// /shop/electronics/laptops → slug = ['electronics', 'laptops']
```

**5. Generate Static Params (for SSG):**

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return <article>{post.content}</article>;
}
```

**6. TypeScript with Dynamic Routes:**

```tsx
type PageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function Page({ params, searchParams }: PageProps) {
  return (
    <div>
      <p>Slug: {params.slug}</p>
      <p>Search: {searchParams.q}</p>
    </div>
  );
}
```

---

### Q4: How do you handle query parameters (search params) in Next.js?

**Answer:**
Search parameters (query strings) are handled differently in App Router and Pages Router.

**App Router - Server Components:**

```tsx
// app/search/page.tsx
type SearchPageProps = {
  searchParams: { q?: string; filter?: string };
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";
  const filter = searchParams.filter || "all";

  return (
    <div>
      <h1>Search Results for: {query}</h1>
      <p>Filter: {filter}</p>
    </div>
  );
}

// URL: /search?q=nextjs&filter=tutorials
// searchParams = { q: 'nextjs', filter: 'tutorials' }
```

**App Router - Client Components:**

```tsx
"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams.get("q") || "";

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    params.set("q", term);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
    </div>
  );
}
```

**Updating Search Params:**

```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`?${params.toString()}`);
  }

  return (
    <div>
      <button onClick={() => updateFilter("category", "tech")}>Tech</button>
      <button onClick={() => updateFilter("category", "design")}>
        Design
      </button>
      <button onClick={() => updateFilter("category", "")}>Clear</button>
    </div>
  );
}
```

---

## Route Groups and Organization

### Q5: What are route groups and when should you use them?

**Answer:**
Route groups organize routes without affecting the URL structure by using parentheses in folder names.

**Basic Route Group:**

```
app/
├── (marketing)/
│   ├── layout.tsx       → Marketing layout
│   ├── page.tsx         → / (home)
│   ├── about/
│   │   └── page.tsx     → /about
│   └── contact/
│       └── page.tsx     → /contact
├── (shop)/
│   ├── layout.tsx       → Shop layout
│   ├── products/
│   │   └── page.tsx     → /products
│   └── cart/
│       └── page.tsx     → /cart
└── layout.tsx           → Root layout
```

**Different Layouts:**

```tsx
// app/(marketing)/layout.tsx
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>
      {children}
    </div>
  );
}

// app/(shop)/layout.tsx
export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav>
        <Link href="/products">Products</Link>
        <Link href="/cart">Cart</Link>
      </nav>
      <aside>Filters</aside>
      <main>{children}</main>
    </div>
  );
}
```

**Use Cases:**

1. **Multiple root layouts:**

```
app/
├── (auth)/              → Auth pages (minimal layout)
│   ├── login/
│   ├── register/
│   └── layout.tsx
├── (dashboard)/         → Dashboard (sidebar layout)
│   ├── settings/
│   ├── profile/
│   └── layout.tsx
└── (marketing)/         → Marketing (header/footer)
    ├── about/
    └── layout.tsx
```

2. **Organization without URL impact:**

```
app/
├── (admin)/
│   └── users/
│       └── page.tsx     → /users (not /admin/users)
└── (public)/
    └── blog/
        └── page.tsx     → /blog (not /public/blog)
```

3. **Opting out of layout:**

```
app/
├── (main)/
│   ├── layout.tsx       → Has sidebar
│   └── dashboard/
│       └── page.tsx
└── (standalone)/        → No layout
    └── print/
        └── page.tsx     → Standalone page
```

---

### Q6: What are parallel routes and how do you use them?

**Answer:**
Parallel routes allow you to render multiple pages simultaneously in the same layout using slots.

**Creating Parallel Routes:**

```
app/
├── layout.tsx
├── page.tsx
├── @team/              → Slot: team
│   └── page.tsx
└── @analytics/         → Slot: analytics
    └── page.tsx
```

**Using Slots in Layout:**

```tsx
// app/layout.tsx
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode;
  team: React.ReactNode;
  analytics: React.ReactNode;
}) {
  return (
    <div>
      <div>{children}</div>
      <div className="sidebar">
        {team}
        {analytics}
      </div>
    </div>
  );
}
```

**Conditional Rendering:**

```tsx
// app/layout.tsx
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode;
  team: React.ReactNode;
  analytics: React.ReactNode;
}) {
  const user = getUser();

  return (
    <div>
      {children}
      {user.role === "admin" && team}
      {user.hasAccess && analytics}
    </div>
  );
}
```

**Real-World Example - Dashboard:**

```
app/
├── dashboard/
│   ├── layout.tsx
│   ├── @revenue/
│   │   ├── page.tsx           → Revenue chart
│   │   └── loading.tsx        → Revenue loading
│   ├── @users/
│   │   ├── page.tsx           → Users list
│   │   └── loading.tsx        → Users loading
│   └── page.tsx
```

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  revenue,
  users,
}: {
  children: React.ReactNode;
  revenue: React.ReactNode;
  users: React.ReactNode;
}) {
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid">
        <div className="revenue">{revenue}</div>
        <div className="users">{users}</div>
      </div>
      {children}
    </div>
  );
}
```

**Benefits:**

- Independent loading states
- Independent error handling
- Conditional rendering
- Complex layouts simplified

---

### Q7: What are intercepting routes?

**Answer:**
Intercepting routes allow you to load a route within the current layout while keeping the URL updated.

**Use Case - Modal:**

```
app/
├── feed/
│   ├── page.tsx
│   └── @modal/
│       ├── (..)photo/
│       │   └── [id]/
│       │       └── page.tsx    → Intercepts /photo/[id]
│       └── default.tsx
└── photo/
    └── [id]/
        └── page.tsx            → Direct access
```

**Implementation:**

```tsx
// app/feed/layout.tsx
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}

// app/feed/@modal/(..)photo/[id]/page.tsx
import Modal from "@/components/Modal";

export default function PhotoModal({ params }: { params: { id: string } }) {
  const photo = await getPhoto(params.id);

  return (
    <Modal>
      <Image src={photo.url} alt={photo.title} />
    </Modal>
  );
}

// app/photo/[id]/page.tsx
export default async function PhotoPage({ params }: { params: { id: string } }) {
  const photo = await getPhoto(params.id);

  return (
    <div>
      <Image src={photo.url} alt={photo.title} />
      <p>{photo.description}</p>
    </div>
  );
}
```

**Intercepting Conventions:**

- `(.)` - Same level
- `(..)` - One level up
- `(..)(..)` - Two levels up
- `(...)` - From root

**Real Example - Gallery:**

When user clicks photo in feed:
- Shows modal with photo (intercepted route)
- URL changes to /photo/123
- User can refresh and see full page

---

## Navigation

### Q8: How does the Link component work in Next.js?

**Answer:**
The `<Link>` component enables client-side navigation between routes.

**Basic Usage:**

```tsx
import Link from "next/link";

export default function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/blog/post-1">Blog</Link>
    </nav>
  );
}
```

**Dynamic Links:**

```tsx
// With template literal
<Link href={`/blog/${post.slug}`}>{post.title}</Link>

// With object
<Link
  href={{
    pathname: "/blog/[slug]",
    query: { slug: post.slug },
  }}
>
  {post.title}
</Link>
```

**Link Props:**

```tsx
<Link
  href="/about"
  prefetch={false}              // Disable prefetching
  scroll={false}                // Disable scroll to top
  replace                       // Replace history instead of push
  className="link"              // CSS class
>
  About
</Link>
```

**Active Link:**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav>
      <Link href="/" className={pathname === "/" ? "active" : ""}>
        Home
      </Link>
      <Link href="/about" className={pathname === "/about" ? "active" : ""}>
        About
      </Link>
    </nav>
  );
}
```

**Prefetching:**

- Links in viewport are automatically prefetched
- Only works in production
- Can be disabled with `prefetch={false}`
- Improves navigation speed

---

### Q9: How do you use the useRouter hook in Next.js App Router?

**Answer:**
The `useRouter` hook from `next/navigation` provides programmatic navigation and route information.

**Basic Usage:**

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div>
      <button onClick={() => router.push("/dashboard")}>
        Go to Dashboard
      </button>

      <button onClick={() => router.back()}>Go Back</button>

      <button onClick={() => router.forward()}>Go Forward</button>

      <button onClick={() => router.refresh()}>Refresh</button>
    </div>
  );
}
```

**Available Methods:**

```tsx
router.push("/dashboard");          // Navigate to route
router.replace("/dashboard");       // Replace current route
router.refresh();                   // Refresh current route
router.back();                      // Go back in history
router.forward();                   // Go forward in history
router.prefetch("/dashboard");      // Prefetch route
```

**With Search Params:**

```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    params.set("q", term);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <input
      type="search"
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

**Form Submission:**

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function CreatePost() {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const response = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({
        title: formData.get("title"),
        content: formData.get("content"),
      }),
    });

    if (response.ok) {
      const post = await response.json();
      router.push(`/posts/${post.id}`);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" />
      <textarea name="content" placeholder="Content" />
      <button type="submit">Create Post</button>
    </form>
  );
}
```

---

## Middleware

### Q10: What is middleware in Next.js and how do you use it?

**Answer:**
Middleware allows you to run code before a request is completed, enabling authentication, redirects, rewrites, and more.

**Basic Middleware:**

```tsx
// middleware.ts (root of project)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Run before request completes
  console.log("Middleware running for:", request.nextUrl.pathname);

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*", // Apply to /dashboard/*
};
```

**Authentication Example:**

```tsx
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  if (!token) {
    // Redirect to login if no token
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
```

**Setting Headers:**

```tsx
// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Set custom header
  response.headers.set("x-custom-header", "value");

  // Set CORS headers
  response.headers.set("Access-Control-Allow-Origin", "*");

  return response;
}
```

**Rewriting:**

```tsx
// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Rewrite /old to /new (URL stays /old)
  if (request.nextUrl.pathname === "/old") {
    return NextResponse.rewrite(new URL("/new", request.url));
  }

  return NextResponse.next();
}
```

**Multiple Matchers:**

```tsx
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
```

**Conditional Logic:**

```tsx
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Different logic for different paths
  if (pathname.startsWith("/api/")) {
    return handleAPI(request);
  }

  if (pathname.startsWith("/dashboard")) {
    return handleDashboard(request);
  }

  return NextResponse.next();
}

function handleAPI(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

function handleDashboard(request: NextRequest) {
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
```

**Use Cases:**

- Authentication
- Redirects
- Rewrites
- Bot detection
- A/B testing
- Localization
- Rate limiting
- Custom headers

---

## Summary

**Key Takeaways:**

1. **App Router vs Pages Router** - Know the differences and migration path
2. **Dynamic routes** - Single, multiple, catch-all, optional catch-all
3. **Route groups** - Organization without URL impact
4. **Parallel routes** - Multiple pages in same layout
5. **Intercepting routes** - Modals and overlays
6. **Navigation** - Link component and useRouter hook
7. **Middleware** - Run code before request completes

**Interview Tips:**

- Understand when to use each routing pattern
- Explain the benefits of App Router
- Be familiar with all dynamic route types
- Know how to implement authentication with middleware
- Practice creating complex layouts with route groups

---

**Next:** [Advanced Questions](03-advanced-questions.md)

