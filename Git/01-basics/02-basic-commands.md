# Git Basics - Essential Commands

## Status and Information

### Check repository status

```bash
# Full status
git status

# Short format
git status -s
git status --short

# Output format:
# ?? - Untracked
# A  - Added (staged)
# M  - Modified (staged)
#  M - Modified (unstaged)
# MM - Modified (staged and unstaged)
# D  - Deleted
```

### View repository information

```bash
# Show current branch
git branch --show-current

# Show remote URL
git remote -v

# Show last commit
git log -1

# Show repository configuration
git config --list
```

## Adding Files

### Add files to staging area

```bash
# Add specific file
git add filename.txt

# Add multiple files
git add file1.txt file2.txt file3.txt

# Add all files in current directory
git add .

# Add all files in repository
git add -A
git add --all

# Add all modified and deleted files (not new files)
git add -u
git add --update

# Add with pattern
git add *.js
git add src/**/*.py
```

### Interactive adding

```bash
# Interactive mode
git add -i

# Patch mode (select hunks)
git add -p
git add --patch

# Options in patch mode:
# y - stage this hunk
# n - do not stage this hunk
# s - split hunk into smaller hunks
# e - manually edit hunk
# q - quit
```

## Committing Changes

### Basic commit

```bash
# Commit staged files
git commit -m "Commit message"

# Commit with detailed message
git commit -m "Short summary" -m "Detailed description"

# Add all tracked files and commit
git commit -am "Commit message"
git commit -a -m "Commit message"

# Open editor for commit message
git commit
```

### Amend commits

```bash
# Amend last commit (change message)
git commit --amend -m "New message"

# Amend last commit (add more files)
git add forgotten-file.txt
git commit --amend --no-edit

# Amend and change message
git add file.txt
git commit --amend
```

### Empty commits

```bash
# Create empty commit (useful for triggering CI)
git commit --allow-empty -m "Trigger CI"
```

## Viewing History

### Basic log

```bash
# Show commit history
git log

# One line per commit
git log --oneline

# Show last n commits
git log -n 5
git log -5

# Show commits with diffs
git log -p
git log --patch

# Show stats
git log --stat
```

### Formatted log

```bash
# Graph view
git log --graph --oneline --all

# Pretty format
git log --pretty=format:"%h - %an, %ar : %s"

# Common format placeholders:
# %H  - commit hash
# %h  - abbreviated hash
# %an - author name
# %ae - author email
# %ad - author date
# %ar - author date, relative
# %s  - subject (commit message)

# Custom graph
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset'
```

### Filter log

```bash
# By author
git log --author="John Doe"

# By date
git log --since="2 weeks ago"
git log --after="2024-01-01"
git log --before="2024-12-31"
git log --since="2024-01-01" --until="2024-06-30"

# By message
git log --grep="fix"
git log --grep="feature" --grep="bug" --all-match

# By file
git log -- filename.txt
git log --follow -- filename.txt  # Follow renames

# By content
git log -S "function_name"  # Pickaxe

# Merge commits only
git log --merges

# No merge commits
git log --no-merges
```

## Viewing Changes

### Show differences

```bash
# Changes in working directory (unstaged)
git diff

# Changes in staging area (staged)
git diff --staged
git diff --cached

# Differences between commits
git diff abc123 def456
git diff HEAD~2 HEAD

# Differences between branches
git diff main feature-branch

# Specific file
git diff filename.txt

# Summary of changes
git diff --stat

# Word diff
git diff --word-diff
```

### Show commits

```bash
# Show specific commit
git show abc123

# Show last commit
git show HEAD

# Show second to last commit
git show HEAD~1

# Show specific file from commit
git show abc123:path/to/file.txt

# Show commit with stats
git show --stat abc123
```

## Undoing Changes

### Discard working directory changes

```bash
# Discard changes in specific file
git checkout -- filename.txt
# or newer syntax
git restore filename.txt

# Discard all changes
git checkout -- .
git restore .
```

### Unstage files

```bash
# Unstage specific file
git reset HEAD filename.txt
# or newer syntax
git restore --staged filename.txt

# Unstage all files
git reset HEAD
git restore --staged .
```

### Undo commits

```bash
# Undo last commit, keep changes staged
git reset --soft HEAD~1

# Undo last commit, keep changes unstaged
git reset HEAD~1
git reset --mixed HEAD~1

# Undo last commit, discard changes
git reset --hard HEAD~1

# Undo multiple commits
git reset --hard HEAD~3
```

