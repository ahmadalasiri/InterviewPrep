# Git Practical Scenarios & Problem Solving

## Scenario: I committed to the wrong branch. How do I fix it?

**Answer:**

### If you haven't pushed:

**Method 1: Cherry-pick**

```bash
# On wrong branch
git log  # Find commit hash (abc123)

# Switch to correct branch
git checkout correct-branch

# Cherry-pick the commit
git cherry-pick abc123

# Go back and remove from wrong branch
git checkout wrong-branch
git reset --hard HEAD~1
```

**Method 2: Reset and re-commit**

```bash
# On wrong branch
git reset --soft HEAD~1
# Changes now unstaged

# Stash changes
git stash

# Switch to correct branch
git checkout correct-branch

# Apply and commit
git stash pop
git add .
git commit -m "Correct commit message"
```

### If you already pushed:

```bash
# Cherry-pick to correct branch
git checkout correct-branch
git cherry-pick abc123
git push origin correct-branch

# Revert on wrong branch
git checkout wrong-branch
git revert abc123
git push origin wrong-branch
```

## Scenario: I need to undo my last commit but keep the changes

**Answer:**

```bash
# Undo last commit, keep changes staged
git reset --soft HEAD~1

# Undo last commit, keep changes unstaged
git reset HEAD~1
# or
git reset --mixed HEAD~1

# Now you can:
# - Edit files more
# - Stage selectively
# - Make multiple commits
# - Amend and recommit
```

**If already pushed:**

```bash
# Don't reset pushed commits
# Instead, make a new commit with changes
git commit --amend
# Then force push (if on personal branch)
git push --force-with-lease origin feature
```

## Scenario: How do I undo a pushed commit?

**Answer:**

### Option 1: Revert (Recommended for shared branches)

```bash
# Create new commit that undoes changes
git revert HEAD
git push origin main

# Revert specific commit
git revert abc123

# Revert multiple commits
git revert HEAD~3..HEAD

# Revert without auto-commit
git revert -n abc123
```

### Option 2: Reset (Only for personal branches)

```bash
# Reset locally
git reset --hard HEAD~1

# Force push
git push --force-with-lease origin feature-branch
```

**Important:** Never force push to shared branches (main, develop)!

## Scenario: I accidentally deleted a branch. How do I recover it?

**Answer:**

### If not pushed (local only):

```bash
# Find the commit using reflog
git reflog

# Look for the branch deletion or last commit
# abc123 HEAD@{5}: commit: Last commit on deleted branch

# Recreate branch
git branch deleted-branch abc123

# Or checkout directly
git checkout -b deleted-branch abc123
```

### If it was pushed to remote:

```bash
# Check remote branches
git branch -r

# If still on remote
git checkout -b deleted-branch origin/deleted-branch

# If deleted from remote too
git reflog
git branch deleted-branch <commit-hash>
```

## Scenario: How do I remove a file from Git but keep it locally?

**Answer:**

```bash
# Remove from Git but keep local file
git rm --cached filename.txt

# For directories
git rm -r --cached directory/

# Commit the removal
git commit -m "Remove file from Git"

# Add to .gitignore to prevent re-adding
echo "filename.txt" >> .gitignore
git add .gitignore
git commit -m "Add to gitignore"
```

**Common use case: Accidentally committed .env file**

```bash
git rm --cached .env
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Remove .env from tracking"
git push origin main
```

## Scenario: I need to change the commit message of my last commit

**Answer:**

### If not pushed:

```bash
# Change last commit message
git commit --amend -m "New commit message"

# Or open editor
git commit --amend
```

### If already pushed:

```bash
# Amend locally
git commit --amend -m "New message"

# Force push (if on personal branch)
git push --force-with-lease origin feature-branch
```

### Change older commit message:

```bash
# Interactive rebase
git rebase -i HEAD~3

# Change 'pick' to 'reword' for commits you want to edit
# Save and close
# Editor opens for each commit
```

