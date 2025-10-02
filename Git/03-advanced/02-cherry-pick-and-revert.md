# Git Advanced - Cherry-pick and Revert

## Cherry-pick Basics

### Apply specific commit

```bash
# Cherry-pick single commit
git cherry-pick abc123

# Git applies changes from abc123 to current branch
# Creates new commit with different hash
```

### Cherry-pick multiple commits

```bash
# Pick multiple commits
git cherry-pick abc123 def456 ghi789

# Pick range of commits (excludes first)
git cherry-pick abc123..xyz789

# Pick range including first commit
git cherry-pick abc123^..xyz789
```

## Cherry-pick Options

### Basic options

```bash
# Cherry-pick without committing
git cherry-pick -n abc123
git cherry-pick --no-commit abc123

# Edit commit message
git cherry-pick -e abc123
git cherry-pick --edit abc123

# Keep original author
git cherry-pick -x abc123
# Adds "(cherry picked from commit abc123)" to message

# Sign off commit
git cherry-pick -s abc123
git cherry-pick --signoff abc123
```

### Continue, skip, abort

```bash
# Continue after resolving conflicts
git cherry-pick --continue

# Skip current commit
git cherry-pick --skip

# Abort cherry-pick
git cherry-pick --abort
```

## Cherry-pick Use Cases

### Apply hotfix to multiple branches

```bash
# Fix critical bug on main
git checkout main
git commit -m "Fix critical security issue"  # abc123

# Apply to release branch
git checkout release-2.0
git cherry-pick abc123

# Apply to develop branch
git checkout develop
git cherry-pick abc123

# Same fix now on all branches
```

### Move commit to correct branch

```bash
# Committed to wrong branch
git log  # Find commit hash abc123

# Switch to correct branch
git checkout correct-branch
git cherry-pick abc123

# Remove from wrong branch
git checkout wrong-branch
git reset --hard HEAD~1
```

### Bring specific feature to branch

```bash
# Feature branch has 10 commits
# You only want one feature
git log feature-branch  # Find desired commit

git checkout main
git cherry-pick def456  # Just that one commit
```

### Backport fix to older version

```bash
# Fix in main (v3.0)
git checkout main
git log  # abc123: Fix database connection

# Backport to v2.0
git checkout release-2.0
git cherry-pick abc123
```

## Handling Cherry-pick Conflicts

### Resolve conflicts

```bash
# Cherry-pick with conflict
git cherry-pick abc123
# CONFLICT (content): Merge conflict in file.txt

# Check status
git status

# Resolve conflict
nano file.txt
# Edit file, remove markers

# Stage resolved files
git add file.txt

# Continue cherry-pick
git cherry-pick --continue
```

### Accept theirs or ours

```bash
# During cherry-pick:
# "ours" = current branch (HEAD)
# "theirs" = commit being cherry-picked

# Keep current version
git checkout --ours file.txt

# Keep cherry-picked version
git checkout --theirs file.txt

# Stage and continue
git add file.txt
git cherry-pick --continue
```

### Abort if stuck

```bash
# Too many conflicts or wrong commit
git cherry-pick --abort

# Returns to state before cherry-pick
```

## Git Revert Basics

### Revert last commit

```bash
# Create commit that undoes last commit
git revert HEAD

# Git opens editor for revert message
# Default: "Revert 'original commit message'"
```

### Revert specific commit

```bash
# Revert by commit hash
git revert abc123

# Revert multiple commits
git revert abc123 def456 ghi789

# Revert range (excludes first)
git revert abc123..xyz789

# Revert range including first
git revert abc123^..xyz789
```

## Revert Options

### Revert without committing

```bash
# Revert but don't commit
git revert -n abc123
git revert --no-commit abc123

# Make additional changes
git add other-file.txt

# Commit all together
git commit -m "Revert feature and update docs"
```

### Edit revert message

```bash
# Open editor for message
git revert -e abc123

# Or provide message
git revert abc123 -m "Revert due to bug #123"
```

### Continue, skip, abort

```bash
# Continue after resolving conflicts
git revert --continue

# Skip current commit
git revert --skip

# Abort revert
git revert --abort
```

## Reverting Merge Commits

### Understanding merge commit parents

```bash
# View merge commit
git show abc123

# Output:
# Merge: def456 ghi789
#        ^       ^
#     parent1  parent2
#     (main)  (feature)
```

### Revert merge commit

```bash
# Revert merge, keep main branch (-m 1)
git revert -m 1 abc123

# -m 1: mainline is parent 1 (usually main/develop)
# -m 2: mainline is parent 2 (usually feature branch)
```

### Re-merge after reverting merge

```bash
# Problem: After reverting merge, can't re-merge
git checkout main
git merge feature  # Already merged (empty)

# Solution: Revert the revert
git revert <revert-commit-hash>
git merge feature  # Now works
```

## Cherry-pick vs Revert Comparison

### Cherry-pick: Apply changes

```bash
# Takes changes from commit
# Creates new commit on current branch
git cherry-pick abc123

# Before:
# main:    A---B---C
# feature: A---B---D (has abc123)

# After cherry-pick on main:
# main:    A---B---C---D' (abc123 changes)
# feature: A---B---D
```

### Revert: Undo changes

```bash
# Creates commit that undoes changes
# Opposite of original commit
git revert abc123

# Before:
# main: A---B---C (bad commit)

# After revert:
# main: A---B---C---C' (undoes C)
```

## Practical Workflows

### Hotfix workflow with cherry-pick

