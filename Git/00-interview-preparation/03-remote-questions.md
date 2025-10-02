# Git Remote Operations Interview Questions

## What is a remote repository?

**Answer:**
A remote repository is a version of your project hosted on the internet or network.

**Characteristics:**

- Located on a server (GitHub, GitLab, Bitbucket)
- Enables collaboration
- Serves as backup
- Can have multiple remotes

**Common operations:**

```bash
# View remotes
git remote -v

# Add remote
git remote add origin https://github.com/user/repo.git

# Remove remote
git remote remove origin

# Rename remote
git remote rename origin upstream
```

## What is the difference between `origin` and `upstream`?

**Answer:**

**`origin`**

- Default name for cloned repository
- Your main remote (usually your fork or main repo)
- Where you push changes

**`upstream`**

- Common name for original repository
- Used when you fork a repository
- Source of truth for pulling updates

**Typical workflow (forked repo):**

```bash
# Clone your fork
git clone https://github.com/yourname/repo.git
# origin points to your fork

# Add upstream
git remote add upstream https://github.com/original/repo.git

# Update from upstream
git fetch upstream
git merge upstream/main

# Push to your fork
git push origin feature-branch
```

## Explain `git push` command and its options

**Answer:**
`git push` uploads local commits to remote repository.

**Basic syntax:**

```bash
git push <remote> <branch>

# Examples:
git push origin main
git push origin feature-branch
```

**Common options:**

```bash
# Push and set upstream
git push -u origin feature
# or
git push --set-upstream origin feature

# Push all branches
git push --all

# Push tags
git push --tags

# Force push (dangerous!)
git push --force
# Safer force push
git push --force-with-lease

# Delete remote branch
git push origin --delete feature
# or
git push origin :feature

# Dry run (test without pushing)
git push --dry-run
```

**When push fails:**

```bash
# Remote has commits you don't have
# Solution 1: Pull first
git pull origin main
git push origin main

# Solution 2: Rebase
git pull --rebase origin main
git push origin main
```

## What is `git push --force` and when is it dangerous?

**Answer:**
`git push --force` overwrites remote branch with local branch, ignoring conflicts.

**Danger:**

- Overwrites others' work
- Loses commits permanently
- Breaks collaboration

**When it's needed:**

- After rebase on personal branch
- Fixing pushed mistakes (on personal branches)
- Amending pushed commits (on personal branches)

**Safer alternative:**

```bash
# Force with lease: Fails if remote has commits you don't know about
git push --force-with-lease

# Much safer than --force
```

**Golden Rules:**

1. NEVER force push to shared branches (main, develop)
2. NEVER force push to public branches
3. Only force push to personal feature branches
4. Coordinate with team before force pushing

**Example workflow:**

```bash
# Safe on personal branch
git checkout my-feature
git rebase main
git push --force-with-lease origin my-feature

# NEVER DO THIS:
git checkout main
git push --force origin main  # ❌ DON'T!
```

## Explain `git pull` and its variants

**Answer:**
`git pull` fetches changes from remote and merges into current branch.

**Equivalent to:**

```bash
git pull origin main
# Same as:
git fetch origin
git merge origin/main
```

**Variants:**

### 1. Regular Pull (Merge)

```bash
git pull origin main
# Creates merge commit if necessary
```

### 2. Pull with Rebase

```bash
git pull --rebase origin main
# Reapplies your commits on top of fetched commits
# Equivalent to:
# git fetch origin
# git rebase origin/main
```

### 3. Pull with Fast-Forward Only

```bash
git pull --ff-only origin main
# Fails if fast-forward not possible
# Good for keeping clean history
```

### 4. Pull All Remotes

```bash
git pull --all
```

**Configuration:**

```bash
# Set default pull strategy
git config pull.rebase false  # Merge (default)
git config pull.rebase true   # Rebase
git config pull.ff only       # Fast-forward only
```

## What is `git fetch` and how is it different from `git pull`?

**Answer:**

### `git fetch`

- Downloads commits, files, and refs from remote
- Updates remote-tracking branches
- Does NOT modify working directory or current branch
- Safe operation

```bash
# Fetch from all remotes
git fetch --all

# Fetch specific remote
git fetch origin

# Fetch specific branch
git fetch origin main

# Fetch and prune deleted branches
git fetch --prune
```

**After fetch:**

```bash
# View fetched changes
git log origin/main

# Merge if desired
git merge origin/main
```

### `git pull`

- Fetches AND merges
- Modifies working directory
- Can create conflicts immediately

**Comparison:**

