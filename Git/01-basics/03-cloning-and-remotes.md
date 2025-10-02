# Git Basics - Cloning and Remote Repositories

## Cloning Repositories

### Basic cloning

```bash
# Clone a repository
git clone https://github.com/username/repository.git

# Clone into specific directory
git clone https://github.com/username/repository.git my-directory

# Clone specific branch
git clone -b develop https://github.com/username/repository.git

# Clone with different remote name
git clone -o upstream https://github.com/username/repository.git
```

### Clone options

```bash
# Shallow clone (limited history)
git clone --depth 1 https://github.com/username/repository.git

# Clone only specific branch
git clone --single-branch --branch main https://github.com/username/repository.git

# Clone without checkout
git clone --no-checkout https://github.com/username/repository.git

# Bare clone (no working directory)
git clone --bare https://github.com/username/repository.git

# Mirror clone (complete mirror)
git clone --mirror https://github.com/username/repository.git

# Recursive clone (with submodules)
git clone --recursive https://github.com/username/repository.git
git clone --recurse-submodules https://github.com/username/repository.git
```

### Clone protocols

```bash
# HTTPS
git clone https://github.com/username/repository.git

# SSH
git clone git@github.com:username/repository.git

# Git protocol (read-only)
git clone git://github.com/username/repository.git

# Local filesystem
git clone /path/to/repository.git
git clone file:///path/to/repository.git
```

## Managing Remotes

### View remotes

```bash
# List remotes
git remote

# List with URLs
git remote -v

# Show detailed information
git remote show origin

# Get URL of remote
git remote get-url origin
```

### Add remotes

```bash
# Add new remote
git remote add origin https://github.com/username/repository.git

# Add upstream (for forks)
git remote add upstream https://github.com/original/repository.git

# Verify
git remote -v
```

### Remove remotes

```bash
# Remove remote
git remote remove origin
git remote rm origin
```

### Rename remotes

```bash
# Rename remote
git remote rename origin upstream
```

### Change remote URL

```bash
# Set new URL
git remote set-url origin https://github.com/username/new-repository.git

# Change from HTTPS to SSH
git remote set-url origin git@github.com:username/repository.git

# Change from SSH to HTTPS
git remote set-url origin https://github.com/username/repository.git

# Add additional push URL
git remote set-url --add --push origin https://github.com/username/repo2.git
```

## Fetching from Remote

### Basic fetch

```bash
# Fetch from origin
git fetch origin

# Fetch specific branch
git fetch origin main

# Fetch from all remotes
git fetch --all

# Fetch and prune deleted remote branches
git fetch --prune
git fetch -p
```

### View fetched changes

```bash
# Fetch changes
git fetch origin

# View commits not in local branch
git log HEAD..origin/main

# View file differences
git diff main origin/main

# View changes to specific file
git diff main origin/main -- filename.txt
```

## Pulling from Remote

### Basic pull

```bash
# Pull from current branch's upstream
git pull

# Pull from specific remote and branch
git pull origin main

# Pull from all remotes
git pull --all
```

### Pull strategies

```bash
# Pull with merge (default)
git pull origin main

# Pull with rebase
git pull --rebase origin main

# Pull with fast-forward only
git pull --ff-only origin main

# Pull without commit (review first)
git pull --no-commit origin main
```

### Configure default pull behavior

```bash
# Set merge as default
git config pull.rebase false

# Set rebase as default
git config pull.rebase true

# Set fast-forward only
git config pull.ff only
```

## Pushing to Remote

### Basic push

```bash
# Push current branch to remote
git push

# Push to specific remote and branch
git push origin main

# Push and set upstream tracking
git push -u origin main
git push --set-upstream origin main

# Push all branches
git push --all

# Push all tags
git push --tags
```

### Force push

```bash
# Force push (dangerous!)
git push --force origin main

# Force push with lease (safer)
git push --force-with-lease origin main

# Force push specific branch
git push --force origin feature-branch
```

### Push new branches

```bash
# Create and push new branch
git checkout -b feature-branch
git push -u origin feature-branch

# Push local branch to different remote branch name
git push origin local-branch:remote-branch
```

### Delete remote branches

```bash
# Delete remote branch
git push origin --delete feature-branch

# Alternative syntax
git push origin :feature-branch
```

## Tracking Branches

### Set up tracking

```bash
# Create local branch tracking remote
git checkout -b feature origin/feature

# Shorthand (if remote branch exists)
git checkout feature

# Set upstream for existing branch
git branch --set-upstream-to=origin/feature feature
git branch -u origin/feature feature

# Set upstream while pushing
git push -u origin feature
```

### View tracking branches

```bash
# Show tracking branches
git branch -vv

# Show all remote branches
git branch -r

# Show all branches (local and remote)
git branch -a
```

### Unset tracking

```bash
# Remove upstream
git branch --unset-upstream feature
```

## Sync Fork with Upstream