```bash
# 1. Create hotfix on main
git checkout main
git checkout -b hotfix/security-patch
git commit -m "Fix security vulnerability"  # abc123
git checkout main
git merge hotfix/security-patch

# 2. Cherry-pick to active release branches
git checkout release-2.1
git cherry-pick abc123

git checkout release-2.0
git cherry-pick abc123

# 3. Cherry-pick to develop
git checkout develop
git cherry-pick abc123

# All branches now have the fix
```

### Feature rollback with revert

```bash
# Feature deployed but has bugs
git log --oneline
# abc123 Merge feature/new-ui

# Revert entire feature
git revert -m 1 abc123
git push origin main

# Feature rolled back in production
# Debug in separate branch
git checkout -b fix/new-ui
# Fix issues
git push origin fix/new-ui
# Create new PR when ready
```

### Selective feature adoption

```bash
# Large feature branch
git log feature-branch --oneline
# abc123 Add analytics
# def456 Add auth
# ghi789 Add database
# jkl012 Add API

# Only want auth and API
git checkout main
git cherry-pick def456  # Auth
git cherry-pick jkl012  # API

# Leave analytics and database out
```

## Advanced Techniques

### Cherry-pick with mainline

```bash
# Cherry-pick merge commit
git cherry-pick -m 1 abc123

# -m 1: apply changes from parent 1 perspective
# Useful for cherry-picking merges
```

### Revert multiple commits at once

```bash
# Revert last 3 commits as one
git revert -n HEAD~2..HEAD
git commit -m "Revert last 3 commits"

# Creates single revert commit
```

### Cherry-pick with strategy

```bash
# Use merge strategy
git cherry-pick -X theirs abc123
git cherry-pick -X ours abc123

# Ignore whitespace
git cherry-pick -X ignore-space-change abc123
```

### Interactive cherry-pick

```bash
# Cherry-pick with patch mode
git cherry-pick -n abc123
git reset
git add -p
git commit -m "Cherry-picked parts of abc123"

# Pick only certain changes from commit
```

## Troubleshooting

### Empty cherry-pick

```bash
# Cherry-pick results in no changes
git cherry-pick abc123
# The previous cherry-pick is now empty

# Reasons:
# - Changes already in branch
# - Commit already applied
# - Conflicts resolved to nothing

# Skip or allow empty
git cherry-pick --skip
# or
git cherry-pick --allow-empty abc123
```

### Duplicate commits

```bash
# Cherry-pick creates duplicate
# Same changes, different hash

# Check with:
git log --oneline --all

# main:    A---B---C (abc123)
# feature: A---B---C' (def456 - same changes)

# To avoid: use merge or rebase instead
```

### Revert conflicts

```bash
# Reverting old commit may conflict
git revert abc123
# CONFLICT in file.txt

# File has changed significantly
# Manual resolution needed

# Resolve
nano file.txt
git add file.txt
git revert --continue

# Or abort
git revert --abort
```

## Best Practices

### When to use cherry-pick

```bash
# ✅ GOOD use cases:
# - Hotfixes to multiple versions
# - Backporting specific fixes
# - Moving commit to correct branch
# - Bringing specific feature from branch

# ❌ BAD use cases:
# - Instead of proper merge
# - Regularly syncing branches
# - Applying many commits (use merge/rebase)
# - When feature has dependencies
```

### When to use revert

```bash
# ✅ GOOD use cases:
# - Undo pushed commits
# - Roll back features in production
# - Maintain audit trail
# - Safe undo on shared branches

# ❌ BAD use cases:
# - Undo unpushed commits (use reset)
# - Personal/local branches (use reset)
# - When history rewrite is acceptable
```

### Safety tips

```bash
# Before cherry-pick
# 1. Check for dependencies
git log abc123
git show abc123

# 2. Verify target branch
git branch --show-current

# 3. Test after applying
git cherry-pick abc123
npm test  # or your test command

# Before revert
# 1. Check commit impact
git show abc123

# 2. Consider dependents
git log --oneline abc123..HEAD

# 3. Communicate to team
# Reverting commit abc123 in production
```

### Commit message conventions

```bash
# Cherry-pick message
git cherry-pick -x abc123
# Adds: (cherry picked from commit abc123)

# Revert message
git revert abc123
# Default: Revert "Original message"
#
# This reverts commit abc123.
# Reason: Bug in production

# Custom messages
git cherry-pick -e abc123
# Edit: Backport fix for issue #123
#
# Original commit: abc123
# Reason: Security vulnerability
```

## Quick Reference

```bash
# Cherry-pick
git cherry-pick abc123              # Apply commit
git cherry-pick abc123 def456       # Multiple commits
git cherry-pick abc123..xyz789      # Range
git cherry-pick -n abc123           # Don't commit
git cherry-pick -e abc123           # Edit message
git cherry-pick -x abc123           # Add source reference
git cherry-pick --continue          # After resolving
git cherry-pick --abort             # Cancel

# Revert
git revert HEAD                     # Revert last commit
git revert abc123                   # Revert specific commit
git revert abc123 def456            # Multiple commits
git revert -n abc123                # Don't commit
git revert -m 1 abc123              # Revert merge
git revert --continue               # After resolving
git revert --abort                  # Cancel

# Common workflows
# Hotfix to branches
git cherry-pick <hotfix-commit>

# Undo pushed commit
git revert <bad-commit>

# Move commit to correct branch
git cherry-pick <commit>
git reset --hard HEAD~1  # on wrong branch
```