## Scenario: How do I resolve "diverged branches" error?

**Answer:**

Error message:

```
Your branch and 'origin/main' have diverged,
and have 2 and 3 different commits each, respectively.
```

### Option 1: Merge (preserves history)

```bash
git pull origin main
# or explicitly
git fetch origin
git merge origin/main

# Resolve conflicts if any
git add .
git commit
git push origin main
```

### Option 2: Rebase (clean history)

```bash
git pull --rebase origin main
# or
git fetch origin
git rebase origin/main

# Resolve conflicts if any
git add .
git rebase --continue

git push origin main
```

### Option 3: Reset (if your local commits aren't needed)

```bash
# Discard local commits
git reset --hard origin/main
```

## Scenario: How do I squash multiple commits into one?

**Answer:**

### Method 1: Interactive Rebase

```bash
# Squash last 3 commits
git rebase -i HEAD~3

# In editor, change 'pick' to 'squash' (or 's')
pick abc123 First commit
squash def456 Second commit
squash ghi789 Third commit

# Save and close
# Edit combined commit message
```

### Method 2: Reset and Recommit

```bash
# Reset 3 commits but keep changes
git reset --soft HEAD~3

# All changes now staged
# Make one commit
git commit -m "Squashed commit message"
```

### Method 3: Merge with Squash

```bash
# From main branch
git merge --squash feature-branch
git commit -m "Add feature from feature-branch"
```

## Scenario: I need to apply changes from one commit to multiple branches

**Answer:**

```bash
# Identify commit hash
git log  # abc123

# Apply to first branch
git checkout branch1
git cherry-pick abc123

# Apply to second branch
git checkout branch2
git cherry-pick abc123

# Apply to third branch
git checkout branch3
git cherry-pick abc123

# Push all
git push origin branch1 branch2 branch3
```

**Automated approach:**

```bash
#!/bin/bash
commit="abc123"
branches=("branch1" "branch2" "branch3")

for branch in "${branches[@]}"; do
    git checkout "$branch"
    git cherry-pick "$commit"
    git push origin "$branch"
done
```

## Scenario: How do I undo all uncommitted changes?

**Answer:**

### Discard changes in working directory:

```bash
# Specific file
git checkout -- filename.txt
# or newer syntax
git restore filename.txt

# All files
git checkout -- .
# or
git restore .
```

### Discard changes in staging area:

```bash
# Unstage file
git reset HEAD filename.txt
# or
git restore --staged filename.txt

# Unstage all
git reset HEAD
```

### Discard everything (working directory + staging):

```bash
git reset --hard HEAD
```

### Also remove untracked files:

```bash
# Preview what will be deleted
git clean -n

# Delete untracked files
git clean -f

# Delete untracked files and directories
git clean -fd

# Include ignored files
git clean -fdx
```

## Scenario: I pushed sensitive data (passwords, keys). How do I remove it completely?

**Answer:**

**⚠️ Critical:** Change the credentials immediately! Removing from Git doesn't invalidate compromised secrets.

### Step 1: Remove from history

**Using BFG Repo-Cleaner (recommended):**

```bash
# Install BFG
# https://rtyley.github.io/bfg-repo-cleaner/

# Clone mirror
git clone --mirror https://github.com/user/repo.git

# Remove file
bfg --delete-files passwords.txt repo.git

# Or replace text
bfg --replace-text passwords.txt repo.git

# Clean up
cd repo.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push --force
```

**Using git filter-repo:**

```bash
# Install
pip install git-filter-repo

# Remove file from history
git filter-repo --path passwords.txt --invert-paths

# Force push
git push --force --all
```

**Using git filter-branch (legacy):**

```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch passwords.txt" \
  --prune-empty --tag-name-filter cat -- --all

# Force push
git push --force --all
git push --force --tags
```

### Step 2: Clean local repo

