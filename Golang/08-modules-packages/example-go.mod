// This is an example go.mod file
// Demonstrates various directives and patterns
//
// To create a real go.mod file, run:
//   go mod init github.com/username/projectname

module github.com/username/myproject

// Specifies minimum Go version required
go 1.21

// Direct dependencies - explicitly imported in your code
require (
	github.com/gin-gonic/gin v1.9.1
	github.com/lib/pq v1.10.9
	golang.org/x/crypto v0.14.0
	github.com/joho/godotenv v1.5.1
	github.com/google/uuid v1.4.0
)

// Indirect dependencies - required by your direct dependencies
// These are automatically managed by `go mod tidy`
require (
	github.com/bytedance/sonic v1.9.1 // indirect
	github.com/chenzhuoyu/base64x v0.0.0-20221115062448-fe3a3abad311 // indirect
	github.com/gabriel-vasile/mimetype v1.4.2 // indirect
	github.com/gin-contrib/sse v0.1.0 // indirect
	github.com/go-playground/locales v0.14.1 // indirect
	github.com/go-playground/universal-translator v0.18.1 // indirect
	github.com/go-playground/validator/v10 v10.14.0 // indirect
	github.com/goccy/go-json v0.10.2 // indirect
	github.com/json-iterator/go v1.1.12 // indirect
	github.com/klauspost/cpuid/v2 v2.2.4 // indirect
	github.com/leodido/go-urn v1.2.4 // indirect
	github.com/mattn/go-isatty v0.0.19 // indirect
	github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd // indirect
	github.com/modern-go/reflect2 v1.0.2 // indirect
	github.com/pelletier/go-toml/v2 v2.0.8 // indirect
	github.com/twitchyliquid64/golang-asm v0.15.1 // indirect
	github.com/ugorji/go/codec v1.2.11 // indirect
	golang.org/x/arch v0.3.0 // indirect
	golang.org/x/net v0.10.0 // indirect
	golang.org/x/sys v0.8.0 // indirect
	golang.org/x/text v0.9.0 // indirect
	google.golang.org/protobuf v1.30.0 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
)

// ============================================================================
// REPLACE DIRECTIVE
// ============================================================================
// Use replace to substitute dependencies with:
// 1. Different versions
// 2. Forked versions
// 3. Local versions (for development)

// Example 1: Replace with a forked version
// replace github.com/original/package => github.com/your-fork/package v1.2.3

// Example 2: Replace with local version (great for development)
// replace github.com/your-org/shared-lib => ../shared-lib

// Example 3: Replace specific version with another
// replace github.com/old/package v1.0.0 => github.com/new/package v2.0.0

// Example 4: Fix a security issue by using a patched fork
// replace github.com/vulnerable/package => github.com/secure-fork/package v1.2.4

// ============================================================================
// EXCLUDE DIRECTIVE
// ============================================================================
// Use exclude to prevent specific versions from being used
// (Usually because of bugs or vulnerabilities)

// Example: Exclude a broken version
// exclude github.com/problematic/package v1.2.0

// Example: Exclude multiple versions
// exclude (
//     github.com/broken/package v1.0.0
//     github.com/broken/package v1.0.1
// )

// ============================================================================
// RETRACT DIRECTIVE
// ============================================================================
// Use retract in your own module to indicate that certain versions
// should not be used (if you're the module author)

// Example: Retract a version with critical bug
// retract v1.0.0 // Critical security vulnerability

// Example: Retract a range
// retract [v1.0.0, v1.2.0] // Broken versions

// ============================================================================
// COMMON go.mod PATTERNS
// ============================================================================

/*
PATTERN 1: Microservices with shared library

mycompany/
├── shared-lib/
│   └── go.mod (module: github.com/mycompany/shared-lib)
├── service-a/
│   └── go.mod (module: github.com/mycompany/service-a)
│       require github.com/mycompany/shared-lib v1.0.0
└── service-b/
    └── go.mod (module: github.com/mycompany/service-b)
        require github.com/mycompany/shared-lib v1.0.0

During development, use replace:
  replace github.com/mycompany/shared-lib => ../shared-lib
*/

