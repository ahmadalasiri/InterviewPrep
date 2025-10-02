# Git Advanced Interview Questions

## What is `git rebase -i` (interactive rebase)?

**Answer:**
Interactive rebase allows you to edit, reorder, squash, or delete commits.

**Usage:**

```bash
# Rebase last 3 commits
git rebase -i HEAD~3

# Rebase from specific commit
git rebase -i abc123
```

**Interactive editor shows:**

```
pick abc123 First commit
pick def456 Second commit
pick ghi789 Third commit

# Commands:
# p, pick = use commit
# r, reword = use commit, but edit message
# e, edit = use commit, but stop for amending
# s, squash = combine with previous commit
# f, fixup = like squash, but discard message
# d, drop = remove commit
```

**Common operations:**

### 1. Squash commits

```
pick abc123 First commit
squash def456 Second commit
squash ghi789 Third commit
```

### 2. Reorder commits

```
pick ghi789 Third commit
pick abc123 First commit
pick def456 Second commit
```

### 3. Edit commit message

```
reword abc123 First commit
pick def456 Second commit
```

### 4. Drop commit

```
pick abc123 First commit
drop def456 Second commit
pick ghi789 Third commit
```

**Best practices:**

- Only rebase local/unpushed commits
- Don't rebase public branches
- Use for cleaning up history before PR

## Explain `git reflog`

**Answer:**
`git reflog` shows a log of where HEAD and branch references have pointed.

**Purpose:**

- Recovery tool
- Tracks all movements of HEAD
- Persists even after reset/rebase
- Local to your repository

**Usage:**

```bash
# Show reflog
git reflog

# Output:
# abc123 HEAD@{0}: commit: Add feature
# def456 HEAD@{1}: checkout: moving from main to feature
# ghi789 HEAD@{2}: commit: Fix bug

# Show reflog for specific branch
git reflog show main

# With dates
git reflog --relative-date
```

**Recovery scenarios:**

### 1. Recover deleted commit

```bash
# Accidentally reset hard
git reset --hard HEAD~3

# Find commit in reflog
git reflog

# Recover
git reset --hard HEAD@{1}
```

### 2. Recover deleted branch

```bash
# Deleted branch
git branch -D feature

# Find last commit
git reflog

# Recreate branch
git branch feature abc123
```

### 3. Undo rebase

```bash
# Rebased, but want to undo
git reflog
# Find pre-rebase commit

git reset --hard HEAD@{5}
```

**Limitations:**

- Reflog is local (not pushed)
- Expires after 90 days (by default)
- Unreachable commits may be garbage collected

## What is `git reset` and its three modes?

**Answer:**
`git reset` moves HEAD and optionally modifies staging area and working directory.

### 1. `--soft`

Moves HEAD only, keeps staging and working directory.

```bash
git reset --soft HEAD~1

# Result:
# - HEAD moves back
# - Changes stay staged
# - Working directory unchanged

# Use case: Redo commit
git reset --soft HEAD~1
git commit -m "Better message"
```

### 2. `--mixed` (default)

Moves HEAD, resets staging area, keeps working directory.

```bash
git reset HEAD~1
# or
git reset --mixed HEAD~1

# Result:
# - HEAD moves back
# - Changes unstaged
# - Working directory unchanged

# Use case: Unstage files
git reset HEAD file.txt
```

### 3. `--hard`

Moves HEAD, resets staging and working directory (destructive!).

```bash
git reset --hard HEAD~1

# Result:
# - HEAD moves back
# - Staging area cleared
# - Working directory reset
# - CHANGES LOST!

# Use case: Discard everything
git reset --hard origin/main
```

**Comparison:**

```bash
# Starting point
A---B---C (HEAD, main)

# After git reset --soft HEAD~1
A---B (HEAD, main)
    [C's changes staged]

# After git reset HEAD~1 (mixed)
A---B (HEAD, main)
    [C's changes in working dir, unstaged]

# After git reset --hard HEAD~1
A---B (HEAD, main)
    [C's changes gone]
```

**Safety:**

```bash
# Recover after reset
git reflog
git reset --hard HEAD@{1}
```

## What is the difference between `git reset` and `git revert`?

**Answer:**

### `git reset`

- Moves branch pointer backward
- Rewrites history
- Dangerous on shared branches
- Can lose commits

```bash
git reset --hard HEAD~1

# Before:
A---B---C (HEAD)

# After:
A---B (HEAD)
# C is orphaned
```

### `git revert`

- Creates new commit that undoes changes
- Preserves history
- Safe on shared branches
- Doesn't lose commits

```bash
git revert HEAD

# Before:
A---B---C (HEAD)

# After:
A---B---C---C' (HEAD)
# C' undoes changes from C
```

