# Prisma Interview Questions

## Table of Contents

- [Prisma Basics](#prisma-basics)
- [Schema and Models](#schema-and-models)
- [CRUD Operations](#crud-operations)
- [Relations](#relations)
- [Advanced Queries](#advanced-queries)
- [Migrations](#migrations)

---

## Prisma Basics

### Q1: What is Prisma and why use it?

**Answer:**
Prisma is a next-generation Node.js and TypeScript ORM that provides type-safe database access.

**Key Features:**

- **Type Safety**: Auto-generated TypeScript types
- **Auto-completion**: IntelliSense support
- **Database Agnostic**: Works with PostgreSQL, MySQL, SQLite, SQL Server, MongoDB
- **Prisma Studio**: Visual database browser
- **Migrations**: Database schema migrations
- **Intuitive API**: Clean and predictable queries

**Prisma Components:**

1. **Prisma Client**: Auto-generated query builder
2. **Prisma Migrate**: Database migration system
3. **Prisma Studio**: GUI for database
4. **Prisma Schema**: Data model definition

**Installation:**

```bash
npm install prisma @prisma/client
npx prisma init
```

**Basic Setup:**

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

```javascript
// Usage
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const users = await prisma.user.findMany();
```

---

## Schema and Models

### Q2: How do you define models in Prisma?

**Answer:**

**Basic Model:**

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Field Types:**

```prisma
model Product {
  // Scalar types
  id          Int       @id @default(autoincrement())
  name        String
  price       Decimal
  stock       Int
  isActive    Boolean   @default(true)

  // Date types
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  publishedAt DateTime?

  // Optional fields
  description String?
  imageUrl    String?

  // Enums
  status      Status    @default(DRAFT)
}

enum Status {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

**Field Attributes:**

```prisma
model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  username String @unique @db.VarChar(50)
  age      Int    @default(0)

  // Composite unique constraint
  @@unique([email, username])

  // Index
  @@index([email])

  // Composite index
  @@index([name, city])

  // Table name mapping
  @@map("users")
}
```

---

## CRUD Operations

### Q3: How do you perform CRUD operations with Prisma?

**Answer:**

**CREATE:**

```javascript
// Create single record
const user = await prisma.user.create({
  data: {
    email: "alice@example.com",
    name: "Alice",
  },
});

// Create many
const users = await prisma.user.createMany({
  data: [
    { email: "bob@example.com", name: "Bob" },
    { email: "charlie@example.com", name: "Charlie" },
  ],
  skipDuplicates: true, // Skip duplicate emails
});

// Create with relations
const user = await prisma.user.create({
  data: {
    email: "david@example.com",
    name: "David",
    posts: {
      create: [{ title: "First Post" }, { title: "Second Post" }],
    },
  },
});
```

**READ:**

```javascript
// Find all
const users = await prisma.user.findMany();

// Find with where clause
const activeUsers = await prisma.user.findMany({
  where: {
    isActive: true,
    age: { gte: 18 },
  },
});

// Find unique
const user = await prisma.user.findUnique({
  where: { email: "alice@example.com" },
});

// Find first
const user = await prisma.user.findFirst({
  where: { age: { gte: 18 } },
  orderBy: { createdAt: "desc" },
});

// Select specific fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    name: true,
  },
});

// Pagination
const users = await prisma.user.findMany({
  skip: 20,
  take: 10,
  orderBy: { id: "asc" },
});
```

**UPDATE:**

```javascript
// Update single record
const user = await prisma.user.update({
  where: { id: 1 },
  data: { name: "Alice Smith" },
});

// Update many
const updateResult = await prisma.user.updateMany({
  where: { isActive: false },
  data: { status: "INACTIVE" },
});

// Upsert (update or create)
const user = await prisma.user.upsert({
  where: { email: "alice@example.com" },
  update: { name: "Alice Updated" },
  create: {
    email: "alice@example.com",
    name: "Alice New",
  },
});

// Increment/decrement
const product = await prisma.product.update({
  where: { id: 1 },
  data: {
    stock: { increment: 10 },
    views: { increment: 1 },
  },
});
```

**DELETE:**

```javascript
// Delete single record
const user = await prisma.user.delete({
  where: { id: 1 },
});

// Delete many
const deleteResult = await prisma.user.deleteMany({
  where: {
    createdAt: { lt: new Date("2020-01-01") },
  },
});

// Delete all
await prisma.user.deleteMany({});
```

---

## Relations

### Q4: How do you define and query relations in Prisma?

**Answer:**

**One-to-One:**

```prisma
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  profile Profile?
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  user   User   @relation(fields: [userId], references: [id])
  userId Int    @unique
}
```

```javascript
// Create with relation
const user = await prisma.user.create({
  data: {
    email: "alice@example.com",
    profile: {
      create: { bio: "Hello!" },
    },
  },
  include: { profile: true },
});
```

**One-to-Many:**

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
}
```

```javascript
// Query with relation
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: "desc" },
    },
  },
});

// Select nested fields
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    name: true,
    posts: {
      select: {
        title: true,
        createdAt: true,
      },
    },
  },
});
```

**Many-to-Many:**

```prisma
model Post {
  id         Int        @id @default(autoincrement())
  title      String
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String
  posts Post[]
}
```

```javascript
// Create with many-to-many
const post = await prisma.post.create({
  data: {
    title: "My Post",
    categories: {
      connect: [{ id: 1 }, { id: 2 }],
    },
  },
});

// Query many-to-many
const category = await prisma.category.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      include: { author: true },
    },
  },
});
```

---

## Advanced Queries

### Q5: What are advanced Prisma features?

**Answer:**

**Transactions:**

```javascript
// Interactive transactions
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: "test@example.com" },
  });

  const profile = await tx.profile.create({
    data: { userId: user.id, bio: "Hello" },
  });

  return { user, profile };
});

// Sequential operations
const [users, posts] = await prisma.$transaction([
  prisma.user.findMany(),
  prisma.post.findMany(),
]);
```

**Raw Queries:**

```javascript
// Raw SQL query
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE age > ${18}
`;

// Execute raw SQL
await prisma.$executeRaw`
  UPDATE users SET updated_at = NOW() WHERE id = ${1}
`;

// Unsafe (for dynamic queries)
const users = await prisma.$queryRawUnsafe(
  "SELECT * FROM users WHERE email = ?",
  email
);
```

**Aggregations:**

```javascript
// Count
const count = await prisma.user.count({
  where: { isActive: true },
});

// Aggregate
const result = await prisma.order.aggregate({
  _sum: { amount: true },
  _avg: { amount: true },
  _max: { amount: true },
  _min: { amount: true },
  _count: true,
  where: { status: "COMPLETED" },
});

// Group by
const result = await prisma.order.groupBy({
  by: ["status"],
  _sum: { amount: true },
  _count: true,
  having: {
    amount: { _sum: { gt: 1000 } },
  },
});
```

**Filtering:**

```javascript
// Complex where conditions
const users = await prisma.user.findMany({
  where: {
    OR: [
      { email: { contains: "@gmail.com" } },
      { email: { contains: "@yahoo.com" } },
    ],
    AND: [{ age: { gte: 18 } }, { isActive: true }],
    NOT: {
      status: "BANNED",
    },
  },
});

// Relation filters
const users = await prisma.user.findMany({
  where: {
    posts: {
      some: {
        published: true,
        views: { gt: 100 },
      },
    },
  },
});
```

---

## Migrations

### Q6: How do migrations work in Prisma?

**Answer:**

**Development Workflow:**

```bash
# Create migration
npx prisma migrate dev --name add-user-profile

# Apply pending migrations
npx prisma migrate dev

# Reset database (dev only)
npx prisma migrate reset
```

**Production Workflow:**

```bash
# Deploy migrations
npx prisma migrate deploy

# Check migration status
npx prisma migrate status
```

**Schema Changes:**

```prisma
// 1. Update schema
model User {
  id       Int     @id @default(autoincrement())
  email    String  @unique
  name     String
  age      Int?    // Add new field
  isActive Boolean @default(true)  // Add with default
}

// 2. Create migration
// npx prisma migrate dev --name add-user-fields

// 3. Prisma generates SQL
// CREATE TABLE IF NOT EXISTS "User" ...
// ALTER TABLE "User" ADD COLUMN "age" INTEGER;
// ALTER TABLE "User" ADD COLUMN "isActive" BOOLEAN DEFAULT true;
```

**Data Migrations:**

```prisma
// Sometimes need custom SQL for data migration
```

```bash
# Create empty migration
npx prisma migrate dev --create-only --name custom-migration

# Edit generated SQL file to add custom logic
# migrations/xxx_custom_migration/migration.sql
```

```sql
-- Custom migration
UPDATE users SET status = 'ACTIVE' WHERE is_active = true;
UPDATE users SET status = 'INACTIVE' WHERE is_active = false;
ALTER TABLE users DROP COLUMN is_active;
```

---

This covers Prisma fundamentals. Practice building applications with Prisma to master these concepts!