/*
PATTERN 2: Monorepo with multiple modules

myproject/
├── go.mod (module: github.com/mycompany/myproject)
├── api/
│   └── go.mod (module: github.com/mycompany/myproject/api)
├── worker/
│   └── go.mod (module: github.com/mycompany/myproject/worker)
└── shared/
    └── go.mod (module: github.com/mycompany/myproject/shared)
*/

/*
PATTERN 3: Major version in path (v2+)

For versions 2.0.0 and above, include version in module path:

go.mod:
  module github.com/username/myproject/v2
  go 1.21

Import in code:
  import "github.com/username/myproject/v2"
  import "github.com/username/myproject/v2/subpackage"

This allows users to import both v1 and v2 in the same project:
  import (
      v1 "github.com/username/myproject"
      v2 "github.com/username/myproject/v2"
  )
*/

// ============================================================================
// USEFUL COMMANDS
// ============================================================================

/*
# Initialize new module
go mod init github.com/username/projectname

# Add missing dependencies, remove unused ones
go mod tidy

# Download dependencies to local cache (~/.cache/go-build)
go mod download

# Copy dependencies to vendor/ directory
go mod vendor

# Verify dependencies haven't been modified
go mod verify

# Explain why packages or modules are needed
go mod why github.com/some/package

# Show module dependency graph
go mod graph

# List all modules
go list -m all

# List available versions of a module
go list -m -versions github.com/gin-gonic/gin

# Get specific version
go get github.com/gin-gonic/gin@v1.9.1

# Get latest version
go get -u github.com/gin-gonic/gin

# Get latest minor/patch within major version
go get -u=patch github.com/gin-gonic/gin

# Update all dependencies
go get -u ./...

# Add dependency
go get github.com/new/package

# Remove dependency (then run go mod tidy)
# Just remove the import from your code and run:
go mod tidy
*/

// ============================================================================
// VERSION FORMATS
// ============================================================================

/*
Semantic versioning: vMAJOR.MINOR.PATCH

v1.2.3          - Specific version
v1.2            - Equivalent to v1.2.0
v1              - Not allowed, must be explicit
v0.0.0          - Initial development
latest          - Not a version format, but used in commands

Pseudo-versions (for commits without tags):
v0.0.0-20191109021931-daa7c04131f5
  ├─ Base version
  ├─ Timestamp (YYYYMMDDHHMMSS)
  └─ Commit hash (first 12 chars)

Commit hash:
@abc1234        - Specific commit

Branch:
@main           - Latest on main branch
@develop        - Latest on develop branch
*/

// ============================================================================
// MINIMAL vs COMPLETE go.mod
// ============================================================================

/*
MINIMAL go.mod (just created):
  module github.com/username/myproject
  go 1.21

AFTER go mod tidy (with dependencies):
  module github.com/username/myproject
  go 1.21
  
  require (
      github.com/gin-gonic/gin v1.9.1
  )
  
  require (
      github.com/bytedance/sonic v1.9.1 // indirect
      // ... more indirect dependencies
  )

The two require blocks separate direct vs indirect dependencies.
*/

// ============================================================================
// go.mod vs go.sum
// ============================================================================

/*
go.mod:
  - Declares module path and dependencies
  - Human-readable
  - Can be edited manually (carefully)
  - Defines requirements

go.sum:
  - Contains cryptographic checksums
  - Machine-generated
  - Should NEVER be edited manually
  - Verifies integrity

Both files should be committed to version control!
*/

// ============================================================================
// TROUBLESHOOTING
// ============================================================================

/*
Problem: Dependency conflicts
Solution:
  go get package@version  # Get specific version
  go mod tidy            # Clean up

Problem: "module not found" error
Solution:
  GOPROXY=https://proxy.golang.org,direct go get package
  
Problem: Outdated dependencies
Solution:
  go get -u ./...        # Update all
  go mod tidy

Problem: Can't download private repos
Solution:
  # Configure Git to use SSH instead of HTTPS
  git config --global url."git@github.com:".insteadOf "https://github.com/"
  
  # Or use GOPRIVATE
  export GOPRIVATE=github.com/yourcompany/*

Problem: Vendor directory out of sync
Solution:
  rm -rf vendor/
  go mod vendor
*/