**When to use:**

**Use reset:**

- Uncommitted changes
- Local commits not pushed
- Want clean history

**Use revert:**

- Published/pushed commits
- Shared branches
- Need audit trail
- Production hotfixes

**Examples:**

```bash
# Remove last local commit
git reset HEAD~1

# Undo pushed commit
git revert HEAD
git push origin main

# Revert specific commit
git revert abc123

# Revert multiple commits
git revert HEAD~3..HEAD
```

## Explain `git cherry-pick` in detail

**Answer:**
`git cherry-pick` applies changes from specific commits to current branch.

**Basic usage:**

```bash
# Pick one commit
git cherry-pick abc123

# Pick multiple commits
git cherry-pick abc123 def456

# Pick range of commits
git cherry-pick abc123..xyz789
```

**Options:**

```bash
# Cherry-pick without committing
git cherry-pick -n abc123
# or
git cherry-pick --no-commit abc123

# Edit commit message
git cherry-pick -e abc123

# Sign-off commit
git cherry-pick -s abc123

# Continue after resolving conflicts
git cherry-pick --continue

# Abort cherry-pick
git cherry-pick --abort

# Skip current commit
git cherry-pick --skip
```

**Use cases:**

### 1. Apply hotfix to multiple branches

```bash
# Hotfix on main
git checkout main
git commit -m "Fix critical bug" # abc123

# Apply to release branch
git checkout release-1.0
git cherry-pick abc123

# Apply to develop
git checkout develop
git cherry-pick abc123
```

### 2. Move commit to different branch

```bash
# Committed to wrong branch
git log # Find commit abc123

# Switch to correct branch
git checkout correct-branch
git cherry-pick abc123

# Remove from wrong branch
git checkout wrong-branch
git reset --hard HEAD~1
```

### 3. Bring feature into branch

```bash
# Feature not ready, but one commit is useful
git cherry-pick feature-branch-commit
```

**Handling conflicts:**

```bash
git cherry-pick abc123
# CONFLICT in file.txt

# Resolve conflict
# Edit file.txt

git add file.txt
git cherry-pick --continue
```

**Pitfalls:**

- Creates duplicate commits (different hashes)
- Can cause confusion
- Conflicts if context changed

## What is `git bisect` and how do you use it?

**Answer:**
`git bisect` uses binary search to find the commit that introduced a bug.

**Workflow:**

### 1. Start bisect

```bash
git bisect start
```

### 2. Mark current (bad) commit

```bash
git bisect bad
```

### 3. Mark known good commit

```bash
git bisect good abc123
```

### 4. Test and mark

Git checks out middle commit. Test and mark:

```bash
# If bug exists
git bisect bad

# If bug doesn't exist
git bisect good
```

### 5. Repeat until found

Git narrows down to culprit commit.

### 6. Finish

```bash
git bisect reset
```

**Complete example:**

```bash
# Start bisect
git bisect start

# Current version is broken
git bisect bad

# Version from last week was good
git bisect good HEAD~20

# Git checks out middle commit
# Test...

# Bug exists
git bisect bad

# Git checks out another commit
# Test...

# Bug doesn't exist
git bisect good

# Continue until:
# abc123 is the first bad commit
# [details of commit]

# Return to original state
git bisect reset
```

**Automated bisect:**

```bash
# Run script to test
git bisect start HEAD abc123
git bisect run ./test-script.sh

# Script should:
# - Exit 0 if good
# - Exit 1-127 (except 125) if bad
# - Exit 125 if can't test
```

**Example test script:**

```bash
#!/bin/bash
# test-script.sh

# Build project
make || exit 125

# Run tests
./run-tests.sh

# Return result
```

**Benefits:**

- Efficient: O(log n) instead of O(n)
- Systematic approach
- Works with any version control history

## What are Git hooks?

**Answer:**
Git hooks are scripts that run automatically at specific points in Git workflow.

**Location:**
`.git/hooks/`

**Types:**

### Client-side hooks

**1. pre-commit**

- Runs before commit
- Check code style, run lints

```bash
#!/bin/sh
# .git/hooks/pre-commit

# Run linter
npm run lint
if [ $? -ne 0 ]; then
    echo "Linting failed"
    exit 1
fi
```

**2. prepare-commit-msg**

- Runs before commit message editor
- Modify default message

**3. commit-msg**

- Runs after commit message entered
- Validate commit message format

```bash
#!/bin/sh
# .git/hooks/commit-msg

commit_msg=$(cat $1)

# Check message format
if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs):"; then
    echo "Commit message must start with feat:, fix:, or docs:"
    exit 1
fi
```

**4. post-commit**

- Runs after commit
- Notifications, logging

**5. pre-push**

- Runs before push
- Run tests, prevent bad pushes

