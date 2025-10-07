# Drizzle ORM Interview Questions

## Table of Contents

- [Drizzle Basics](#drizzle-basics)
- [Schema Definition](#schema-definition)
- [Query Building](#query-building)
- [Relations](#relations)
- [Migrations](#migrations)

---

## Drizzle Basics

### Q1: What is Drizzle ORM and why use it?

**Answer:**
Drizzle is a lightweight TypeScript ORM focused on performance and developer experience with SQL-like syntax.

**Key Features:**

- **Lightweight**: Minimal bundle size (~7KB)
- **Type-safe**: Full TypeScript support
- **SQL-like**: Familiar syntax for SQL developers
- **Edge-ready**: Works in Cloudflare Workers, Deno, Bun
- **Zero dependencies**: No runtime dependencies
- **Performance**: Minimal overhead

**Drizzle vs Prisma:**

| Feature        | Drizzle             | Prisma        |
| -------------- | ------------------- | ------------- |
| Bundle Size    | ~7KB                | ~300KB        |
| Syntax         | SQL-like            | Object-based  |
| Edge Support   | Yes                 | Limited       |
| Learning Curve | Lower (if know SQL) | Higher        |
| Tooling        | Drizzle Kit         | Prisma Studio |
| Migrations     | Code-first          | Schema-first  |

**Installation:**

```bash
npm install drizzle-orm pg
npm install -D drizzle-kit
```

**Basic Setup:**

```typescript
// db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
```

---

## Schema Definition

### Q2: How do you define schemas in Drizzle?

**Answer:**

**Basic Table:**

```typescript
import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  age: integer("age"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

**Data Types:**

```typescript
import {
  pgTable,
  serial,
  integer,
  bigint,
  text,
  varchar,
  boolean,
  timestamp,
  date,
  json,
  jsonb,
  uuid,
  real,
  doublePrecision,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom(),

  // Strings
  name: text("name").notNull(),
  description: varchar("description", { length: 500 }),

  // Numbers
  price: decimal("price", { precision: 10, scale: 2 }),
  stock: integer("stock").default(0),
  weight: real("weight"),
  rating: doublePrecision("rating"),

  // JSON
  metadata: json("metadata"),
  attributes: jsonb("attributes"),

  // Dates
  createdAt: timestamp("created_at").defaultNow(),
  publishedAt: date("published_at"),
});
```

**Enums:**

```typescript
export const statusEnum = pgEnum("status", ["draft", "published", "archived"]);

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  status: statusEnum("status").default("draft"),
});
```

**Constraints:**

```typescript
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    username: text("username").notNull(),
    age: integer("age").notNull(),
  },
  (table) => ({
    // Composite unique constraint
    usernameEmailUnique: unique().on(table.username, table.email),

    // Check constraint
    ageCheck: check("age_check", sql`${table.age} >= 18`),

    // Index
    emailIdx: index("email_idx").on(table.email),

    // Composite index
    nameAgeIdx: index("name_age_idx").on(table.username, table.age),
  })
);
```

---

## Query Building

### Q3: How do you perform CRUD operations with Drizzle?

**Answer:**

**SELECT:**

```typescript
import {
  eq,
  gt,
  gte,
  lt,
  lte,
  ne,
  and,
  or,
  like,
  ilike,
  inArray,
} from "drizzle-orm";

// Select all
const allUsers = await db.select().from(users);

// Select specific columns
const userEmails = await db
  .select({ id: users.id, email: users.email })
  .from(users);

// Where clause
const activeUsers = await db
  .select()
  .from(users)
  .where(eq(users.isActive, true));

// Multiple conditions
const result = await db
  .select()
  .from(users)
  .where(and(gte(users.age, 18), eq(users.isActive, true)));

// OR conditions
const result = await db
  .select()
  .from(users)
  .where(
    or(like(users.email, "%@gmail.com"), like(users.email, "%@yahoo.com"))
  );

// IN clause
const result = await db
  .select()
  .from(users)
  .where(inArray(users.id, [1, 2, 3]));

// Order by
const result = await db.select().from(users).orderBy(users.createdAt);

