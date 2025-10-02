# Git Branching - Rebasing

## Basic Rebasing

### Rebase current branch

```bash
# Rebase current branch onto main
git checkout feature-branch
git rebase main

# Git replays feature commits on top of main
```

### How rebase works

```
Before rebase:
main:    A---B---C
              \
feature:       D---E

After rebase:
main:    A---B---C
                  \
feature:           D'---E'
```

### Rebase vs Merge

```bash
# Merge creates merge commit
git merge feature-branch
# Result: A---B---C---M
#              \     /
#               D---E

# Rebase creates linear history
git rebase main
# Result: A---B---C---D'---E'
```

## Interactive Rebase

### Start interactive rebase

```bash
# Rebase last 3 commits
git rebase -i HEAD~3

# Rebase from specific commit
git rebase -i abc123

# Rebase onto branch
git rebase -i main
```

### Interactive rebase editor

```
pick abc123 First commit
pick def456 Second commit
pick ghi789 Third commit

# Commands:
# p, pick   = use commit
# r, reword = use commit, edit message
# e, edit   = use commit, stop for amending
# s, squash = combine with previous commit
# f, fixup  = like squash, discard message
# d, drop   = remove commit
```

### Reorder commits

```
pick ghi789 Third commit
pick abc123 First commit
pick def456 Second commit

# Save and close - commits reordered
```

### Squash commits

```
pick abc123 Add feature
squash def456 Fix typo
squash ghi789 Add tests
squash jkl012 Update docs

# All combined into first commit
# Editor opens to edit combined message
```

### Fixup commits

```
pick abc123 Add feature
fixup def456 Fix bug
fixup ghi789 Another fix

# Like squash but discards commit messages
# Only keeps first commit message
```

### Edit commits

```
pick abc123 First commit
edit def456 Second commit
pick ghi789 Third commit

# Git stops at 'edit' commit
# Make changes
git add .
git commit --amend

# Continue rebase
git rebase --continue
```

### Reword commit messages

```
pick abc123 First commit
reword def456 old message
pick ghi789 Third commit

# Git opens editor for reword commits
# Change message and save
```

### Drop commits

```
pick abc123 Keep this
drop def456 Remove this
pick ghi789 Keep this

# def456 removed from history
```

## Rebase Options

### Rebase with options

```bash
# Keep merge commits
git rebase --preserve-merges main

# Interactive
git rebase -i main

# Autosquash (with fixup!/squash! commits)
git rebase -i --autosquash main

# Continue after resolving conflicts
git rebase --continue

# Skip current commit
git rebase --skip

# Abort rebase
git rebase --abort
```

### Rebase onto different base

```bash
# Rebase feature onto develop instead of main
git rebase --onto develop main feature

# Before:
main:    A---B---C
              \
feature:       D---E---F

# After:
develop: X---Y---Z
                  \
feature:           D'---E'---F'
```

## Handling Rebase Conflicts

### Conflict during rebase

```bash
# Start rebase
git rebase main

# Conflict occurs
# CONFLICT (content): Merge conflict in file.txt

# 1. Check status
git status

# 2. Resolve conflicts
nano file.txt
# Edit and remove conflict markers

# 3. Stage resolved files
git add file.txt

# 4. Continue rebase
git rebase --continue
```

### Multiple conflicts

```bash
# Resolve first conflict
git add file.txt
git rebase --continue

# If more conflicts
# Resolve and continue
git add another-file.txt
git rebase --continue

# Repeat until done
```

### Accept ours or theirs

```bash
# During rebase:
# "ours" = main branch (base)
# "theirs" = your commits (being rebased)

# Accept base version (main)
git checkout --ours file.txt

# Accept your version (feature)
git checkout --theirs file.txt

# Stage and continue
git add file.txt
git rebase --continue
```

### Abort if stuck

```bash
# Cancel rebase
git rebase --abort

# Returns to pre-rebase state
```

## Rebase Strategies

### Keep feature branch updated

```bash
# Regular rebase workflow
git checkout feature-branch

# Fetch latest
git fetch origin

# Rebase onto main
git rebase origin/main

# Force push (if already pushed)
git push --force-with-lease origin feature-branch
```

### Rebase before merge

```bash
# Update feature branch
git checkout feature-branch
git rebase main

# Switch to main and merge
git checkout main
git merge feature-branch

# Result: Clean linear history
```

### Rebase local commits

```bash
# Before pushing, clean up commits
git rebase -i HEAD~5

# Squash, reorder, edit messages
# Then push clean history
git push origin feature-branch
```

## Advanced Rebase Techniques

### Autosquash

```bash
# Create fixup commit
git commit --fixup abc123

# Create squash commit
git commit --squash abc123

# Later, rebase with autosquash
git rebase -i --autosquash main

# Automatically arranges fixup/squash commits
```

### Split commits

```bash
# Start interactive rebase
git rebase -i HEAD~1

# Mark commit as 'edit'
edit abc123 Large commit

# Reset but keep changes
git reset HEAD^

# Stage and commit separately
git add file1.txt
git commit -m "Part 1"

git add file2.txt
git commit -m "Part 2"

# Continue rebase
git rebase --continue
```

