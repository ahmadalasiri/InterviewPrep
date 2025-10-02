# Git Branching - Merging

## Basic Merging

### Merge branch into current branch

```bash
# Switch to target branch
git checkout main

# Merge feature branch
git merge feature-branch

# Verify merge
git log --oneline --graph
```

### Fast-forward merge

```bash
# When target hasn't diverged
git checkout main
git merge feature-branch

# Output: "Fast-forward"
# No merge commit created
```

### Three-way merge

```bash
# When both branches have new commits
git checkout main
git merge feature-branch

# Creates merge commit with two parents
# Opens editor for merge commit message
```

## Merge Options

### No fast-forward

```bash
# Always create merge commit
git merge --no-ff feature-branch

# Preserves feature branch history
# Easier to revert entire feature
```

### Fast-forward only

```bash
# Fail if fast-forward not possible
git merge --ff-only feature-branch

# Returns error if branches diverged
# No merge commit created
```

### Squash merge

```bash
# Combine all commits into one
git merge --squash feature-branch

# Changes are staged, not committed
git commit -m "Add feature from feature-branch"

# Linear history, loses individual commits
```

## Merge Strategies

### Recursive (default for two branches)

```bash
# Default strategy
git merge feature-branch

# Explicit recursive
git merge -s recursive feature-branch

# With options
git merge -X theirs feature-branch  # Prefer their changes
git merge -X ours feature-branch    # Prefer our changes
git merge -X ignore-space-change feature-branch
```

### Ours strategy

```bash
# Keep our version entirely
git merge -s ours feature-branch

# Different from -X ours
# This ignores all changes from feature-branch
```

### Octopus (multiple branches)

```bash
# Merge multiple branches at once
git merge branch1 branch2 branch3

# Automatically uses octopus strategy
```

## Merge Commit Messages

### Default merge message

```bash
# Git opens editor with default message
git merge feature-branch

# Default: "Merge branch 'feature-branch'"
```

### Custom merge message

```bash
# Provide message inline
git merge feature-branch -m "Merge user authentication feature"

# No editor, uses provided message
```

### Edit merge message

```bash
# Open editor even for fast-forward
git merge --edit feature-branch

# Add detailed description
# Merge branch 'feature-branch'
#
# This merge brings in user authentication with:
# - Login/logout endpoints
# - JWT token generation
# - Session management
```

### No commit

```bash
# Merge but don't commit
git merge --no-commit feature-branch

# Review changes
git status
git diff --cached

# Commit manually
git commit -m "Custom merge message"
```

## Handling Merge Conflicts

### Identify conflicts

```bash
# Merge with conflicts
git merge feature-branch

# Output:
# CONFLICT (content): Merge conflict in file.txt
# Automatic merge failed

# Check status
git status
# both modified: file.txt
```

### Conflict markers

```
<<<<<<< HEAD (current branch)
Your changes
=======
Their changes (incoming)
>>>>>>> feature-branch
```

### Resolve conflicts manually

```bash
# 1. Open conflicted file
nano file.txt

# 2. Edit file - choose changes
#    Remove conflict markers
#    Keep desired changes

# 3. Stage resolved file
git add file.txt

# 4. Complete merge
git commit
```

### Use merge tools

```bash
# Open merge tool
git mergetool

# Configure merge tool
git config --global merge.tool vimdiff
git config --global merge.tool meld
git config --global merge.tool vscode

# VS Code as merge tool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
```

### Accept ours or theirs

```bash
# Accept our version
git checkout --ours file.txt
git add file.txt

# Accept their version
git checkout --theirs file.txt
git add file.txt

# For all conflicts
git merge -X ours feature-branch   # Prefer ours
git merge -X theirs feature-branch # Prefer theirs
```

### Abort merge

```bash
# Cancel merge, return to pre-merge state
git merge --abort

# Or using reset
git reset --merge
```

## Advanced Merging

### Merge specific files

```bash
# Merge only specific files from branch
git checkout feature-branch -- file.txt directory/

# Stage and commit
git add .
git commit -m "Merge specific files from feature-branch"
```

### Merge without history

```bash
# Get changes but create new commits
git merge --squash feature-branch
git commit -m "Add feature"

# Result: Linear history
```

### Merge and sign

```bash
# Sign merge commit
git merge -S feature-branch

# Configure GPG signing
git config --global user.signingkey YOUR_KEY_ID
git config --global commit.gpgsign true
```

### Merge with no verify

```bash
# Skip pre-commit and commit-msg hooks
git merge --no-verify feature-branch
```

## Verifying Merges

### Before merging

```bash
# View commits to be merged
git log main..feature-branch

# View file changes
git diff main...feature-branch

# Count commits
git rev-list --count main..feature-branch

# Check if merge is possible
git merge-base main feature-branch
```

### After merging

```bash
# View merge commit
git show HEAD

# View merge graphically
git log --oneline --graph --all

# List files changed in merge
git show --name-only HEAD

# Verify all changes
git diff HEAD~1 HEAD
```