```bash
# Cautious approach
git fetch origin
git diff main origin/main
git merge origin/main

# Quick approach
git pull origin main
```

**Best practice:** Use `fetch` to review changes before merging.

## How do you delete a remote branch?

**Answer:**

**Method 1: Using push**

```bash
git push origin --delete branch-name
```

**Method 2: Push empty reference**

```bash
git push origin :branch-name
```

**Delete local tracking reference:**

```bash
# Remove local reference to deleted remote branch
git branch -d -r origin/branch-name

# Or update references
git fetch --prune
```

**Complete cleanup:**

```bash
# 1. Delete local branch
git branch -d branch-name

# 2. Delete remote branch
git push origin --delete branch-name

# 3. Prune remote references
git fetch --prune
```

## What is `git remote prune` and when do you use it?

**Answer:**
`git remote prune` removes local references to remote branches that no longer exist.

**Problem:**
When someone deletes a branch on the remote, your local Git still shows it:

```bash
git branch -r
# origin/deleted-branch  <- This doesn't exist anymore
```

**Solution:**

```bash
# Prune specific remote
git remote prune origin

# Or during fetch
git fetch --prune

# Preview what will be pruned
git remote prune origin --dry-run
```

**Auto-prune configuration:**

```bash
# Auto-prune on every fetch
git config --global fetch.prune true
```

**Benefits:**

- Clean branch list
- Avoid confusion
- Remove stale references

## Explain different protocols for Git remote URLs

**Answer:**

### 1. HTTPS

```bash
https://github.com/user/repo.git
```

**Pros:**

- Works everywhere (firewalls)
- Easy to set up
- Can use credential managers

**Cons:**

- Need to authenticate each time (without credential helper)
- Slower than SSH

### 2. SSH

```bash
git@github.com:user/repo.git
```

**Pros:**

- No password prompts (uses SSH keys)
- More secure
- Faster

**Cons:**

- Requires SSH key setup
- Blocked by some firewalls

### 3. Git Protocol

```bash
git://github.com/user/repo.git
```

**Pros:**

- Fastest for read-only
- No authentication

**Cons:**

- Read-only (no push)
- No authentication
- Rarely used now

### 4. File Protocol

```bash
file:///path/to/repo.git
/path/to/repo.git
```

**Use case:**

- Local repositories
- Shared network drives

**Switch protocols:**

```bash
# Check current URL
git remote get-url origin

# Change to SSH
git remote set-url origin git@github.com:user/repo.git

# Change to HTTPS
git remote set-url origin https://github.com/user/repo.git
```

## What is a bare repository?

**Answer:**
A bare repository contains only Git history (`.git` contents) without a working directory.

**Characteristics:**

- No working files
- Cannot make commits directly
- Used as central repository
- Convention: ends with `.git`

**Create bare repository:**

```bash
# New bare repository
git init --bare myrepo.git

# Clone as bare
git clone --bare https://github.com/user/repo.git
```

**Directory structure:**

```
myrepo.git/
├── HEAD
├── config
├── hooks/
├── objects/
└── refs/
```

**Use cases:**

1. **Central repository** (GitHub, GitLab use bare repos)
2. **Backup repository**
3. **Mirror repository**

**Push to bare repository:**

```bash
git remote add origin /path/to/myrepo.git
git push origin main
```

**Clone from bare:**

```bash
git clone /path/to/myrepo.git
```

## How do you sync a forked repository with the original?

**Answer:**

**Setup (one time):**

```bash
# 1. Clone your fork
git clone https://github.com/yourname/repo.git
cd repo

# 2. Add upstream remote
git remote add upstream https://github.com/original/repo.git

# 3. Verify remotes
git remote -v
# origin    https://github.com/yourname/repo.git (fetch)
# origin    https://github.com/yourname/repo.git (push)
# upstream  https://github.com/original/repo.git (fetch)
# upstream  https://github.com/original/repo.git (push)
```

**Regular sync:**

```bash
# 1. Fetch upstream changes
git fetch upstream

# 2. Switch to main branch
git checkout main

# 3. Merge upstream changes
git merge upstream/main

# 4. Push to your fork
git push origin main
```

**Update feature branch:**

```bash
# On feature branch
git checkout feature-branch

# Rebase on latest main
git rebase main

# Force push (your feature branch)
git push --force-with-lease origin feature-branch
```

## Explain tracking branches

**Answer:**
Tracking branches are local branches that have a direct relationship with a remote branch.

**Setup tracking:**

