# Go Packages, Modules & Project Structure

## Table of Contents

1. [Packages](#packages)
2. [Modules](#modules)
3. [go.mod File](#gomod-file)
4. [go.sum File](#gosum-file)
5. [Project Structure](#project-structure)
6. [Import Paths](#import-paths)
7. [Internal Packages](#internal-packages)
8. [Vendor Directory](#vendor-directory)
9. [Best Practices](#best-practices)

---

## Packages

### What is a Package?

A package is a collection of Go source files in the same directory that are compiled together. Packages are the basic building blocks for organizing and reusing code in Go.

### Key Concepts

**1. Package Declaration**
Every Go file must start with a package declaration:

```go
package main  // executable package
// or
package utils // library package
```

**2. Main Package**

- `package main` is special - it defines an executable program
- Must contain a `main()` function which is the entry point
- Other packages are libraries

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

**3. Package Naming Conventions**

- Use short, lowercase, single-word names
- No underscores or mixedCaps
- Match the directory name (usually)
- Examples: `fmt`, `http`, `json`, `utils`

**4. Visibility Rules**
Go uses capitalization to determine visibility:

```go
package mypackage

// Public - exported (accessible outside package)
type User struct {
    Name string // exported field
    age  int    // unexported field
}

// Public function
func NewUser(name string, age int) *User {
    return &User{Name: name, age: age}
}

// Private function (only accessible within package)
func validateAge(age int) bool {
    return age > 0
}
```

**5. Package Initialization**
Use `init()` functions for package initialization:

```go
package config

import "fmt"

var Config map[string]string

func init() {
    fmt.Println("Initializing config package")
    Config = make(map[string]string)
}

// Multiple init functions are allowed and execute in order
func init() {
    Config["version"] = "1.0.0"
}
```

---

## Modules

### What is a Module?

A module is a collection of related Go packages that are versioned together as a single unit. Introduced in Go 1.11, modules are the official dependency management system.

### Creating a Module

**1. Initialize a new module:**

```bash
go mod init github.com/username/projectname
```

This creates a `go.mod` file:

```go
module github.com/username/projectname

go 1.21
```

**2. Module Path**
The module path is the import prefix for all packages in the module:

- Usually matches your repository URL
- Examples:
  - `github.com/username/repo`
  - `gitlab.com/company/project`
  - `example.com/myproject` (for custom domains)

### Module Commands

```bash
# Initialize a new module
go mod init <module-path>

# Add missing dependencies and remove unused ones
go mod tidy

# Download dependencies to local cache
go mod download

# Copy dependencies to vendor directory
go mod vendor

# Verify dependencies
go mod verify

# Show why packages or modules are needed
go mod why <package>

# Show module dependency graph
go mod graph

# Edit go.mod from tools or scripts
go mod edit
```

---

## go.mod File

### Structure

```go
module github.com/username/myproject

go 1.21

require (
    github.com/gin-gonic/gin v1.9.1
    github.com/lib/pq v1.10.9
    golang.org/x/crypto v0.14.0
)

require (
    // Indirect dependencies (automatically managed)
    github.com/bytedance/sonic v1.9.1 // indirect
    github.com/chenzhuoyu/base64x v0.0.0-20221115062448-fe3a3abad311 // indirect
)

replace github.com/old/package => github.com/new/package v1.2.3

exclude github.com/problematic/package v1.0.0
```

### Directives Explained

**1. module**
Declares the module path:

```go
module github.com/username/myproject
```

**2. go**
Specifies the minimum Go version:

```go
go 1.21
```

**3. require**
Lists dependencies with versions:

```go
require (
    github.com/gin-gonic/gin v1.9.1
    github.com/lib/pq v1.10.9
)
```

**4. replace**
Replaces a dependency with another version or local path:

```go
// Replace with different repository
replace github.com/old/pkg => github.com/new/pkg v1.2.3

// Replace with local directory (useful for development)
replace github.com/myorg/mypackage => ../mypackage
```

**5. exclude**
Prevents a specific version from being used:

```go
exclude github.com/problematic/package v1.0.0
```

### Semantic Versioning

Go modules use semantic versioning (semver):

- `v1.2.3` - Major.Minor.Patch
- `v0.x.x` - Pre-1.0 (API may change)
- `v2.0.0+` - Major version in import path

```go
// Major version 0 or 1
import "github.com/user/repo"

// Major version 2+
import "github.com/user/repo/v2"
import "github.com/user/repo/v3"
```

---

## go.sum File

### What is go.sum?

The `go.sum` file contains cryptographic checksums of module dependencies to ensure integrity.

### Example go.sum

```
github.com/gin-gonic/gin v1.9.1 h1:4idEAncQnU5cB7BeOkPtxjfCSye0AAm1R0RVIqJ+Jmg=
github.com/gin-gonic/gin v1.9.1/go.mod h1:hPrL7YrpYKXt5YId3A/Tnip5kqbEAP+KLuI3SUcPTeU=
```

### Important Notes

- **Never edit manually**
- **Commit to version control** (unlike package-lock.json which some skip)
- Used to verify dependencies haven't been tampered with
- Each line contains module path, version, and SHA-256 hash

---

## Project Structure

### Small Project Structure

```
myproject/
├── go.mod
├── go.sum
├── main.go
├── README.md
└── utils.go
```

### Medium Project Structure

```
myproject/
├── go.mod
├── go.sum
├── README.md
├── main.go
├── config/
│   ├── config.go
│   └── database.go
├── models/
│   ├── user.go
│   └── product.go
├── handlers/
│   ├── user_handler.go
│   └── product_handler.go
└── utils/
    ├── logger.go
    └── validator.go
```

### Large Project Structure (Standard Layout)

```
myproject/
├── go.mod
├── go.sum
├── README.md
├── Makefile
├── .gitignore
│
├── cmd/                          # Main applications
│   ├── server/
│   │   └── main.go
│   └── cli/
│       └── main.go
│
├── internal/                     # Private application code
│   ├── app/
│   │   ├── app.go
│   │   └── routes.go
│   ├── config/
│   │   └── config.go
│   ├── handlers/
│   │   ├── user.go
│   │   └── product.go
│   ├── models/
│   │   ├── user.go
│   │   └── product.go
│   ├── repository/
│   │   ├── user_repo.go
│   │   └── product_repo.go
│   └── service/
│       ├── user_service.go
│       └── product_service.go
│
├── pkg/                          # Public libraries
│   ├── logger/
│   │   └── logger.go
│   └── validator/
│       └── validator.go
│
├── api/                          # API definitions
│   ├── openapi.yaml
│   └── proto/
│       └── service.proto
│
├── web/                          # Web assets
│   ├── static/
│   │   ├── css/
│   │   └── js/
│   └── templates/
│       └── index.html
│
├── scripts/                      # Build and other scripts
│   ├── build.sh
│   └── deploy.sh
│
├── configs/                      # Configuration files
│   ├── config.yaml
│   └── config.dev.yaml
│
├── deployments/                  # Deployment configs
│   ├── docker/
│   │   └── Dockerfile
│   └── kubernetes/
│       └── deployment.yaml
│
├── docs/                         # Documentation
│   └── architecture.md
│
├── test/                         # Additional test files
│   └── integration/
│       └── api_test.go
│
└── vendor/                       # Vendored dependencies (optional)
```

### Directory Explanations

**`/cmd`**

- Contains main applications for the project
- Each subdirectory is a separate executable
- Keep main.go small - import and call code from `/internal` and `/pkg`

```go
// cmd/server/main.go
package main

import (
    "log"
    "myproject/internal/app"
)

func main() {
    if err := app.Run(); err != nil {
        log.Fatal(err)
    }
}
```

**`/internal`**

- Private application and library code
- **Cannot be imported by external projects** (Go enforces this)
- Put code here that you don't want others to import

**`/pkg`**

- Library code that's ok for external applications to use
- Other projects can import these packages
- Use cautiously - `internal/` is often better

**`/api`**

- API definition files
- OpenAPI/Swagger specs
- Protocol buffer files
- JSON schema files

**`/web`**

- Web application specific components
- Static assets (CSS, JS, images)
- Templates

**`/configs`**

- Configuration file templates
- Default configs

**`/scripts`**

- Scripts for build, install, analysis, etc.
- Keep Makefile small and simple

**`/deployments`**

- IaaS, PaaS, system, and container orchestration configs
- Docker, Kubernetes, etc.

**`/test`**

- Additional external test apps and test data
- Go allows test files alongside code (`*_test.go`)

---

## Import Paths

### Local Package Imports

```go
// If module is github.com/username/myproject
package main

import (
    "github.com/username/myproject/internal/models"
    "github.com/username/myproject/internal/handlers"
    "github.com/username/myproject/pkg/logger"
)
```

### Import Styles

```go
// Standard import
import "fmt"

// Aliased import
import f "fmt"

// Blank import (runs init() only)
import _ "github.com/lib/pq"

// Dot import (not recommended - imports into current namespace)
import . "fmt"
// Can now use: Println() instead of fmt.Println()

// Grouped imports (conventional)
import (
    // Standard library
    "fmt"
    "net/http"

    // External packages
    "github.com/gin-gonic/gin"

    // Internal packages
    "myproject/internal/models"
)
```

---

## Internal Packages

### The `/internal` Directory

Go has special handling for directories named `internal`:

```
myproject/
├── go.mod (module: github.com/user/myproject)
└── internal/
    └── auth/
        └── auth.go
```

**Rules:**

- Code in `internal/` can only be imported by code in the same module
- Subdirectories can be nested anywhere
- Provides true encapsulation

**Example:**

```go
// ✅ Allowed: same module
// File: github.com/user/myproject/cmd/main.go
import "github.com/user/myproject/internal/auth"

// ❌ Forbidden: external module
// File: github.com/someone/otherproject/main.go
import "github.com/user/myproject/internal/auth" // Compile error!
```

---

## Vendor Directory

### What is Vendoring?

Vendoring copies all dependencies into a `/vendor` directory in your project.

### When to Use Vendor

- **CI/CD pipelines** - faster builds, no network calls
- **Air-gapped environments** - no internet access
- **Ensuring reproducibility** - dependencies can't disappear

### How to Vendor

```bash
# Create/update vendor directory
go mod vendor

# Build using vendor
go build -mod=vendor

# Clean vendor
rm -rf vendor/
```

### Vendor Directory Structure

```
myproject/
├── go.mod
├── go.sum
├── vendor/
│   ├── github.com/
│   │   └── gin-gonic/
│   │       └── gin/
│   ├── golang.org/
│   │   └── x/
│   │       └── crypto/
│   └── modules.txt    # List of vendored modules
└── main.go
```

---

## Best Practices

### 1. Module Naming

```bash
# ✅ Good
go mod init github.com/username/projectname

# ✅ Good (company domain)
go mod init company.com/team/project

# ❌ Avoid
go mod init myproject  # Not fully qualified
```

### 2. Package Organization

```go
// ✅ Good - small, focused packages
myproject/
├── user/
│   ├── user.go
│   ├── repository.go
│   └── service.go

// ❌ Avoid - generic names
myproject/
├── models/    # Too generic
├── utils/     # Becomes dumping ground
└── helpers/   # Vague purpose
```

### 3. Avoid Circular Dependencies

```go
// ❌ Bad - circular dependency
// package A imports B
// package B imports A

// ✅ Good - introduce a third package
// package A imports C
// package B imports C
// package C has no dependencies on A or B
```

### 4. Use Internal Packages

```go
// ✅ Protect internal implementation
myproject/
├── internal/          # Private implementation
│   └── database/
└── pkg/              # Public API
    └── client/
```

### 5. Keep main.go Minimal

```go
// ✅ Good
package main

import "myproject/internal/app"

func main() {
    app.Run()
}

// ❌ Avoid putting business logic in main.go
```

### 6. Version Management

```bash
# Update all dependencies
go get -u ./...

# Update specific dependency
go get -u github.com/gin-gonic/gin

# Get specific version
go get github.com/gin-gonic/gin@v1.9.1

# Use latest commit from branch
go get github.com/user/repo@master

# Use specific commit
go get github.com/user/repo@abc1234
```

### 7. Clean Up Regularly

```bash
# Remove unused dependencies
go mod tidy

# Check for module changes needed
go mod verify
```

### 8. Documentation

```go
// ✅ Good - document exported items
package user

// User represents a user in the system.
// All exported fields are persisted to the database.
type User struct {
    ID   int
    Name string
}

// New creates a new User with the given name.
// It returns an error if the name is empty.
func New(name string) (*User, error) {
    if name == "" {
        return nil, errors.New("name cannot be empty")
    }
    return &User{Name: name}, nil
}
```

---

## Common Patterns

### 1. Repository Pattern

```
internal/
├── models/
│   └── user.go          # Data structures
├── repository/
│   └── user_repo.go     # Data access
└── service/
    └── user_service.go  # Business logic
```

### 2. Dependency Injection

```go
// internal/app/app.go
type App struct {
    userService *service.UserService
    config      *config.Config
}

func New(cfg *config.Config) *App {
    repo := repository.NewUserRepository(cfg.DB)
    svc := service.NewUserService(repo)

    return &App{
        userService: svc,
        config:      cfg,
    }
}
```

### 3. Configuration Package

```go
// internal/config/config.go
package config

import (
    "os"
)

type Config struct {
    Port       string
    DBHost     string
    DBPort     string
}

func Load() (*Config, error) {
    return &Config{
        Port:   getEnv("PORT", "8080"),
        DBHost: getEnv("DB_HOST", "localhost"),
        DBPort: getEnv("DB_PORT", "5432"),
    }, nil
}

func getEnv(key, fallback string) string {
    if value := os.Getenv(key); value != "" {
        return value
    }
    return fallback
}
```

---

## Quick Reference

### Common Commands

```bash
# Create new module
go mod init <module-path>

# Add dependencies
go get <package>

# Update dependencies
go get -u <package>

# Clean up
go mod tidy

# Vendor dependencies
go mod vendor

# List modules
go list -m all

# Show module info
go list -m -json <module>
```

### Package Import Rules

1. Standard library first
2. External packages second
3. Internal packages last
4. Blank line between groups
5. Alphabetically sorted within groups

```go
import (
    "fmt"
    "net/http"

    "github.com/gin-gonic/gin"
    "github.com/lib/pq"

    "myproject/internal/config"
    "myproject/internal/models"
)
```

---

## Additional Resources

- [Official Go Modules Reference](https://go.dev/ref/mod)
- [Standard Go Project Layout](https://github.com/golang-standards/project-layout)
- [Go Package Discovery](https://pkg.go.dev/)
- [Effective Go](https://go.dev/doc/effective_go)
- [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)