```bash
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Step 3: Notify team

Everyone must re-clone:

```bash
git clone https://github.com/user/repo.git
```

### Step 4: Revoke compromised credentials

- Rotate passwords
- Revoke API keys
- Rotate certificates
- Update all services

## Scenario: How do I find which commit introduced a bug?

**Answer:**

### Method 1: Git Bisect (recommended)

```bash
# Start bisect
git bisect start

# Current version has bug
git bisect bad

# Last known good commit
git bisect good v1.0.0

# Git checks out middle commit
# Test for bug...

# Mark as bad or good
git bisect bad  # or: git bisect good

# Repeat until found
# Git will identify: "abc123 is the first bad commit"

# Finish
git bisect reset
```

### Method 2: Automated Bisect

```bash
# Create test script
cat > test.sh << 'EOF'
#!/bin/bash
npm test
EOF
chmod +x test.sh

# Run automated bisect
git bisect start HEAD v1.0.0
git bisect run ./test.sh
```

### Method 3: Manual Search

```bash
# Search commit messages
git log --grep="feature" --oneline

# Search code changes
git log -S "functionName" --oneline

# Show commits that changed a file
git log --follow -- filename.txt

# Blame (line-by-line)
git blame filename.txt
```

## Scenario: How do I keep my fork updated with the original repository?

**Answer:**

### Initial setup:

```bash
# Clone your fork
git clone https://github.com/yourname/repo.git
cd repo

# Add upstream remote
git remote add upstream https://github.com/original/repo.git

# Verify
git remote -v
```

### Regular sync:

```bash
# Fetch upstream changes
git fetch upstream

# Switch to main branch
git checkout main

# Merge upstream changes
git merge upstream/main

# Push to your fork
git push origin main
```

### Keep feature branch updated:

```bash
# Option 1: Merge
git checkout feature-branch
git merge main
git push origin feature-branch

# Option 2: Rebase (cleaner)
git checkout feature-branch
git rebase main
git push --force-with-lease origin feature-branch
```

### Automated script:

```bash
#!/bin/bash
# sync-fork.sh

git fetch upstream
git checkout main
git merge upstream/main
git push origin main

echo "Fork synced with upstream"
```

## Scenario: I have merge conflicts. How do I resolve them?

**Answer:**

### Step 1: Identify conflicts

```bash
git status
# Both modified: file.txt

git diff
# Shows conflict markers
```

### Step 2: Understand conflict markers

```
<<<<<<< HEAD (your changes)
Your code here
=======
Their code here
>>>>>>> branch-name (incoming changes)
```

### Step 3: Resolve manually

**Option 1: Edit file**

```bash
# Open file, choose which changes to keep
# Remove conflict markers
# Save file
```

**Option 2: Use theirs/ours**

```bash
# Keep yours
git checkout --ours file.txt

# Keep theirs
git checkout --theirs file.txt
```

### Step 4: Mark as resolved

```bash
git add file.txt
```

### Step 5: Complete merge

```bash
# For merge
git commit

# For rebase
git rebase --continue

# For cherry-pick
git cherry-pick --continue
```

### Using merge tools:

```bash
# Configure merge tool
git config --global merge.tool vimdiff

# Run merge tool
git mergetool

# Or use VS Code
code --wait --merge source target base output
```

### Abort if needed:

```bash
# Abort merge
git merge --abort

# Abort rebase
git rebase --abort

# Abort cherry-pick
git cherry-pick --abort
```

## Scenario: How do I revert a merge commit?

**Answer:**

Merge commits have two parents.

### Find the merge commit:

```bash
git log --oneline --graph
# *   abc123 (HEAD) Merge branch 'feature'
# |\
# | * def456 Feature commit
# |/
# * ghi789 Main commit
```

### Revert with parent specification:

```bash
# Revert to first parent (main branch)
git revert -m 1 abc123