```bash
#!/bin/sh
# .git/hooks/pre-push

# Run tests
npm test
if [ $? -ne 0 ]; then
    echo "Tests failed"
    exit 1
fi
```

### Server-side hooks

**1. pre-receive**

- Runs when receiving push
- Can reject entire push

**2. update**

- Runs once per branch
- Can reject specific branches

**3. post-receive**

- Runs after push accepted
- Deploy, notify, etc.

**Setup:**

```bash
# Create hook
cd .git/hooks
touch pre-commit
chmod +x pre-commit

# Edit with your script
nano pre-commit
```

**Share hooks with team:**

```bash
# Hooks are local (.git/hooks not tracked)
# Solution: Store in repo
mkdir scripts/git-hooks
# Add hook scripts

# Install script
cp scripts/git-hooks/* .git/hooks/
chmod +x .git/hooks/*
```

**Skip hooks:**

```bash
# Skip pre-commit and commit-msg hooks
git commit --no-verify
```

## What is `git stash` in depth?

**Answer:**
`git stash` temporarily shelves changes for later use.

**Basic operations:**

```bash
# Stash changes
git stash

# Stash with message
git stash save "work in progress on feature"

# List stashes
git stash list
# stash@{0}: WIP on main: abc123 Latest commit
# stash@{1}: On feature: def456 Add feature

# Show stash contents
git stash show stash@{0}

# Show with full diff
git stash show -p stash@{0}

# Apply latest stash (keep in stash)
git stash apply

# Apply latest stash (remove from stash)
git stash pop

# Apply specific stash
git stash apply stash@{1}

# Remove specific stash
git stash drop stash@{0}

# Remove all stashes
git stash clear
```

**Advanced options:**

```bash
# Stash including untracked files
git stash -u
# or
git stash --include-untracked

# Stash including ignored files
git stash -a
# or
git stash --all

# Stash only staged changes
git stash --staged

# Stash with patch mode (interactive)
git stash -p

# Create branch from stash
git stash branch new-branch stash@{0}
```

**Stash structure:**
Each stash is actually a commit with parents:

- Parent 1: HEAD when stashed
- Parent 2: Staged changes
- Parent 3: Untracked files (if -u used)

**Use cases:**

### 1. Switch branches with uncommitted changes

```bash
git stash
git checkout other-branch
# Do work
git checkout original-branch
git stash pop
```

### 2. Pull with local changes

```bash
git stash
git pull
git stash pop
```

### 3. Test something without committing

```bash
# Save current work
git stash

# Try something
# ... experiment ...

# Restore work
git stash pop
```

### 4. Split work into multiple commits

```bash
# Stage and stash separately
git stash -p
# Select changes to stash
```

**Handle conflicts:**

```bash
git stash pop
# CONFLICT in file.txt

# Resolve conflict
# Stash is not dropped automatically

# After resolving
git add file.txt
git stash drop
```

## Explain `git submodules`

**Answer:**
Git submodules allow you to keep a Git repository as a subdirectory of another Git repository.

**Use cases:**

- Include external libraries
- Share code between projects
- Maintain separate version control

**Adding submodule:**

```bash
# Add submodule
git submodule add https://github.com/user/repo.git path/to/submodule

# This creates:
# - .gitmodules file
# - Submodule directory
# - Special commit reference
```

**.gitmodules file:**

```ini
[submodule "path/to/submodule"]
    path = path/to/submodule
    url = https://github.com/user/repo.git
```

**Cloning project with submodules:**

```bash
# Option 1: Clone then init
git clone https://github.com/user/main-project.git
cd main-project
git submodule init
git submodule update

# Option 2: Clone with submodules
git clone --recursive https://github.com/user/main-project.git

# Option 3: Clone and init all
git clone --recurse-submodules https://github.com/user/main-project.git
```

**Working with submodules:**

```bash
# Update submodules to latest
git submodule update --remote

# Update specific submodule
git submodule update --remote path/to/submodule

# Pull main project and update submodules
git pull
git submodule update --init --recursive

# Run command in all submodules
git submodule foreach 'git checkout main'

# Check status of all submodules
git submodule status
```

**Making changes to submodule:**

```bash
# Enter submodule directory
cd path/to/submodule

# Make changes
git checkout main
git pull
# ... make changes ...
git commit -am "Update submodule"
git push

# Update main project reference
cd ../..
git add path/to/submodule
git commit -m "Update submodule reference"
git push
```

**Removing submodule:**

```bash
# 1. Deinitialize
git submodule deinit path/to/submodule

# 2. Remove from .git/modules
rm -rf .git/modules/path/to/submodule

# 3. Remove from working tree
git rm path/to/submodule

# 4. Commit
git commit -m "Remove submodule"
```