```bash
# Method 1: Checkout remote branch
git checkout feature
# Automatically creates local branch tracking origin/feature

# Method 2: Explicit tracking
git checkout -b feature origin/feature

# Method 3: Set upstream for existing branch
git branch --set-upstream-to=origin/feature feature
# or shorter
git branch -u origin/feature
```

**Benefits:**

- `git push` and `git pull` without specifying remote/branch
- Git shows ahead/behind status
- Simplified workflow

**Check tracking:**

```bash
# Verbose branch list
git branch -vv
# * main    abc123 [origin/main: ahead 2, behind 1] Latest commit
#   feature xyz789 [origin/feature] Add feature

# Remote branches
git branch -r
```

**Push with tracking:**

```bash
# First push, set upstream
git push -u origin feature

# Subsequent pushes
git push
```

**Tracking info:**

```bash
# Ahead 2: You have 2 commits not on remote
# Behind 1: Remote has 1 commit you don't have
# [origin/main: gone]: Remote branch deleted
```

## What happens during `git clone`?

**Answer:**
`git clone` copies a remote repository to your local machine.

**Steps Git performs:**

1. **Creates directory** with repository name

```bash
git clone https://github.com/user/repo.git
# Creates: repo/
```

2. **Initializes local repository**

```bash
# Inside: git init
```

3. **Adds remote** named `origin`

```bash
# git remote add origin <url>
```

4. **Fetches all data** from remote

```bash
# git fetch origin
```

5. **Checks out default branch** (usually main/master)

```bash
# git checkout main
```

6. **Sets up tracking** for default branch

```bash
# git branch -u origin/main
```

**Clone options:**

```bash
# Clone into specific directory
git clone <url> my-directory

# Clone specific branch
git clone -b develop <url>

# Shallow clone (limited history)
git clone --depth 1 <url>

# Clone without checkout
git clone --no-checkout <url>

# Bare clone
git clone --bare <url>

# Mirror clone (bare + all refs)
git clone --mirror <url>
```

## How do you rename a remote branch?

**Answer:**
Git doesn't have direct command to rename remote branch. You must delete and recreate it.

**Steps:**

```bash
# 1. Rename local branch
git checkout old-branch-name
git branch -m new-branch-name

# 2. Delete old remote branch
git push origin --delete old-branch-name

# 3. Push new branch and set upstream
git push -u origin new-branch-name
```

**Alternative (preserve reflog):**

```bash
# 1. Rename local
git branch -m old-name new-name

# 2. Push new branch
git push origin new-name

# 3. Update upstream
git push origin --set-upstream new-name

# 4. Delete old branch
git push origin --delete old-name
```

**For others on team:**

```bash
# They need to:
git fetch --prune
git checkout new-name
git branch -d old-name
```

## What is `git push --force-with-lease`?

**Answer:**
`git push --force-with-lease` is a safer version of `git push --force`.

**Difference:**

**`--force`**

- Overwrites remote unconditionally
- Can overwrite others' work
- Dangerous

```bash
git push --force origin feature
# Overwrites no matter what
```

**`--force-with-lease`**

- Overwrites only if remote is in expected state
- Fails if someone else pushed
- Safer

```bash
git push --force-with-lease origin feature
# Fails if someone pushed after your last fetch
```

**Example scenario:**

```bash
# You rebase your feature branch
git checkout feature
git rebase main

# Someone else pushes to feature

# Force push fails (good!)
git push --force-with-lease origin feature
# error: remote ref is newer

# Fetch and review changes
git fetch origin
git log feature..origin/feature

# Decide: merge or still force push
```

**Best practice:**

- Always use `--force-with-lease` instead of `--force`
- Still dangerous on shared branches
- Good for personal feature branches after rebase

## How do you list all remote branches?

**Answer:**

**List remote branches:**

```bash
# List remote tracking branches
git branch -r

# Output:
#   origin/main
#   origin/develop
#   origin/feature-1

# List all branches (local + remote)
git branch -a

# Output:
# * main
#   develop
#   remotes/origin/main
#   remotes/origin/develop
```

**With more details:**

```bash
# Verbose (shows commit hash and message)
git branch -r -v

# With tracking info
git branch -vv
```

**List remote branches from remote (no fetch):**

```bash
git ls-remote --heads origin

# Output:
# abc123  refs/heads/main
# def456  refs/heads/develop
```

**Filter branches:**

```bash
# Branches containing specific commit
git branch -r --contains <commit-hash>

# Merged branches
git branch -r --merged

# Not merged branches
git branch -r --no-merged
```

**Update remote branch list:**

```bash
# Fetch and update
git fetch --all

# Prune deleted branches
git fetch --prune
```