## Merge Workflows

### Feature branch merge workflow

```bash
# 1. Update main
git checkout main
git pull origin main

# 2. Update feature branch
git checkout feature-branch
git rebase main

# 3. Merge feature
git checkout main
git merge --no-ff feature-branch

# 4. Push and cleanup
git push origin main
git branch -d feature-branch
git push origin --delete feature-branch
```

### Pull request merge workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes
git commit -am "Implement feature"

# 3. Push to remote
git push -u origin feature/new-feature

# 4. Create PR on GitHub/GitLab

# 5. After review and approval, merge via web interface

# 6. Update local
git checkout main
git pull origin main
git branch -d feature/new-feature
```

### Release branch merge workflow

```bash
# Create release branch from develop
git checkout -b release/v1.2.0 develop

# Prepare release
git commit -am "Bump version to 1.2.0"

# Merge to main
git checkout main
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"

# Merge back to develop
git checkout develop
git merge --no-ff release/v1.2.0

# Delete release branch
git branch -d release/v1.2.0
```

## Undoing Merges

### Before pushing

```bash
# Undo merge (not pushed)
git reset --hard HEAD~1

# Or
git reset --merge

# Keeps changes
git reset --soft HEAD~1
```

### After pushing

```bash
# Revert merge commit
git revert -m 1 HEAD

# -m 1 specifies "keep parent 1" (main branch)
# -m 2 would keep parent 2 (feature branch)

# Find merge commit
git log --merges --oneline

# Revert specific merge
git revert -m 1 abc123
```

### Re-merge after revert

```bash
# After reverting a merge
git revert abc123 -m 1

# To re-merge later:
# 1. Revert the revert
git revert <revert-commit-hash>

# 2. Then merge again
git merge feature-branch
```

## Merge Conflict Strategies

### Prepare for conflict-free merges

```bash
# Keep branch updated
git checkout feature-branch
git fetch origin
git rebase origin/main

# Communicate with team
# Avoid working on same files

# Make atomic commits
# Smaller, focused commits = easier merges
```

### Resolve complex conflicts

```bash
# Use three-way merge view
git mergetool

# Shows:
# LOCAL   - your changes (HEAD)
# BASE    - common ancestor
# REMOTE  - their changes (incoming)
# MERGED  - result

# Or use diff3 conflict style
git config --global merge.conflictstyle diff3

# Conflict markers show base:
<<<<<<< HEAD
Your changes
||||||| base
Original
=======
Their changes
>>>>>>> branch
```

### Prevent conflicts

```bash
# Rebase regularly
git fetch origin
git rebase origin/main

# Test before merging
git merge --no-commit --no-ff feature-branch
# Review changes
git diff --cached
# Abort if issues
git merge --abort
```

## Merge vs Rebase

### When to use merge

```bash
# Shared/public branches
git checkout main
git merge feature-branch

# Preserves complete history
# Shows parallel development
# Safe for collaboration
```

### When to use rebase

```bash
# Personal feature branches
git checkout feature-branch
git rebase main

# Linear history
# Cleaner log
# Before pushing personal work
```

### Hybrid approach

```bash
# Rebase feature branch
git checkout feature-branch
git rebase main

# Merge to main
git checkout main
git merge --no-ff feature-branch

# Best of both worlds
```

## Best Practices

### Merge guidelines

```bash
# 1. Always update before merging
git checkout main
git pull origin main

# 2. Review before merging
git diff main...feature-branch
git log main..feature-branch

# 3. Use --no-ff for features
git merge --no-ff feature-branch

# 4. Write good merge messages
git merge feature-branch -m "Merge feature: user authentication

- Implement login/logout
- Add JWT tokens
- Create middleware
- Update tests"

# 5. Test after merging
npm test
# or
make test

# 6. Push promptly
git push origin main
```

### Avoid common mistakes

```bash
# ❌ DON'T: Merge without updating
git merge feature-branch # outdated main

# ✅ DO: Update first
git pull origin main
git merge feature-branch

# ❌ DON'T: Force push after public merge
git push --force origin main

# ✅ DO: Revert if needed
git revert -m 1 HEAD

# ❌ DON'T: Ignore conflicts
git merge feature-branch
# has conflicts, continues anyway

# ✅ DO: Resolve properly
git merge feature-branch
# resolve conflicts
git add .
git commit
```

### Merge commit conventions

```bash
# Good merge messages
"Merge feature: user authentication"
"Merge fix: memory leak in data processor"
"Merge release: version 1.2.0"

# Bad merge messages
"Merge"
"merged stuff"
"Merge branch 'asdf'"

# Detailed merge message
git merge feature-branch -m "Merge feature: payment integration

This merge brings in the Stripe payment integration:
- Payment processing endpoints
- Webhook handlers
- Payment status tracking
- Error handling and retry logic
- Integration tests

Closes #123, #124"
```
