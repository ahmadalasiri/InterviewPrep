# Git Branching - Branch Operations

## Creating Branches

### Basic branch creation

```bash
# Create new branch
git branch feature-branch

# Create and switch to branch
git checkout -b feature-branch

# Or using newer syntax
git switch -c feature-branch

# Create branch from specific commit
git branch feature-branch abc123

# Create branch from remote branch
git branch feature origin/feature
```

### Branch naming conventions

```bash
# Feature branches
git checkout -b feature/user-authentication
git checkout -b feature/payment-integration

# Bug fix branches
git checkout -b fix/login-bug
git checkout -b bugfix/memory-leak

# Hot fix branches
git checkout -b hotfix/critical-security-fix

# Release branches
git checkout -b release/v1.2.0

# Experimental branches
git checkout -b experiment/new-architecture
```

## Switching Branches

### Change branches

```bash
# Switch to existing branch (old syntax)
git checkout main

# Switch to existing branch (new syntax)
git switch main

# Switch to previous branch
git checkout -
git switch -

# Switch and create
git checkout -b new-branch
git switch -c new-branch
```

### Handle uncommitted changes when switching

```bash
# Stash changes before switching
git stash
git checkout other-branch
# Work on other branch
git checkout original-branch
git stash pop

# Force switch (discard changes)
git checkout -f other-branch

# Switch with merge (Git 2.27+)
git switch -m other-branch
```

## Listing Branches

### View branches

```bash
# List local branches
git branch

# List with last commit
git branch -v

# List with tracking info
git branch -vv

# List remote branches
git branch -r

# List all branches (local + remote)
git branch -a
git branch --all
```

### Filter branches

```bash
# Branches containing commit
git branch --contains abc123

# Branches not containing commit
git branch --no-contains abc123

# Merged branches
git branch --merged

# Not merged branches
git branch --no-merged

# Branches merged into specific branch
git branch --merged main

# Remote branches merged
git branch -r --merged origin/main
```

### Sort and format branches

```bash
# Sort by commit date
git branch --sort=-committerdate

# Sort by author date
git branch --sort=-authordate

# Custom format
git branch --format='%(refname:short) %(committerdate:relative)'
```

## Deleting Branches

### Delete local branches

```bash
# Delete merged branch (safe)
git branch -d feature-branch

# Force delete (even if not merged)
git branch -D feature-branch

# Delete multiple branches
git branch -d feature1 feature2 feature3

# Delete branches matching pattern
git branch | grep 'feature/' | xargs git branch -d
```

### Delete remote branches

```bash
# Delete remote branch
git push origin --delete feature-branch

# Alternative syntax
git push origin :feature-branch

# Delete multiple remote branches
git push origin --delete branch1 branch2
```

### Clean up deleted remote branches

```bash
# Remove references to deleted remote branches
git fetch --prune
git fetch -p

# Or prune separately
git remote prune origin

# Configure auto-prune
git config --global fetch.prune true
```

## Renaming Branches

### Rename local branch

```bash
# Rename current branch
git branch -m new-name

# Rename specific branch
git branch -m old-name new-name

# Force rename
git branch -M new-name
```

### Rename and update remote

```bash
# 1. Rename local branch
git branch -m old-name new-name

# 2. Delete old remote branch
git push origin --delete old-name

# 3. Push new branch and set upstream
git push -u origin new-name
```

## Comparing Branches

### View differences

```bash
# Show commits in feature not in main
git log main..feature

# Show commits in main not in feature
git log feature..main

# Show commits in either but not both
git log main...feature

# Show which side commits are on
git log --left-right main...feature

# Show file differences
git diff main..feature

# Show only file names
git diff --name-only main feature

# Show stats
git diff --stat main feature
```

### View divergence

```bash
# Show commits in both branches
git log --oneline --graph --all main feature

# Count commits
git rev-list --count main..feature
git rev-list --count feature..main
```

## Branch Tracking

### Set up tracking branches

```bash
# Create branch tracking remote
git checkout -b feature origin/feature

# Auto-track (if remote branch exists)
git checkout feature

# Set upstream for existing branch
git branch --set-upstream-to=origin/feature
git branch -u origin/feature

# Set while pushing
git push -u origin feature
```

### View tracking info

```bash
# Show tracking branches
git branch -vv

# Show remote tracking branches
git branch -r

# Show upstream branch
git rev-parse --abbrev-ref @{upstream}
```

### Untrack branch

```bash
# Remove upstream reference
git branch --unset-upstream feature
```

## Branch Information

### Get branch details

```bash
# Current branch name
git branch --show-current
git rev-parse --abbrev-ref HEAD

# Last commit on branch
git log -1 feature

# Branch creation point
git merge-base main feature

# Branch author
git log feature --format='%an' | head -1

# Commits ahead/behind
git rev-list --left-right --count main...feature
```

