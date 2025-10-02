# Git Advanced - Stash and Clean

## Git Stash Basics

### Save work temporarily

```bash
# Stash all changes (tracked files)
git stash

# Stash with descriptive message
git stash save "work in progress on login feature"

# Stash including untracked files
git stash -u
git stash --include-untracked

# Stash including ignored files
git stash -a
git stash --all

# Stash only staged changes
git stash --staged  # Git 2.35+
```

### List stashes

```bash
# List all stashes
git stash list

# Output format:
# stash@{0}: WIP on main: abc123 Latest commit
# stash@{1}: On feature: def456 Add feature
# stash@{2}: On bugfix: ghi789 Fix bug
```

### Apply stashes

```bash
# Apply latest stash (keep in stash list)
git stash apply

# Apply and remove from list
git stash pop

# Apply specific stash
git stash apply stash@{2}
git stash pop stash@{1}

# Apply to different branch
git checkout other-branch
git stash apply stash@{0}
```

## Viewing Stash Contents

### Show stash summary

```bash
# Show summary of latest stash
git stash show

# Show specific stash
git stash show stash@{1}

# Show with stats
git stash show --stat

# Show full diff
git stash show -p
git stash show --patch
```

### Inspect stash details

```bash
# View stash as commit
git show stash@{0}

# List files in stash
git stash show --name-only

# Show specific file from stash
git show stash@{0}:path/to/file.txt
```

## Managing Stashes

### Remove stashes

```bash
# Remove specific stash
git stash drop stash@{0}

# Remove latest stash
git stash drop

# Remove all stashes
git stash clear
```

### Create branch from stash

```bash
# Create new branch with stash changes
git stash branch new-branch-name

# Create from specific stash
git stash branch new-branch stash@{2}

# Useful when stash conflicts with current branch
```

## Interactive Stashing

### Patch mode stashing

```bash
# Interactively select changes to stash
git stash push -p

# Or older syntax
git stash save --patch

# For each hunk:
# y - stash this hunk
# n - don't stash
# s - split into smaller hunks
# q - quit
```

### Stash specific files

```bash
# Stash only specific files
git stash push -m "stash specific files" file1.txt file2.txt

# Stash files matching pattern
git stash push -m "stash js files" src/**/*.js

# Keep staged, stash unstaged
git stash --keep-index
```

## Advanced Stash Usage

### Multiple stash operations

```bash
# Stash 1: Unfinished feature
git stash save "feature: user authentication"

# Work on hotfix
git checkout -b hotfix
# ... fix bug ...
git commit -am "Fix critical bug"

# Stash 2: Another change
git stash save "experiment: new UI"

# Switch back and restore
git checkout feature-branch
git stash list
git stash apply stash@{1}  # Apply feature stash
```

### Stash partial changes

```bash
# Stash tracked files only
git stash

# Stash everything including untracked
git stash -u

# Stash everything including ignored
git stash -a

# Stash only unstaged changes
git stash --keep-index
```

### Create stash without switching

```bash
# Stash but continue working
git stash push -m "save for later"
# Changes are stashed but also remain in working directory

# Later, just apply
git stash pop
```

## Resolving Stash Conflicts

### Handle apply conflicts

```bash
# Apply stash
git stash pop

# If conflicts occur
# CONFLICT (content): Merge conflict in file.txt

# Resolve conflicts
nano file.txt
# Edit and remove conflict markers

# Stage resolved files
git add file.txt

# Stash is not automatically dropped on conflict
# Remove manually after resolving
git stash drop
```

### Prevent conflicts

```bash
# Apply to clean working directory
git status  # ensure clean
git stash pop

# Or apply without removing
git stash apply
# Test everything works
git stash drop
```

## Git Clean

### Remove untracked files

```bash
# Dry run (preview what will be deleted)
git clean -n
git clean --dry-run

# Remove untracked files
git clean -f
git clean --force

# Remove untracked directories
git clean -fd

# Remove ignored files too
git clean -fdx

# Remove ignored and untracked
git clean -fdX  # only ignored
```

### Interactive clean

```bash
# Interactive mode
git clean -i
git clean --interactive

# Menu options:
# 1: clean
# 2: filter by pattern
# 3: select by numbers
# 4: ask each
# 5: quit
# 6: help
```

### Clean specific paths

```bash
# Clean specific directory
git clean -fd src/

# Clean with pattern
git clean -fd '*.log'

# Exclude pattern
git clean -fd -e important.txt
```

## Clean Options

### Different clean modes