**Problems with submodules:**

- Complexity
- Easy to forget to update
- Detached HEAD state
- Not beginner-friendly

**Alternative: Git subtree** (sometimes easier)

## What is `git worktree`?

**Answer:**
`git worktree` allows you to have multiple working directories attached to the same repository.

**Use cases:**

- Work on multiple branches simultaneously
- Review PR while keeping current work
- Run tests on one branch while developing on another
- Compare implementations

**Basic usage:**

```bash
# Add worktree
git worktree add ../project-feature feature-branch

# This creates:
# - New directory: ../project-feature
# - Checked out to: feature-branch

# List worktrees
git worktree list

# Output:
# /path/to/main  abc123 [main]
# /path/to/project-feature  def456 [feature-branch]
```

**Create new branch:**

```bash
# Create new branch in worktree
git worktree add ../project-new-feature -b new-feature
```

**Remove worktree:**

```bash
# Remove worktree directory
rm -rf ../project-feature

# Prune worktree reference
git worktree prune

# Or in one command
git worktree remove ../project-feature
```

**Example workflow:**

```bash
# Main work on main branch
cd /path/to/project

# Need to review PR on feature branch
git worktree add ../project-review feature-pr

# Work on review in different terminal
cd ../project-review
# Review, test, etc.

# Back to main work
cd /path/to/project
# Continue working on main

# Done with review
git worktree remove ../project-review
```

**Lock worktree:**

```bash
# Prevent accidental removal
git worktree lock ../project-feature

# Unlock
git worktree unlock ../project-feature
```

**Advantages over multiple clones:**

- Shares object database (saves space)
- Single .git directory
- Faster operations
- Shared configuration

## Explain Git's object model

**Answer:**
Git stores data as objects in a content-addressable filesystem.

**Four object types:**

### 1. Blob (Binary Large Object)

- Stores file contents
- No filename, no metadata
- Identified by SHA-1 hash of contents

### 2. Tree

- Represents directory
- Contains blobs and other trees
- Maps names to blobs/trees

```
tree abc123
├── blob def456 (README.md)
├── blob ghi789 (index.js)
└── tree jkl012 (src/)
    ├── blob mno345 (app.js)
    └── blob pqr678 (utils.js)
```

### 3. Commit

- Points to a tree (project snapshot)
- Contains metadata: author, date, message
- Has parent commits (except initial)

```
commit xyz789
tree: abc123
parent: previous-commit
author: John Doe
date: 2024-01-01
message: Add new feature
```

### 4. Tag

- Reference to specific commit
- Annotated tags (objects)
- Lightweight tags (simple references)

**Object storage:**

```bash
# Objects stored in .git/objects/
.git/objects/ab/cdef123456...

# View object
git cat-file -p abc123

# Show object type
git cat-file -t abc123
```

**Example:**

```bash
# Create file
echo "Hello Git" > hello.txt
git add hello.txt

# Git creates blob
# Hash based on: "blob 10\0Hello Git"

git commit -m "Add hello"

# Git creates:
# 1. Blob for hello.txt
# 2. Tree for root directory
# 3. Commit object pointing to tree
```

**Content-addressable:**

- SHA-1 hash of content is the key
- Same content = same hash = stored once
- Integrity: can't change without changing hash

## What is `git filter-branch` and when is it used?

**Answer:**
`git filter-branch` rewrites Git history (now deprecated in favor of `git filter-repo`).

**Use cases:**

- Remove sensitive data
- Remove large files
- Change email/author globally
- Split repository

**Warning:** Rewrites history - use with caution!

**Examples:**

### 1. Remove file from entire history

```bash
git filter-branch --tree-filter 'rm -f passwords.txt' HEAD
```

### 2. Change email in all commits

```bash
git filter-branch --env-filter '
if [ "$GIT_COMMITTER_EMAIL" = "old@email.com" ]
then
    export GIT_COMMITTER_EMAIL="new@email.com"
    export GIT_AUTHOR_EMAIL="new@email.com"
fi
' HEAD
```

### 3. Extract subdirectory as new repo

```bash
git filter-branch --subdirectory-filter subdir HEAD
```

**Modern alternative: BFG Repo-Cleaner**

```bash
# Remove passwords.txt
bfg --delete-files passwords.txt

# Remove large files
bfg --strip-blobs-bigger-than 10M
```

**Modern alternative: git filter-repo**

```bash
# Install
pip install git-filter-repo

# Remove file
git filter-repo --path passwords.txt --invert-paths

# Change emails
git filter-repo --email-callback '
  return email.replace(b"old@email.com", b"new@email.com")
'
```

**After rewriting:**

```bash
# Force push (affects everyone)
git push --force --all

# Notify team to re-clone
```