### Rebase with exec

```bash
# Run command after each commit
git rebase -i --exec "npm test" HEAD~5

# Git runs npm test after each commit
# Stops if test fails
# Fix and continue or abort
```

### Rebase with strategy

```bash
# Use merge strategy
git rebase -X theirs main
git rebase -X ours main

# Ignore whitespace
git rebase -X ignore-space-change main
```

## Rebase Pitfalls and Solutions

### Golden rule: Never rebase public branches

```bash
# ❌ BAD: Rebase shared branch
git checkout main
git rebase feature # DON'T!

# ✅ GOOD: Only rebase personal branches
git checkout feature
git rebase main
```

### Recover from bad rebase

```bash
# Find pre-rebase state
git reflog

# Reset to before rebase
git reset --hard HEAD@{5}

# Or recreate branch
git branch feature-backup abc123
```

### Force push safely

```bash
# After rebase, need to force push
# ❌ DANGEROUS
git push --force

# ✅ SAFER
git push --force-with-lease

# Only succeeds if remote hasn't changed
```

## Rebase vs Merge Decision Guide

### Use Rebase when:

- Cleaning up local commits before pushing
- Keeping feature branch up-to-date
- You want linear history
- Working on personal branches

```bash
# Good rebase scenario
git checkout feature-branch
git rebase main
git push --force-with-lease origin feature-branch
```

### Use Merge when:

- Integrating features into main/develop
- Working on shared/public branches
- Want to preserve context
- Multiple people on same branch

```bash
# Good merge scenario
git checkout main
git merge --no-ff feature-branch
git push origin main
```

### Hybrid approach

```bash
# Rebase personal feature branch
git checkout feature-branch
git rebase main

# Merge into main
git checkout main
git merge --no-ff feature-branch
```

## Rebase Workflow Examples

### Standard feature development

```bash
# 1. Create feature branch
git checkout -b feature/new-feature main

# 2. Make commits
git commit -am "WIP: feature"
git commit -am "More work"
git commit -am "Fix typo"

# 3. Keep updated (rebase regularly)
git fetch origin
git rebase origin/main

# 4. Clean up commits before PR
git rebase -i origin/main
# Squash, reword, reorder

# 5. Force push
git push --force-with-lease origin feature/new-feature

# 6. Create PR
```

### Fix conflicts during rebase

```bash
# Start rebase
git rebase main
# CONFLICT in file.txt

# Check which commit has conflict
git status

# View conflict
cat file.txt

# Resolve
nano file.txt

# Stage
git add file.txt

# See remaining commits
git rebase --show-current-patch

# Continue
git rebase --continue

# If more conflicts, repeat
# Otherwise, rebase complete
```

### Update PR after rebase

```bash
# Rebase on latest main
git fetch origin
git rebase origin/main

# Resolve any conflicts
git add .
git rebase --continue

# Update PR
git push --force-with-lease origin feature-branch

# PR automatically updates
```

## Best Practices

### Safe rebasing

```bash
# 1. Create backup before rebase
git branch backup-feature

# 2. Rebase
git rebase main

# 3. If successful, delete backup
git branch -d backup-feature

# 4. If failed, restore
git checkout backup-feature
git branch -D feature-branch
git branch feature-branch
```

### Clean commit history

```bash
# Before PR, clean up
git rebase -i origin/main

# Good commit history:
pick abc123 feat: add user authentication
pick def456 feat: add password hashing
pick ghi789 test: add auth tests
pick jkl012 docs: update API docs

# Not this:
pick abc123 WIP
pick def456 fix
pick ghi789 more fixes
pick jkl012 oops
pick mno345 final fix
```

### Rebase guidelines

```bash
# DO:
- Rebase personal branches
- Rebase before creating PR
- Use --force-with-lease
- Clean up commit history
- Test after rebase

# DON'T:
- Rebase public/shared branches
- Rebase main or develop
- Use --force without --force-with-lease
- Rebase after others have based work on your commits
- Rebase very old branches (merge instead)
```

### Communication

```bash
# Before rebasing shared branch (rare cases):
# 1. Notify team
# 2. Ensure nobody has pending work
# 3. Rebase
# 4. Force push
# 5. Team must reset:
git fetch origin
git reset --hard origin/branch-name
```

## Troubleshooting Rebase

### Rebase hell (multiple conflicts)

```bash
# Too many conflicts?
git rebase --abort

# Use merge instead
git merge main
```

### Lost commits after rebase

```bash
# Find lost commits
git reflog

# Restore
git cherry-pick abc123
# or
git reset --hard HEAD@{10}
```

### Rebase already pushed commits

```bash
# If you must rebase pushed commits:
# 1. Notify team
echo "Rebasing feature-branch, will force push"

# 2. Rebase
git rebase main

# 3. Force push
git push --force-with-lease origin feature-branch

# 4. Team updates:
git fetch origin
git reset --hard origin/feature-branch
```
