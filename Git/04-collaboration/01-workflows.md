# Git Collaboration - Workflows

## GitHub Flow

### Simple workflow for continuous deployment

**Branches:**

- `main` - Always deployable
- Feature branches off main

**Workflow:**

```bash
# 1. Create feature branch
git checkout main
git pull origin main
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "Add new feature"

# 3. Push regularly
git push -u origin feature/new-feature

# 4. Open pull request

# 5. Discuss and review

# 6. Deploy from feature branch to test

# 7. Merge to main when ready
# (via GitHub interface)

# 8. Delete feature branch
git checkout main
git pull origin main
git branch -d feature/new-feature
git push origin --delete feature/new-feature
```

**Best for:**

- Continuous deployment
- Small teams
- Web applications
- Fast iteration

## Git Flow

### Complex workflow with multiple branch types

**Permanent branches:**

- `main` (or `master`) - Production code
- `develop` - Integration branch

**Temporary branches:**

- `feature/*` - New features
- `release/*` - Release preparation
- `hotfix/*` - Production fixes

**Workflow:**

### Feature development

```bash
# Start feature from develop
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# Work on feature
git add .
git commit -m "Implement login"

# Push feature branch
git push -u origin feature/user-authentication

# Create pull request to develop

# After approval, merge to develop
git checkout develop
git merge --no-ff feature/user-authentication
git push origin develop

# Delete feature branch
git branch -d feature/user-authentication
git push origin --delete feature/user-authentication
```

### Release process

```bash
# Create release branch from develop
git checkout develop
git checkout -b release/v1.2.0

# Prepare release (version bump, docs, etc.)
git commit -am "Bump version to 1.2.0"

# Test release branch

# Merge to main
git checkout main
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Version 1.2.0"
git push origin main --tags

# Merge back to develop
git checkout develop
git merge --no-ff release/v1.2.0
git push origin develop

# Delete release branch
git branch -d release/v1.2.0
git push origin --delete release/v1.2.0
```

### Hotfix process

```bash
# Create hotfix from main
git checkout main
git checkout -b hotfix/security-patch

# Fix critical issue
git commit -am "Fix security vulnerability"

# Merge to main
git checkout main
git merge --no-ff hotfix/security-patch
git tag -a v1.2.1 -m "Hotfix 1.2.1"
git push origin main --tags

# Merge to develop
git checkout develop
git merge --no-ff hotfix/security-patch
git push origin develop

# Delete hotfix branch
git branch -d hotfix/security-patch
git push origin --delete hotfix/security-patch
```

**Best for:**

- Scheduled releases
- Multiple versions in production
- Large teams
- Enterprise software

## GitLab Flow

### Environment-based workflow

**Branches:**

- `main` - Development
- `pre-production` - Staging
- `production` - Live

**Workflow:**

```bash
# 1. Feature development on main
git checkout main
git pull origin main
git checkout -b feature/new-feature

# 2. Work and push
git commit -am "Add feature"
git push -u origin feature/new-feature

# 3. Merge request to main

# 4. After approval, merge to main
# Automatically deploys to development environment

# 5. Create MR from main to pre-production
# Test in staging

# 6. Create MR from pre-production to production
# Deploy to live

# 7. Hotfix on production
git checkout production
git checkout -b hotfix/critical-fix
git commit -am "Fix critical bug"
# MR to production, then cherry-pick to other branches
```

**Best for:**

- Multiple environments
- GitLab users
- Continuous delivery
- Quality gates

## Trunk-Based Development

### Single branch with short-lived feature branches

**Workflow:**

```bash
# 1. Create short-lived branch
git checkout main
git pull origin main
git checkout -b feature/small-change

# 2. Make small, focused changes
git commit -am "Add small feature"

# 3. Push and create PR quickly
git push -u origin feature/small-change

# 4. Quick review and merge (same day)
git checkout main
git pull origin main

# 5. Delete branch immediately
git branch -d feature/small-change

# Integration is frequent (multiple times per day)
# Features behind feature flags if incomplete
```

**Feature flags example:**

```javascript
// Enable incomplete features conditionally
if (featureFlags.newUI) {
  // New UI code
} else {
  // Old UI code
}
```

**Best for:**

- Continuous integration
- Large teams with good practices
- High-velocity development
- Experienced teams

## Forking Workflow

### Each developer has own remote copy

**Setup:**

```bash
# 1. Fork repository on GitHub/GitLab

# 2. Clone your fork
git clone https://github.com/yourname/repository.git
cd repository

# 3. Add upstream remote
git remote add upstream https://github.com/original/repository.git

# 4. Verify remotes
git remote -v
# origin    https://github.com/yourname/repository.git (fetch)
# origin    https://github.com/yourname/repository.git (push)
# upstream  https://github.com/original/repository.git (fetch)
# upstream  https://github.com/original/repository.git (push)
```

**Workflow:**

```bash
# 1. Sync with upstream
git checkout main
git fetch upstream
git merge upstream/main
git push origin main

# 2. Create feature branch
git checkout -b feature/new-feature

# 3. Make changes
git commit -am "Add feature"

# 4. Push to your fork
git push origin feature/new-feature

# 5. Create pull request from your fork to upstream

# 6. After merge, sync again
git checkout main
git fetch upstream
git merge upstream/main
git branch -d feature/new-feature
git push origin main
```

**Best for:**

- Open source projects
- External contributors
- Projects with many contributors
- Organizations with access control

## Release Workflow

### Managing versions and releases

**Semantic Versioning:**

```
MAJOR.MINOR.PATCH
1.2.3

MAJOR: Breaking changes
MINOR: New features (backward compatible)
PATCH: Bug fixes
```

**Release workflow:**