```bash
# Remove untracked files
git clean -f

# Remove untracked files and directories
git clean -fd

# Also remove ignored files
git clean -fdx

# Only remove ignored files
git clean -fdX

# Remove with interactive mode
git clean -fdi
```

### Configure clean behavior

```bash
# Set clean requirement
git config --global clean.requireForce false

# This allows 'git clean' without -f flag
# (Not recommended for safety)
```

## Practical Stash Workflows

### Switch branches with uncommitted work

```bash
# Working on feature-branch with uncommitted changes
git stash save "WIP: authentication feature"

# Switch to main for hotfix
git checkout main
git checkout -b hotfix
# Fix bug
git commit -am "Fix critical bug"

# Back to feature work
git checkout feature-branch
git stash pop
```

### Pull with local changes

```bash
# Have local uncommitted changes
git stash

# Pull latest changes
git pull origin main

# Reapply your changes
git stash pop
```

### Test changes then restore

```bash
# Current state: working on feature
git stash

# Test main branch
git checkout main
# Run tests

# Restore feature work
git checkout feature-branch
git stash pop
```

### Save experiments

```bash
# Try experimental approach
git stash save "experiment: alternative implementation"

# Continue with original approach
# Work on features

# Later, review experiment
git stash list
git stash show -p stash@{0}

# Apply if useful
git stash pop

# Or discard
git stash drop
```

## Combining Stash and Clean

### Complete workspace reset

```bash
# Save work in progress
git stash -u

# Clean everything
git clean -fdx

# Workspace now completely clean

# Restore work
git stash pop
```

### Prepare for branch switch

```bash
# Stash tracked changes
git stash

# Remove untracked files
git clean -fd

# Switch branch
git checkout other-branch

# Clean switch, no interference
```

## Stash Internals

### Stash structure

```bash
# Stash is actually a commit
# With up to 3 parents:
# 1. HEAD when stashed
# 2. Staged changes (index)
# 3. Untracked files (if -u used)

# View as commit
git show stash@{0}

# Show parents
git log --graph stash@{0}
```

### Stash refs

```bash
# Stashes stored in refs
cat .git/refs/stash

# View stash reflog
git reflog show stash
```

## Best Practices

### Stash management

```bash
# Good: Descriptive stash messages
git stash save "WIP: user authentication - login endpoint"

# Bad: Generic messages
git stash  # "WIP on main: abc123 ..."

# Keep stash list clean
git stash list
# If > 5 stashes, clean up old ones
git stash drop stash@{5}

# Create branch for long-term work
# Instead of keeping in stash
git stash branch feature-branch
```

### Clean usage

```bash
# Always dry-run first
git clean -n
# Review what will be deleted

# Then clean
git clean -fd

# Be careful with -x flag
# It removes build artifacts, node_modules, etc.
git clean -fdx  # Use with caution!
```

### Workflow tips

```bash
# Before switching branches
# Option 1: Commit work
git commit -am "WIP: save progress"
# Later: git commit --amend

# Option 2: Stash work
git stash save "WIP: feature X"
# Later: git stash pop

# Option 3: Use worktree
git worktree add ../project-feature feature-branch

# Choose based on:
# - Commit: for longer term work
# - Stash: for quick switches
# - Worktree: for parallel work
```

## Troubleshooting

### Recover dropped stash

```bash
# Accidentally dropped stash
git stash drop stash@{0}

# Find in reflog
git fsck --unreachable | grep commit

# Or
git log --graph --oneline --decorate $(git fsck --no-reflogs | awk '/dangling commit/ {print $3}')

# Restore
git stash apply <commit-hash>
```

### Stash pop conflicts

```bash
# If 'git stash pop' conflicts
# Conflicts marked in files

# Option 1: Resolve and clean up
git add .
git stash drop

# Option 2: Abort
git reset --merge
git stash list  # Stash still there
```

### Clean accidentally deleted files

```bash
# If you cleaned important files
# Check reflog immediately
git reflog

# If files were committed before
git checkout HEAD~1 -- important-file.txt

# If never committed
# Files are lost - no recovery
```

## Quick Reference

```bash
# Stash commands
git stash                    # Save changes
git stash -u                 # Include untracked
git stash list              # List all stashes
git stash show              # Show latest stash
git stash show -p           # Show with diff
git stash apply             # Apply (keep in list)
git stash pop               # Apply and remove
git stash drop              # Remove stash
git stash clear             # Remove all stashes
git stash branch name       # Create branch from stash

# Clean commands
git clean -n                # Dry run
git clean -f                # Remove files
git clean -fd               # Remove files and directories
git clean -fdx              # Also remove ignored
git clean -i                # Interactive mode
```
