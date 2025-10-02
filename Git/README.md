# Git Learning Resources

A comprehensive guide to Git version control, from basics to advanced concepts, with practical examples and interview preparation materials.

## 📚 Contents

### 00. Interview Preparation

Complete set of interview questions with detailed answers:

- [Basic Questions](00-interview-preparation/01-basic-questions.md) - Git fundamentals, basic commands, repository basics
- [Branching & Merging Questions](00-interview-preparation/02-branching-questions.md) - Branch management, merge strategies, conflict resolution
- [Remote Operations Questions](00-interview-preparation/03-remote-questions.md) - Working with remotes, push/pull operations
- [Advanced Questions](00-interview-preparation/04-advanced-questions.md) - Rebase, cherry-pick, reflog, Git internals
- [Practical Scenarios](00-interview-preparation/05-practical-questions.md) - Real-world problem solving and troubleshooting

### 01. Basics

Essential Git commands and concepts:

- [Initialization & Configuration](01-basics/01-initialization.md) - Setting up Git, user configuration, aliases
- [Basic Commands](01-basics/02-basic-commands.md) - Status, add, commit, log, diff, and more
- [Cloning & Remotes](01-basics/03-cloning-and-remotes.md) - Working with remote repositories, fetch, pull, push

### 02. Branching

Branch operations and workflows:

- [Branch Operations](02-branching/01-branch-operations.md) - Creating, switching, deleting, tracking branches
- [Merging](02-branching/02-merging.md) - Merge strategies, conflict resolution, merge workflows
- [Rebasing](02-branching/03-rebasing.md) - Interactive rebase, rebase vs merge, best practices

### 03. Advanced

Advanced Git techniques:

- [Stash & Clean](03-advanced/01-stash-and-clean.md) - Temporarily save work, clean working directory
- [Cherry-pick & Revert](03-advanced/02-cherry-pick-and-revert.md) - Selective commit application, undoing changes
- [Bisect & Debugging](03-advanced/03-bisect-and-debugging.md) - Finding bugs, blame, grep, reflog

### 04. Collaboration

Team workflows and best practices:

- [Workflows](04-collaboration/01-workflows.md) - GitHub Flow, Git Flow, GitLab Flow, Trunk-Based Development

## 🚀 Quick Start

### Installation

**Linux (Debian/Ubuntu):**

```bash
sudo apt-get update
sudo apt-get install git
```

**macOS:**

```bash
# Using Homebrew
brew install git

# Or download from git-scm.com
```

**Windows:**