# -m 1 means "keep parent 1" (main)
# -m 2 means "keep parent 2" (feature)
```

### Understand parent numbers:

```bash
git show abc123
# Merge: ghi789 def456
#        ^       ^
#      parent1  parent2
```

### If you want to re-merge later:

```bash
# After reverting merge
git revert abc123 -m 1

# Later, to re-merge:
# You need to revert the revert!
git revert <revert-commit-hash>
git merge feature
```

**Alternative: Reset** (if not pushed)

```bash
git reset --hard HEAD~1
```

## Scenario: How do I split a large commit into smaller ones?

**Answer:**

### Method 1: Interactive Rebase with Edit

```bash
# Start interactive rebase
git rebase -i HEAD~1

# Change 'pick' to 'edit'
edit abc123 Large commit

# Reset but keep changes
git reset HEAD^

# Stage and commit in parts
git add file1.txt
git commit -m "Part 1: Feature A"

git add file2.txt file3.txt
git commit -m "Part 2: Feature B"

git add .
git commit -m "Part 3: Remaining changes"

# Continue rebase
git rebase --continue
```

### Method 2: Patch Mode

```bash
# Reset last commit
git reset HEAD^

# Add interactively
git add -p

# For each hunk:
# y - stage this hunk
# n - don't stage
# s - split into smaller hunks
# e - manually edit hunk

# Commit first part
git commit -m "Part 1"

# Repeat for other parts
git add -p
git commit -m "Part 2"
```

### Method 3: Reset and Recommit

```bash
# Reset keeping changes
git reset --soft HEAD~1

# Unstage everything
git reset

# Add and commit selectively
git add file1.txt
git commit -m "Add file1"

git add file2.txt
git commit -m "Add file2"
```

## Scenario: How do I work on two features simultaneously?

**Answer:**

### Method 1: Git Worktree (recommended)

```bash
# Main work on feature-1
cd /project
git checkout feature-1

# Add worktree for feature-2
git worktree add ../project-feature2 feature-2

# Work on feature-2 in another terminal/window
cd ../project-feature2
# Make changes

# Switch between them easily
# Both directories work independently
```

### Method 2: Git Stash

```bash
# Working on feature-1
git add .
git stash save "feature-1 WIP"

# Switch to feature-2
git checkout feature-2
# Work on feature-2
git commit -am "feature-2 progress"

# Back to feature-1
git checkout feature-1
git stash pop
```

### Method 3: Branch Switching

```bash
# Commit WIP on feature-1
git add .
git commit -m "WIP: feature-1"

# Work on feature-2
git checkout feature-2
# Make changes
git commit -am "feature-2 changes"

# Back to feature-1
git checkout feature-1

# Amend WIP commit when done
git commit --amend
```

## Scenario: How do I create a clean pull request history?

**Answer:**

### Before creating PR:

**1. Update from main**

```bash
git checkout feature-branch
git fetch origin
git rebase origin/main
```

**2. Squash WIP commits**

```bash
git rebase -i origin/main

# Squash all commits or organize logically
pick abc123 Add feature
squash def456 WIP
squash ghi789 Fix typo
squash jkl012 More WIP
```

**3. Clean commit messages**

```bash
# Reword commit messages
git rebase -i HEAD~3

# Change 'pick' to 'reword'
reword abc123 Implement user authentication
reword def456 Add error handling for auth
reword ghi789 Update tests for auth
```

**4. Run tests**

```bash
npm test
# or
make test
```

**5. Force push**

```bash
git push --force-with-lease origin feature-branch
```

### During PR:

**Respond to feedback:**

```bash
# Make requested changes
git add .
git commit -m "Address review comments"
git push origin feature-branch
```

**Update PR from main:**

```bash
git fetch origin
git rebase origin/main
git push --force-with-lease origin feature-branch
```

### Example clean history:

```
* Add user authentication feature
* Implement password hashing
* Add authentication middleware
* Update documentation
```

Not:

```
* WIP
* Fix
* More fixes
* Oops
* Merge main
* Resolve conflicts
```