### Setup (one time)

```bash
# Clone your fork
git clone https://github.com/yourname/repository.git
cd repository

# Add upstream remote
git remote add upstream https://github.com/original/repository.git

# Verify remotes
git remote -v
# origin    https://github.com/yourname/repository.git (fetch)
# origin    https://github.com/yourname/repository.git (push)
# upstream  https://github.com/original/repository.git (fetch)
# upstream  https://github.com/original/repository.git (push)
```

### Regular sync

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

### Sync with rebase

```bash
# Fetch upstream
git fetch upstream

# Rebase your main on upstream
git checkout main
git rebase upstream/main

# Force push to your fork
git push --force-with-lease origin main
```

## Prune Remote References

### Remove stale remote-tracking branches

```bash
# Preview what will be pruned
git remote prune origin --dry-run

# Prune deleted remote branches
git remote prune origin

# Prune during fetch
git fetch --prune

# Configure auto-prune
git config --global fetch.prune true
```

## Working with Multiple Remotes

### Setup multiple remotes

```bash
# Add origin (your fork)
git remote add origin https://github.com/yourname/repository.git

# Add upstream (original repo)
git remote add upstream https://github.com/original/repository.git

# Add deploy (production server)
git remote add deploy user@server:/path/to/repo.git

# View all remotes
git remote -v
```

### Fetch from multiple remotes

```bash
# Fetch from all
git fetch --all

# Fetch from specific remote
git fetch origin
git fetch upstream
```

### Push to multiple remotes

```bash
# Push to specific remotes
git push origin main
git push upstream main

# Configure to push to multiple remotes
git remote set-url --add --push origin https://github.com/user/repo1.git
git remote set-url --add --push origin https://github.com/user/repo2.git

# Now one push command pushes to both
git push origin main
```

## Clone Large Repositories

### Optimize for large repos

```bash
# Shallow clone
git clone --depth 1 https://github.com/username/large-repo.git

# Clone only main branch
git clone --single-branch --branch main https://github.com/username/large-repo.git

# Partial clone (Git 2.19+)
git clone --filter=blob:none https://github.com/username/large-repo.git

# Sparse checkout (specific directories)
git clone --no-checkout https://github.com/username/large-repo.git
cd large-repo
git sparse-checkout init --cone
git sparse-checkout set src/specific-dir
git checkout main
```

### Convert shallow to full

```bash
# Unshallow a repository
git fetch --unshallow

# Or
git pull --unshallow
```

## Authentication

### HTTPS with token

```bash
# Cache credentials
git config --global credential.helper cache

# Cache for 1 hour
git config --global credential.helper 'cache --timeout=3600'

# Store credentials (plaintext - use with caution)
git config --global credential.helper store

# Clone with token in URL (not recommended)
git clone https://username:token@github.com/username/repository.git
```

### SSH authentication

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Start SSH agent
eval "$(ssh-agent -s)"

# Add key to agent
ssh-add ~/.ssh/id_ed25519

# Copy public key to clipboard
cat ~/.ssh/id_ed25519.pub
# Add to GitHub/GitLab in settings

# Test connection
ssh -T git@github.com

# Clone with SSH
git clone git@github.com:username/repository.git
```

## Troubleshooting Remote Issues

### Connection issues

```bash
# Test SSH connection
ssh -T git@github.com

# Test with verbose output
GIT_SSH_COMMAND="ssh -v" git fetch

# Check remote URL
git remote -v

# Verify remote exists
git ls-remote origin
```

### Reset remote tracking

```bash
# Remove all remote tracking branches
git branch -r | grep origin | grep -v 'master\|main' | xargs git branch -rd

# Re-fetch
git fetch origin
```

### Fix detached HEAD after clone

```bash
# Checkout a branch
git checkout main
```

## Remote Repository Information

### View remote details

```bash
# Show remote info
git remote show origin

# List remote branches
git ls-remote --heads origin

# List remote tags
git ls-remote --tags origin

# List all references
git ls-remote origin

# Show tracking branches
git branch -vv
```

## Best Practices

### Recommended workflow

```bash
# 1. Clone repository
git clone https://github.com/username/repository.git
cd repository

# 2. Create feature branch
git checkout -b feature-branch

# 3. Make changes and commit
git add .
git commit -m "Add feature"

# 4. Keep branch updated
git fetch origin
git rebase origin/main

# 5. Push to remote
git push -u origin feature-branch

# 6. Create pull request on GitHub/GitLab

# 7. After merge, update local
git checkout main
git pull origin main
git branch -d feature-branch
git push origin --delete feature-branch
```

### Safety tips

```bash
# Always fetch before pull
git fetch origin
git merge origin/main

# Use --force-with-lease instead of --force
git push --force-with-lease origin feature

# Verify before pushing
git log origin/main..HEAD
git diff origin/main

# Backup before destructive operations
git branch backup-branch
```