```bash
# 1. Prepare release
git checkout -b release/v1.2.0 develop

# 2. Update version numbers
# Edit package.json, version files, etc.
git commit -am "Bump version to 1.2.0"

# 3. Update CHANGELOG
cat >> CHANGELOG.md << 'EOF'
## [1.2.0] - 2024-01-15
### Added
- User authentication
- Password hashing
### Fixed
- Login redirect bug
EOF
git commit -am "Update CHANGELOG for v1.2.0"

# 4. Merge to main
git checkout main
git merge --no-ff release/v1.2.0

# 5. Tag release
git tag -a v1.2.0 -m "Release version 1.2.0"

# 6. Push with tags
git push origin main --tags

# 7. Merge back to develop
git checkout develop
git merge --no-ff release/v1.2.0

# 8. Clean up
git branch -d release/v1.2.0
```

## Team Collaboration Practices

### Branch naming conventions

```bash
# Feature branches
feature/user-authentication
feature/payment-integration
feat/add-analytics

# Bug fixes
fix/login-redirect
bugfix/memory-leak
fix/issue-123

# Hotfixes
hotfix/security-patch
hotfix/critical-bug

# Releases
release/v1.2.0
release/2024-Q1

# Experiments
experiment/new-architecture
spike/performance-test

# Documentation
docs/api-documentation
docs/setup-guide
```

### Commit message conventions

```bash
# Conventional Commits format
<type>(<scope>): <subject>

<body>

<footer>

# Types:
# feat: New feature
# fix: Bug fix
# docs: Documentation
# style: Formatting
# refactor: Code restructure
# test: Tests
# chore: Maintenance

# Examples:
git commit -m "feat(auth): add JWT token authentication"
git commit -m "fix(api): resolve memory leak in endpoint"
git commit -m "docs(readme): update installation instructions"
git commit -m "test(auth): add tests for login flow"

# With body and footer
git commit -m "feat(payment): integrate Stripe payment

Adds Stripe payment processing with:
- Payment intent creation
- Webhook handling
- Error recovery

Closes #123, #124
Breaking change: Payment API changed"
```

### Pull request workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make focused commits
git commit -m "feat: add user model"
git commit -m "feat: add user controller"
git commit -m "test: add user tests"

# 3. Keep branch updated
git fetch origin
git rebase origin/main

# 4. Push branch
git push -u origin feature/new-feature

# 5. Create PR with:
# - Clear title
# - Description of changes
# - Link to issues
# - Screenshots if UI changes
# - Testing instructions

# 6. Address review comments
git commit -m "refactor: address review comments"
git push origin feature/new-feature

# 7. Squash if needed
git rebase -i origin/main
git push --force-with-lease origin feature/new-feature

# 8. After merge, cleanup
git checkout main
git pull origin main
git branch -d feature/new-feature
```

### Code review process

```bash
# Reviewer workflow:

# 1. Fetch PR branch
git fetch origin pull/123/head:pr-123
git checkout pr-123

# 2. Test locally
npm install
npm test
npm start

# 3. Review code
# - Check for bugs
# - Verify tests
# - Review architecture
# - Check style

# 4. Leave comments on GitHub/GitLab

# 5. Approve or request changes

# 6. After addressing comments
git checkout pr-123
git pull origin feature/new-feature
# Re-review
```

## Conflict Resolution Strategies

### Preventing conflicts

```bash
# 1. Small, frequent commits
git commit -am "Small focused change"

# 2. Regular sync with main
git fetch origin
git rebase origin/main

# 3. Communicate with team
# Avoid working on same files

# 4. Use feature flags
# Merge incomplete features behind flags
```

### Resolving conflicts

```bash
# During merge
git checkout main
git merge feature-branch
# CONFLICT in file.txt

# Resolve
nano file.txt
git add file.txt
git merge --continue

# During rebase
git rebase main
# CONFLICT in file.txt

# Resolve
nano file.txt
git add file.txt
git rebase --continue
```

## Best Practices

### Workflow guidelines

```bash
# 1. Choose workflow appropriate for team size/needs

# Small team, continuous deployment:
# → GitHub Flow

# Large team, scheduled releases:
# → Git Flow

# Multiple environments:
# → GitLab Flow

# Fast-paced, experienced team:
# → Trunk-Based Development

# 2. Document workflow in CONTRIBUTING.md

# 3. Enforce with:
# - Branch protection rules
# - Required reviews
# - CI/CD checks
# - Pre-commit hooks

# 4. Regular team sync
# - Daily standups
# - Weekly planning
# - Retrospectives
```

### Protection rules example

```bash
# GitHub/GitLab settings for main branch:
# ✓ Require pull request reviews (2)
# ✓ Require status checks to pass
# ✓ Require branches to be up to date
# ✓ Require signed commits
# ✓ Include administrators
# ✓ Restrict who can push
# ✓ Require linear history
```

### Team communication

```bash
# Commit messages
# - Clear and descriptive
# - Follow conventions
# - Reference issues

# Pull requests
# - Small and focused
# - Good description
# - Link to documentation
# - Request specific reviewers

# Code reviews
# - Timely (within 1 day)
# - Constructive feedback
# - Explain reasoning
# - Suggest alternatives

# Branch names
# - Descriptive
# - Include issue number
# - Follow conventions
```

## Quick Reference

```bash
# GitHub Flow
main → feature-branch → PR → main → deploy

# Git Flow
develop → feature → develop
develop → release → main + develop
main → hotfix → main + develop

# Fork Workflow
upstream/main → origin/main → feature → PR → upstream/main

# Best practices
- Small, focused changes
- Frequent commits
- Regular sync
- Good commit messages
- Code reviews
- CI/CD integration
- Branch protection
```
