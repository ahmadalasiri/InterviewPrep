# Git Basics - Initialization and Configuration

## Initialize a New Repository

### Create new Git repository

```bash
# Create directory
mkdir my-project
cd my-project

# Initialize Git
git init

# Verify initialization
ls -la .git

# Check status
git status
```

### Initialize with specific branch name

```bash
# Initialize with 'main' as default branch
git init -b main

# Or configure globally
git config --global init.defaultBranch main
```

### Initialize bare repository (for server/central repo)

```bash
# Create bare repository (no working directory)
git init --bare myrepo.git
```

## Git Configuration

### User Configuration

```bash
# Set username globally
git config --global user.name "Your Name"

# Set email globally
git config --global user.email "your.email@example.com"

# Set for current repository only
git config --local user.name "Work Name"
git config --local user.email "work@company.com"
```

### View Configuration

```bash
# View all configuration
git config --list

# View specific setting
git config user.name
git config user.email

# View with source file
git config --list --show-origin

# View only global settings
git config --global --list

# View only local settings
git config --local --list
```

### Editor Configuration

```bash
# Set default editor
git config --global core.editor "code --wait"  # VS Code
git config --global core.editor "vim"          # Vim
git config --global core.editor "nano"         # Nano
git config --global core.editor "subl -w"      # Sublime Text
```

### Diff and Merge Tool Configuration

```bash
# Set diff tool
git config --global diff.tool vscode
git config --global difftool.vscode.cmd 'code --wait --diff $LOCAL $REMOTE'

# Set merge tool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# Or use other tools
git config --global merge.tool meld
git config --global diff.tool meld
```

### Line Ending Configuration

```bash
# Windows (convert LF to CRLF on checkout)
git config --global core.autocrlf true

# Mac/Linux (convert CRLF to LF on commit)
git config --global core.autocrlf input

# No conversion
git config --global core.autocrlf false
```

### Alias Configuration

```bash
# Create shortcuts
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual 'log --graph --oneline --all'

# Usage
git st        # same as: git status
git co main   # same as: git checkout main
git visual    # pretty graph
```

### Color Configuration

```bash
# Enable colors
git config --global color.ui auto

# Specific colors
git config --global color.status auto
git config --global color.branch auto
git config --global color.diff auto
```

### Default Pull Behavior

```bash
# Merge (default)
git config --global pull.rebase false

# Rebase
git config --global pull.rebase true

# Fast-forward only
git config --global pull.ff only
```

### Credential Configuration

```bash
# Cache credentials for 15 minutes
git config --global credential.helper cache

# Cache for specific time (1 hour = 3600 seconds)
git config --global credential.helper 'cache --timeout=3600'

# Store permanently (use with caution)
git config --global credential.helper store

# Windows credential manager
git config --global credential.helper wincred

# Mac keychain
git config --global credential.helper osxkeychain
```

## Verify Installation

### Check Git version

```bash
git --version
```

### Test configuration

```bash
# Create test repository
mkdir git-test
cd git-test
git init

# Create and commit file
echo "# Test Repository" > README.md
git add README.md
git commit -m "Initial commit"

# View log to verify author info
git log
```

## Configuration Files

### Location of config files

```bash
# System level (all users)
# Linux/Mac: /etc/gitconfig
# Windows: C:\Program Files\Git\etc\gitconfig

# Global level (current user)
# Linux/Mac: ~/.gitconfig or ~/.config/git/config
# Windows: C:\Users\<username>\.gitconfig

# Local level (specific repository)
# .git/config

# View file locations
git config --list --show-origin
```

### Edit config files directly

```bash
# Edit global config
git config --global --edit

# Edit local config
git config --local --edit

# Or edit files manually
nano ~/.gitconfig
```

### Example .gitconfig file

```ini
[user]
    name = Your Name
    email = your.email@example.com

[core]
    editor = code --wait
    autocrlf = input

[init]
    defaultBranch = main

[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    lg = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit

[color]
    ui = auto

[pull]
    rebase = false

[push]
    default = simple

[fetch]
    prune = true
```

## Unset Configuration

### Remove configuration

```bash
# Remove specific setting
git config --global --unset user.name

# Remove section
git config --global --remove-section alias
```

## Best Practices

### Essential configurations for new installation

```bash
# User identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Default branch name
git config --global init.defaultBranch main

# Default editor
git config --global core.editor "code --wait"

# Line endings
git config --global core.autocrlf input  # Mac/Linux
git config --global core.autocrlf true   # Windows

# Colors
git config --global color.ui auto

# Pull strategy
git config --global pull.rebase false

# Auto-prune on fetch
git config --global fetch.prune true

# Credential helper
git config --global credential.helper cache --timeout=3600
```

### Project-specific configuration

```bash
# Navigate to project
cd my-project

# Set project-specific email
git config --local user.email "project@company.com"

# Set project-specific settings
git config --local core.fileMode false
```

## Troubleshooting

### Permission denied issues

```bash
# Check SSH key
ssh -T git@github.com

# Generate new SSH key if needed
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### CRLF/LF issues

```bash
# Reset line endings
git config core.autocrlf input
git rm --cached -r .
git reset --hard
```

### Reset configuration

```bash
# Remove global config file
rm ~/.gitconfig

# Reconfigure from scratch
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```