- Download from [git-scm.com](https://git-scm.com/download/win)
- Or use [GitHub Desktop](https://desktop.github.com/)

### Initial Configuration

```bash
# Set your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default editor
git config --global core.editor "code --wait"  # VS Code
git config --global core.editor "vim"          # Vim

# Set default branch name
git config --global init.defaultBranch main

# Enable colors
git config --global color.ui auto

# Verify configuration
git config --list
```

### First Repository

```bash
# Create new repository
mkdir my-project
cd my-project
git init

# Add files
echo "# My Project" > README.md
git add README.md

# First commit
git commit -m "Initial commit"

# Connect to remote (GitHub/GitLab)
git remote add origin https://github.com/username/my-project.git
git push -u origin main
```

## 📖 Learning Path

### Beginner (Week 1-2)

1. **Basics** - Start here if you're new to Git

   - Git installation and configuration
   - Basic commands: init, add, commit, status, log
   - Understanding Git's three states
   - .gitignore and file tracking

2. **Remote Repositories**
   - Cloning repositories
   - Working with GitHub/GitLab
   - Push and pull operations
   - Basic collaboration

### Intermediate (Week 3-4)

3. **Branching**

   - Creating and switching branches
   - Merging branches
   - Resolving conflicts
   - Branch management

4. **Collaboration**
   - Pull requests
   - Code review process
   - Team workflows
   - Branch protection

### Advanced (Week 5-6)

5. **Advanced Techniques**

   - Interactive rebase
   - Cherry-pick and revert
   - Stashing work
   - Git bisect for debugging

6. **Mastery**
   - Git internals
   - Advanced workflows
   - Troubleshooting
   - Best practices

### Interview Preparation

- Review all interview question files
- Practice scenarios in practical questions
- Set up test repositories to experiment
- Join open source projects for real experience

## 🎯 Common Workflows

### Feature Development

```bash
# Start feature
git checkout -b feature/new-feature main
git push -u origin feature/new-feature

# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# Keep updated
git fetch origin
git rebase origin/main

# Create pull request
# After merge, cleanup
git checkout main
git pull origin main
git branch -d feature/new-feature
```

### Bug Fix

```bash
# Create fix branch
git checkout -b fix/bug-description main

# Fix the bug
git commit -am "Fix: resolve issue with login"
git push -u origin fix/bug-description

# Create pull request
# After merge
git checkout main
git pull origin main
git branch -d fix/bug-description
```

### Hotfix to Production

```bash
# Create hotfix from main
git checkout -b hotfix/critical-fix main

# Fix issue
git commit -am "Hotfix: resolve security vulnerability"

# Merge to main
git checkout main
git merge --no-ff hotfix/critical-fix
git tag -a v1.0.1 -m "Hotfix 1.0.1"
git push origin main --tags

# Cherry-pick to other branches if needed
git checkout develop
git cherry-pick <commit-hash>
git push origin develop
```

## 🛠️ Essential Commands Cheat Sheet

### Setup

```bash
git config --global user.name "Name"       # Set username
git config --global user.email "email"     # Set email
git init                                    # Initialize repository
git clone <url>                            # Clone repository
```

### Basic Commands

```bash
git status                                  # Check status
git add <file>                             # Stage file
git add .                                  # Stage all changes
git commit -m "message"                    # Commit changes
git log                                    # View history
git log --oneline --graph                  # Compact history
git diff                                   # View changes
```

### Branching

```bash
git branch                                 # List branches
git branch <name>                          # Create branch
git checkout <branch>                      # Switch branch
git checkout -b <branch>                   # Create and switch
git merge <branch>                         # Merge branch
git branch -d <branch>                     # Delete branch
```

### Remote

```bash
git remote -v                              # List remotes
git remote add origin <url>                # Add remote
git fetch origin                           # Fetch changes
git pull origin main                       # Pull and merge
git push origin main                       # Push changes
git push -u origin <branch>                # Push and track
```

### Undo

```bash
git restore <file>                         # Discard changes
git restore --staged <file>                # Unstage file
git reset HEAD~1                           # Undo last commit
git revert <commit>                        # Revert commit
git clean -fd                              # Remove untracked
```

### Advanced

```bash
git stash                                  # Save work temporarily
git stash pop                              # Restore stashed work
git rebase main                            # Rebase on main
git cherry-pick <commit>                   # Apply specific commit
git bisect start                           # Start bug hunt
```

## 🤝 Contributing to Open Source

### First Time Setup

```bash
# 1. Fork repository on GitHub

# 2. Clone your fork
git clone https://github.com/yourname/project.git
cd project

# 3. Add upstream remote
git remote add upstream https://github.com/original/project.git

# 4. Create branch
git checkout -b feature/contribution
```

### Making Contributions

```bash
# 1. Sync with upstream
git fetch upstream
git merge upstream/main

# 2. Make changes
git add .
git commit -m "feat: add new feature"

# 3. Push to your fork
git push origin feature/contribution

# 4. Create pull request on GitHub

# 5. Address feedback
git commit -am "refactor: address review comments"
git push origin feature/contribution

# 6. After merge, sync again
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

## 📝 Best Practices

### Commits

- Write clear, descriptive commit messages
- Use conventional commit format
- Make atomic commits (one logical change)
- Commit often, perfect later with rebase
- Never commit sensitive data

### Branches

- Use descriptive branch names
- Keep branches short-lived
- Delete branches after merge
- Regularly sync with main
- One feature per branch

### Collaboration

- Always pull before push
- Review changes before committing
- Use pull requests for code review
- Communicate with team
- Document workflow in CONTRIBUTING.md

### Security

- Never commit passwords or keys
- Use .gitignore properly
- Review diffs before committing
- Sign commits with GPG
- Use SSH keys for authentication

## 🔗 Additional Resources

See [resources.md](resources.md) for:

- Official documentation
- Interactive tutorials
- Video courses
- Books and articles
- Practice platforms
- Git GUIs and tools

## 🎓 Practice Projects

### Beginner Projects

1. Personal portfolio website
2. Simple static blog
3. Documentation site
4. Configuration file repository

### Intermediate Projects

1. Contribute to open source
2. Team project with collaborators
3. Multi-environment deployment
4. Monorepo management

### Advanced Projects

1. Git server setup
2. Custom Git hooks
3. CI/CD pipeline integration
4. Git workflow automation

## 🆘 Troubleshooting

### Common Issues

**Merge Conflicts:**

```bash
# Resolve conflicts in files
git add <resolved-files>
git merge --continue
```

**Accidentally Committed:**

```bash
git reset HEAD~1              # Keep changes
git reset --hard HEAD~1       # Discard changes
```

**Pushed Wrong Commit:**

```bash
git revert <commit>           # Safe for public branches
git push origin main
```

**Lost Commits:**

```bash
git reflog                    # Find lost commit
git cherry-pick <commit>      # Recover
```

**Detached HEAD:**

```bash
git checkout -b recovery-branch    # Save work
# or
git checkout main             # Return to branch
```

## 📞 Getting Help

```bash
# Built-in help
git help <command>
git <command> --help
man git-<command>

# Quick reference
git <command> -h

# Examples
git help commit
git log --help
git rebase -h
```

## 🏆 Certification and Skills

### Skills to Master

- [ ] Basic Git commands
- [ ] Branching and merging
- [ ] Conflict resolution
- [ ] Remote operations
- [ ] Rebasing and cherry-picking
- [ ] Advanced debugging
- [ ] Team workflows
- [ ] Git internals

### Practice Platforms

- [Learn Git Branching](https://learngitbranching.js.org/) - Interactive tutorial
- [GitHub Skills](https://skills.github.com/) - Hands-on courses
- [GitExercises](https://gitexercises.fracz.com/) - Git challenges

## 📜 License

This learning resource is for educational purposes. Git is licensed under GPL v2.

---

**Happy Learning! 🚀**

Remember: Git is a skill that improves with practice. Don't be afraid to experiment in test repositories!
