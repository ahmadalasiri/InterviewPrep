# Git Branching & Merging Interview Questions

## What is a branch in Git?

**Answer:**
A branch is a lightweight movable pointer to a commit. It allows parallel development without affecting the main codebase.

**Key Points:**

- Default branch: `main` or `master`
- Branches are just references to commits
- Very lightweight (41 bytes)
- Switching branches is fast

```bash
# Create branch
git branch feature-branch

# Switch to branch
git checkout feature-branch
# or newer syntax
git switch feature-branch

# Create and switch
git checkout -b feature-branch
# or
git switch -c feature-branch
```

## Why are branches important?

**Answer:**

**Benefits:**

1. **Isolation**: Work on features independently
2. **Experimentation**: Try ideas without risk
3. **Collaboration**: Multiple developers work simultaneously
4. **Organization**: Separate development, staging, production
5. **Code Review**: Review before merging

**Common Use Cases:**

- Feature development
- Bug fixes
- Experiments
- Release preparation
- Hot fixes

## What is the difference between `git branch` and `git checkout`?

**Answer:**

**`git branch`**

- Creates, lists, or deletes branches
- Doesn't switch branches

```bash
git branch feature          # Create
git branch                  # List
git branch -d feature       # Delete
git branch -m new-name      # Rename current branch
```

**`git checkout`**

- Switches branches
- Updates working directory
- Can also create and switch

```bash
git checkout feature        # Switch
git checkout -b feature     # Create and switch
```

**Modern alternative: `git switch`**

```bash
git switch feature          # Switch
git switch -c feature       # Create and switch
```

## Explain the different types of merges in Git

**Answer:**

### 1. Fast-Forward Merge

No new commit created, just moves pointer forward.

```bash
# Before:
main:    A---B
feature:     B---C---D

# After merge:
main:    A---B---C---D

git checkout main
git merge feature
```

### 2. Three-Way Merge

Creates a merge commit with two parents.

```bash
# Before:
main:    A---B---C
feature:     B---D---E

# After merge:
main:    A---B---C---M
                 \   /
feature:          D-E

git checkout main
git merge feature
```

### 3. Squash Merge

Combines all commits into one.

```bash
git checkout main
git merge --squash feature
git commit -m "Squashed feature"
```

### 4. Rebase

Reapplies commits on top of another base.

```bash
git checkout feature
git rebase main
```

## What is a merge conflict and how do you resolve it?

**Answer:**

**Merge Conflict** occurs when Git can't automatically merge changes (same lines modified differently).

**Common Scenarios:**

- Same line edited in both branches
- File deleted in one branch, modified in another
- File renamed differently in both branches

**Resolution Steps:**

1. **Identify conflicts:**

```bash
git status
# Both modified: file.txt
```

2. **Open conflicted file:**

```
<<<<<<< HEAD (current branch)
Your changes
=======
Their changes
>>>>>>> feature-branch
```

3. **Resolve manually:**

- Keep your changes, or
- Keep their changes, or
- Combine both, or
- Write something entirely new

4. **Mark as resolved:**

```bash
git add file.txt
```

5. **Complete merge:**

```bash
git commit -m "Resolve merge conflict"
```

**Tools:**

```bash
# Use merge tool
git mergetool

# Abort merge
git merge --abort

# Accept ours/theirs
git checkout --ours file.txt
git checkout --theirs file.txt
```

## What is the difference between `git merge` and `git rebase`?

**Answer:**

### `git merge`

- Combines branches with a merge commit
- Preserves complete history
- Non-destructive operation
- Creates a merge commit

```bash
git checkout main
git merge feature

# History:
main:    A---B---C---M
              \     /
feature:       D---E
```

**Pros:**

- Safe and simple
- Preserves context
- True history

**Cons:**

- Cluttered history
- Many merge commits

### `git rebase`

- Moves/reapplies commits to new base
- Linear history
- Rewrites history

```bash
git checkout feature
git rebase main

# History:
main:    A---B---C
                  \
feature:           D'---E'
```

**Pros:**

- Clean linear history
- Easier to follow
- Better bisect results

**Cons:**

- Rewrites history (dangerous on shared branches)
- Loses context
- Complex conflicts

**Golden Rule**: Never rebase public/shared branches

## When should you use rebase vs merge?

**Answer:**

### Use **Merge** when:

- Working on public/shared branches
- Want to preserve complete history
- Multiple people working on same branch
- Need to maintain context of parallel work
- Default for pull requests

### Use **Rebase** when:

- Cleaning up local commits before pushing
- Keeping feature branch updated with main
- Want linear project history
- Working on personal feature branches

**Best Practice Workflow:**

```bash
# Update feature branch from main
git checkout feature
git rebase main          # Rebase private branch

# Merge feature into main
git checkout main
git merge feature        # Merge to preserve history
```

**Interactive Rebase** (local commits only):

```bash
git rebase -i HEAD~3     # Edit last 3 commits
```

## What is cherry-pick in Git?

**Answer:**
`git cherry-pick` applies specific commits from one branch to another.

**Syntax:**

```bash
git cherry-pick <commit-hash>

# Multiple commits
git cherry-pick <commit1> <commit2>

# Range of commits
git cherry-pick <commit1>..<commit2>
```

**Use Cases:**