## Working with Multiple Branches

### Create multiple branches

```bash
# Create several feature branches
git branch feature/authentication
git branch feature/database
git branch feature/ui

# Verify
git branch
```

### Switch between branches efficiently

```bash
# Create orphan branch (no history)
git checkout --orphan new-branch

# Detached HEAD mode
git checkout abc123

# Return to previous branch
git checkout -
```

## Branch Strategies

### Feature Branch Workflow

```bash
# Start feature
git checkout -b feature/new-feature main

# Work on feature
git add .
git commit -m "Implement feature"

# Keep updated with main
git checkout main
git pull origin main
git checkout feature/new-feature
git rebase main

# Push feature
git push -u origin feature/new-feature

# After merge, cleanup
git checkout main
git pull origin main
git branch -d feature/new-feature
git push origin --delete feature/new-feature
```

### Git Flow branches

```bash
# Main branches
main          # Production code
develop       # Integration branch

# Supporting branches
feature/*     # New features
release/*     # Release preparation
hotfix/*      # Production fixes

# Example workflow
git checkout -b develop main
git checkout -b feature/new-feature develop
# work on feature
git checkout develop
git merge --no-ff feature/new-feature
git branch -d feature/new-feature
```

### GitHub Flow

```bash
# Single main branch
git checkout -b feature/new-feature main

# Make changes
git commit -am "Add feature"

# Push and create PR
git push -u origin feature/new-feature
# Create pull request on GitHub

# After merge
git checkout main
git pull origin main
git branch -d feature/new-feature
```

## Advanced Branch Operations

### Cherry-pick from branch

```bash
# Apply specific commit from another branch
git checkout main
git cherry-pick abc123

# Cherry-pick range
git cherry-pick abc123^..def456

# Cherry-pick without committing
git cherry-pick -n abc123
```

### Rebase branch

```bash
# Rebase current branch onto main
git rebase main

# Interactive rebase
git rebase -i main

# Rebase onto different base
git rebase --onto main feature feature-sub
```

### Merge branches

```bash
# Fast-forward merge
git merge feature

# No fast-forward (always create merge commit)
git merge --no-ff feature

# Squash merge
git merge --squash feature

# Merge with strategy
git merge -X theirs feature
git merge -X ours feature
```

## Branch Protection

### Configure branch protection (via hosting platform)

```bash
# GitHub/GitLab settings:
# - Require pull request reviews
# - Require status checks
# - Require signed commits
# - Restrict who can push
# - Require linear history

# Local pre-push hook
#!/bin/sh
# .git/hooks/pre-push

protected_branches="main master develop"
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

if echo "$protected_branches" | grep -q "$current_branch"; then
    echo "Cannot push to protected branch: $current_branch"
    exit 1
fi
```

## Troubleshooting Branches

### Fix branch issues

```bash
# Recover deleted branch
git reflog
git branch recovered-branch abc123

# Detached HEAD - create branch
git checkout -b recovery-branch

# Branch behind remote
git fetch origin
git reset --hard origin/main

# Diverged branches
git fetch origin
git rebase origin/main

# Orphaned branch
git checkout --orphan new-branch
git rm -rf .
```

### Branch cleanup scripts

```bash
# Delete all merged branches
git branch --merged main | grep -v "main" | xargs git branch -d

# Delete all remote merged branches
git branch -r --merged origin/main |
  grep -v "main" |
  sed 's/origin\///' |
  xargs -n 1 git push origin --delete

# Delete stale branches (older than 30 days)
git for-each-ref --format='%(refname:short) %(committerdate:relative)' refs/heads/ |
  grep '30 days\|month\|year' |
  awk '{print $1}' |
  xargs git branch -D
```

## Best Practices

### Naming conventions

```bash
# Good names
feature/user-authentication
fix/login-redirect-issue
hotfix/security-patch-2024-01
release/v1.2.0

# Bad names
john-stuff
temp
test
fix
asdf
```

### Branch hygiene

```bash
# Regular cleanup
# Delete merged local branches
git branch --merged | grep -v "\*\|main\|develop" | xargs -n 1 git branch -d

# Update from remote regularly
git fetch --all --prune

# Keep branches focused
# One feature = one branch
# Commit often, push regularly

# Use descriptive commit messages
git commit -m "feat: add user authentication
- Implement login endpoint
- Add JWT token generation
- Create user session middleware"
```

### Workflow recommendations

```bash
# 1. Always start from updated main
git checkout main
git pull origin main
git checkout -b feature/new-feature

# 2. Commit frequently
git add .
git commit -m "WIP: add authentication"

# 3. Keep branch updated
git fetch origin
git rebase origin/main

# 4. Clean history before PR
git rebase -i origin/main

# 5. Delete after merge
git branch -d feature/new-feature
git push origin --delete feature/new-feature
```