// Limit and offset
const result = await db.select().from(users).limit(10).offset(20);
```

**INSERT:**

```typescript
// Insert single
const newUser = await db
  .insert(users)
  .values({
    email: "alice@example.com",
    name: "Alice",
    age: 30,
  })
  .returning();

// Insert multiple
const newUsers = await db
  .insert(users)
  .values([
    { email: "bob@example.com", name: "Bob" },
    { email: "charlie@example.com", name: "Charlie" },
  ])
  .returning();

// Insert with on conflict
await db
  .insert(users)
  .values({ email: "test@example.com", name: "Test" })
  .onConflictDoNothing();

// Upsert
await db
  .insert(users)
  .values({ email: "test@example.com", name: "Test" })
  .onConflictDoUpdate({
    target: users.email,
    set: { name: "Updated Test" },
  });
```

**UPDATE:**

```typescript
// Update
const updated = await db
  .update(users)
  .set({ name: "Alice Smith" })
  .where(eq(users.id, 1))
  .returning();

// Update multiple rows
await db
  .update(users)
  .set({ isActive: false })
  .where(lt(users.lastLogin, new Date("2020-01-01")));

// Increment
await db
  .update(products)
  .set({ stock: sql`${products.stock} + 10` })
  .where(eq(products.id, 1));
```

**DELETE:**

```typescript
// Delete
const deleted = await db.delete(users).where(eq(users.id, 1)).returning();

// Delete multiple
await db.delete(users).where(eq(users.isActive, false));
```

---

## Relations

### Q4: How do you handle relations in Drizzle?

**Answer:**

**Define Relations:**

```typescript
import { relations } from "drizzle-orm";

// Tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  authorId: integer("author_id")
    .notNull()
    .references(() => users.id),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));
```

**Query with Relations:**

```typescript
// Query builder with joins
const result = await db
  .select({
    user: users,
    post: posts,
  })
  .from(users)
  .leftJoin(posts, eq(users.id, posts.authorId));

// Relational queries
const usersWithPosts = await db.query.users.findMany({
  with: {
    posts: true,
  },
});

// Filter nested relations
const usersWithPublishedPosts = await db.query.users.findMany({
  with: {
    posts: {
      where: eq(posts.published, true),
    },
  },
});
```

**Many-to-Many:**

```typescript
// Junction table
export const postsToCategories = pgTable(
  "posts_to_categories",
  {
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id),
  },
  (t) => ({
    pk: primaryKey(t.postId, t.categoryId),
  })
);

// Relations
export const postsRelations = relations(posts, ({ many }) => ({
  categories: many(postsToCategories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(postsToCategories),
}));

export const postsToCategoriesRelations = relations(
  postsToCategories,
  ({ one }) => ({
    post: one(posts, {
      fields: [postsToCategories.postId],
      references: [posts.id],
    }),
    category: one(categories, {
      fields: [postsToCategories.categoryId],
      references: [categories.id],
    }),
  })
);
```

---

## Migrations

### Q5: How do migrations work in Drizzle?

**Answer:**

**Configuration:**

```typescript
// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

**Generate Migrations:**

```bash
# Generate migration from schema
npx drizzle-kit generate:pg

# Push schema to database (dev)
npx drizzle-kit push:pg

# Check what will be migrated
npx drizzle-kit check:pg

# Apply migrations
npx drizzle-kit up:pg
```

**Migration Files:**

```sql
-- Generated migration file
CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY NOT NULL,
  "email" text NOT NULL,
  "name" text NOT NULL,
  "created_at" timestamp DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");
```

**Custom Migrations:**

```typescript
// Custom migration
import { sql } from "drizzle-orm";
import { db } from "./db";

export async function customMigration() {
  await db.execute(sql`
    UPDATE users 
    SET status = 'active' 
    WHERE is_active = true
  `);
}
```

**Raw SQL:**

```typescript
import { sql } from "drizzle-orm";

// Execute raw SQL
await db.execute(sql`
  CREATE INDEX CONCURRENTLY idx_users_email 
  ON users(email)
`);

// With parameters
await db.execute(sql`
  UPDATE users 
  SET name = ${name} 
  WHERE id = ${id}
`);
```

---

This covers Drizzle ORM fundamentals. Practice building applications to master these concepts!