1. Apply hot fix to multiple branches
2. Copy specific commit to another branch
3. Undo a revert
4. Recover lost commits

**Example:**

```bash
# You're on main
git cherry-pick abc123

# With edit option
git cherry-pick -e abc123

# Without committing
git cherry-pick -n abc123
```

**Potential Issues:**

- Duplicate commits
- Conflicts
- History complexity

## Explain Git branching strategies

**Answer:**

### 1. **Git Flow**

Complex, multiple branch types:

- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `release/*`: Release preparation
- `hotfix/*`: Emergency fixes

```bash
# Start feature
git checkout -b feature/new-feature develop

# Finish feature
git checkout develop
git merge feature/new-feature
git branch -d feature/new-feature
```

### 2. **GitHub Flow**

Simple, single main branch:

- `main`: Always deployable
- Feature branches off main
- Pull request for review
- Merge and deploy immediately

```bash
git checkout -b feature/new-feature
# Make changes
git push origin feature/new-feature
# Create pull request
# Review and merge
```

### 3. **GitLab Flow**

Environment branches:

- `main`: Latest code
- `pre-production`: Staging
- `production`: Live code
- Feature branches

### 4. **Trunk-Based Development**

- One main branch
- Short-lived feature branches
- Frequent integration
- Feature flags for incomplete features

**Choice depends on:**

- Team size
- Release frequency
- Deployment process
- Project complexity

## What is a detached HEAD state?

**Answer:**
Detached HEAD occurs when HEAD points directly to a commit instead of a branch.

**How it happens:**

```bash
# Checkout specific commit
git checkout abc123

# Checkout specific tag
git checkout v1.0.0

# Checkout remote branch without tracking
git checkout origin/main
```

**State:**

```
HEAD -> abc123 (commit)
Instead of:
HEAD -> main -> abc123
```

**What to do:**

**1. Just looking around:**

```bash
git checkout main  # Return to branch
```

**2. Want to keep changes:**

```bash
# Create new branch
git checkout -b new-branch

# Or
git branch new-branch
git checkout main
git merge new-branch
```

**3. Don't want changes:**

```bash
git checkout main  # Changes lost
```

## Explain fast-forward merge

**Answer:**
Fast-forward merge occurs when target branch hasn't diverged from feature branch.

**Condition:**
No new commits on target branch since feature branch was created.

**Example:**

```bash
# Before:
main:    A---B
              \
feature:       C---D

# After fast-forward:
main:    A---B---C---D
```

**Command:**

```bash
git checkout main
git merge feature
# Fast-forward merge
```

**Force merge commit:**

```bash
git merge --no-ff feature
# Creates merge commit even if fast-forward possible
```

**Disable fast-forward:**

```bash
git merge --ff-only feature
# Fails if fast-forward not possible
```

**Why disable fast-forward?**

- Preserve feature branch information
- Clearer project structure
- Easier to revert entire feature

## What is `git stash` and when do you use it?

**Answer:**
`git stash` temporarily saves uncommitted changes for later use.

**Use Cases:**

- Switch branches with uncommitted changes
- Pull latest changes without committing
- Save work in progress
- Try different approaches

**Commands:**

```bash
# Save changes
git stash
git stash save "work in progress"

# List stashes
git stash list

# Apply last stash (keep in stash)
git stash apply

# Apply last stash (remove from stash)
git stash pop

# Apply specific stash
git stash apply stash@{2}

# Show stash contents
git stash show -p stash@{0}

# Create branch from stash
git stash branch new-branch

# Clear all stashes
git stash clear

# Drop specific stash
git stash drop stash@{0}
```

**Stash untracked files:**

```bash
git stash -u
# or
git stash --include-untracked
```

## What is the difference between `git branch -d` and `git branch -D`?

**Answer:**

**`git branch -d` (lowercase)**

- Safe delete
- Prevents deletion if branch not fully merged
- Git warns you about unmerged changes

```bash
git branch -d feature
# error: The branch 'feature' is not fully merged.
```

**`git branch -D` (uppercase)**

- Force delete
- Deletes branch regardless of merge status
- Potentially lose work

```bash
git branch -D feature
# Deleted branch feature (was abc123).
```

**When to use:**

**Use `-d`** (default):

- After merging feature
- Safe deletion

**Use `-D`** (force):

- Abandoning feature
- Experimental branch
- Mistaken branch creation

**Recover deleted branch:**

```bash
# Find commit
git reflog

# Recreate branch
git branch feature abc123
```

## Explain branch tracking in Git

**Answer:**
Branch tracking creates a relationship between local and remote branches.

**Setup tracking:**

```bash
# Automatically tracks remote branch
git checkout -b feature origin/feature

# Or shorter
git checkout feature  # If remote branch exists

# Set upstream for existing branch
git branch --set-upstream-to=origin/feature feature

# Or shorter
git branch -u origin/feature
```

**Benefits:**

- `git push` without specifying remote/branch
- `git pull` knows where to pull from
- See ahead/behind status

```bash
# With tracking:
git push
git pull

# Without tracking:
git push origin feature
git pull origin feature
```

**Check tracking:**

```bash
git branch -vv
# * feature  abc123 [origin/feature: ahead 2] Latest commit
```

**Status information:**

```bash
# Ahead: Local has commits not on remote
# Behind: Remote has commits not local
# Ahead 2, behind 1: Both have unique commits
```