## Removing Files

### Remove files from Git

```bash
# Remove file from Git and working directory
git rm filename.txt

# Remove file from Git only (keep locally)
git rm --cached filename.txt

# Remove directory
git rm -r directory/

# Force remove
git rm -f filename.txt

# Dry run
git rm -n filename.txt
```

## Moving and Renaming

### Move/rename files

```bash
# Rename file
git mv oldname.txt newname.txt

# Move file
git mv file.txt directory/

# Equivalent to:
mv oldname.txt newname.txt
git rm oldname.txt
git add newname.txt
```

## Cleaning Working Directory

### Remove untracked files

```bash
# Dry run (preview)
git clean -n

# Remove untracked files
git clean -f

# Remove untracked files and directories
git clean -fd

# Remove ignored files too
git clean -fdx

# Interactive mode
git clean -i
```

## Ignoring Files

### .gitignore

```bash
# Create .gitignore
touch .gitignore

# Add patterns
echo "node_modules/" >> .gitignore
echo "*.log" >> .gitignore
echo ".env" >> .gitignore
echo "dist/" >> .gitignore

# Commit .gitignore
git add .gitignore
git commit -m "Add gitignore"
```

### .gitignore patterns

```gitignore
# Comments start with #

# Ignore specific file
secrets.txt

# Ignore all files with extension
*.log
*.tmp

# Ignore directory
node_modules/
build/

# Ignore nested directories
**/temp/

# Negation (don't ignore)
!important.log

# Ignore files only in root
/config.json

# Ignore in specific directory
docs/*.pdf
```

### Global gitignore

```bash
# Create global ignore file
touch ~/.gitignore_global

# Add OS-specific files
echo ".DS_Store" >> ~/.gitignore_global
echo "Thumbs.db" >> ~/.gitignore_global
echo ".vscode/" >> ~/.gitignore_global

# Configure Git to use it
git config --global core.excludesfile ~/.gitignore_global
```

### Ignore already tracked files

```bash
# Untrack file
git rm --cached filename.txt

# Add to .gitignore
echo "filename.txt" >> .gitignore

# Commit
git add .gitignore
git commit -m "Untrack and ignore filename.txt"
```

## Tagging

### Create tags

```bash
# Lightweight tag
git tag v1.0.0

# Annotated tag (recommended)
git tag -a v1.0.0 -m "Release version 1.0.0"

# Tag specific commit
git tag -a v0.9.0 abc123 -m "Tag old commit"
```

### List and show tags

```bash
# List all tags
git tag

# List with pattern
git tag -l "v1.*"

# Show tag details
git show v1.0.0
```

### Delete tags

```bash
# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push origin --delete v1.0.0
git push origin :refs/tags/v1.0.0
```

### Push tags

```bash
# Push specific tag
git push origin v1.0.0

# Push all tags
git push --tags
git push origin --tags
```

## Stashing

### Save work temporarily

```bash
# Stash changes
git stash

# Stash with message
git stash save "work in progress"

# Include untracked files
git stash -u
git stash --include-untracked

# Include all files (even ignored)
git stash -a
git stash --all
```

### Apply stashed changes

```bash
# List stashes
git stash list

# Apply last stash
git stash apply

# Apply and remove last stash
git stash pop

# Apply specific stash
git stash apply stash@{2}

# Show stash content
git stash show
git stash show -p stash@{0}
```

### Manage stashes

```bash
# Drop specific stash
git stash drop stash@{0}

# Clear all stashes
git stash clear

# Create branch from stash
git stash branch new-branch-name
```

## Checking File Status

### Blame (who changed what)

```bash
# Show line-by-line authors
git blame filename.txt

# Show with email
git blame -e filename.txt

# Show specific lines
git blame -L 10,20 filename.txt

# Ignore whitespace changes
git blame -w filename.txt
```

## Quick Reference Card

```bash
# Essential daily commands
git status              # Check status
git add .              # Stage all changes
git commit -m "msg"    # Commit changes
git log --oneline      # View history
git diff               # View unstaged changes
git diff --staged      # View staged changes

# Undo commands
git restore file.txt           # Discard changes
git restore --staged file.txt  # Unstage
git reset HEAD~1              # Undo commit

# Clean commands
git clean -fd          # Remove untracked files
git rm --cached file   # Untrack file
git stash             # Save work temporarily
```
