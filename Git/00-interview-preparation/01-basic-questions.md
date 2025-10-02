# Git Basic Interview Questions

## What is Git?

**Answer:**
Git is a distributed version control system (DVCS) that tracks changes in source code during software development. Key characteristics:

- **Distributed**: Every developer has a full copy of the repository
- **Fast**: Most operations are local
- **Branching**: Lightweight and efficient branching model
- **Data Integrity**: Uses SHA-1 hashing to ensure integrity

## What is the difference between Git and GitHub?

**Answer:**

- **Git**: Version control system (software tool)
- **GitHub**: Web-based hosting service for Git repositories (platform)

GitHub provides additional features:

- Remote repository hosting
- Collaboration tools (pull requests, issues)
- CI/CD integration
- Project management tools

Similar platforms: GitLab, Bitbucket, Gitea

## What is a Git repository?

**Answer:**
A Git repository is a storage location containing:

- All project files and folders
- Complete history of changes
- Metadata stored in `.git` directory

Types:

1. **Local Repository**: On your computer
2. **Remote Repository**: On a server (GitHub, GitLab, etc.)

## Explain the three states in Git

**Answer:**
Git has three main states that files can be in:

1. **Modified**: Changed but not committed
2. **Staged**: Marked to go into next commit
3. **Committed**: Safely stored in database

Corresponding sections:

- **Working Directory**: Where you modify files
- **Staging Area (Index)**: Prepares files for commit
- **Git Directory (Repository)**: Where commits are stored

```bash
# Modified -> Staged
git add <file>

# Staged -> Committed
git commit -m "message"
```

## What is the difference between `git init` and `git clone`?

**Answer:**

**`git init`**

- Creates a new Git repository
- Initializes `.git` directory in current folder
- Used for starting a new project

```bash
git init
```

**`git clone`**

- Copies an existing repository
- Downloads all history and files
- Used for contributing to existing projects

```bash
git clone <repository-url>
```

## What does `git status` show?

**Answer:**
`git status` displays:

- Current branch name
- Files in staging area (staged changes)
- Files in working directory (unstaged changes)
- Untracked files
- Commit status relative to remote branch

```bash
git status

# Short format
git status -s
```

## What is the difference between `git add` and `git commit`?

**Answer:**

**`git add`**

- Stages changes for commit
- Adds files to staging area/index
- Can add specific files or all changes

```bash
git add file.txt        # Specific file
git add .               # All changes in current directory
git add -A              # All changes in repository
```

**`git commit`**

- Saves staged changes to repository
- Creates a snapshot in Git history
- Requires a commit message

```bash
git commit -m "Add new feature"
git commit -am "Add and commit"  # Stages tracked files
```

## What is a commit message and why is it important?

**Answer:**
A commit message is a description of changes made in a commit.

**Importance:**

- Documents project history
- Helps team understand changes
- Makes debugging easier
- Facilitates code reviews

**Best Practices:**

```bash
# Good commit message structure
git commit -m "Add user authentication feature

- Implement login/logout functionality
- Add password hashing with bcrypt
- Create authentication middleware
- Add tests for auth routes"
```

Format:

- Subject line (50 chars or less)
- Blank line
- Detailed description (if needed)
- Use imperative mood ("Add feature" not "Added feature")

## What is `.gitignore` file?

**Answer:**
`.gitignore` specifies files/directories Git should ignore.

**Use cases:**

- Build artifacts (`dist/`, `build/`)
- Dependencies (`node_modules/`, `vendor/`)
- Environment files (`.env`, `.env.local`)
- IDE settings (`.vscode/`, `.idea/`)
- OS files (`.DS_Store`, `Thumbs.db`)
- Logs and temporary files

```gitignore
# Example .gitignore
node_modules/
.env
*.log
dist/
.DS_Store
```

**Note**: Already tracked files need to be untracked first:

```bash
git rm --cached <file>
```

## What is the difference between `git fetch` and `git pull`?

**Answer:**

**`git fetch`**

- Downloads changes from remote
- Does NOT merge into current branch
- Safe operation (doesn't modify working directory)
- Updates remote-tracking branches

```bash
git fetch origin
```

**`git pull`**

- Downloads changes from remote
- Automatically merges into current branch
- Equivalent to `git fetch` + `git merge`

```bash
git pull origin main
# Same as:
# git fetch origin
# git merge origin/main
```

**When to use:**

- Use `fetch` to review changes before merging
- Use `pull` when you want to update immediately

## What is HEAD in Git?

**Answer:**
HEAD is a pointer to the current branch reference, which points to the last commit in the current branch.

**Types:**

1. **Normal HEAD**: Points to a branch

   ```bash
   cat .git/HEAD
   # ref: refs/heads/main
   ```

2. **Detached HEAD**: Points directly to a commit
   ```bash
   git checkout <commit-hash>
   # HEAD detached at <commit-hash>
   ```

**Usage:**

```bash
# Refer to previous commits
HEAD      # Current commit
HEAD~1    # One commit before
HEAD~2    # Two commits before
HEAD^     # First parent of HEAD
```

## What is the difference between tracked and untracked files?

**Answer:**

**Tracked Files:**

- Files Git knows about
- Either committed or staged
- Changes are monitored by Git

**Untracked Files:**

- New files not added to Git
- Not in staging area or committed
- Git ignores their changes

```bash
# Check status
git status

# Track a file
git add newfile.txt

# Untrack a file (keep in working directory)
git rm --cached file.txt
```

## Explain `git diff` command

**Answer:**
`git diff` shows differences between various Git states.

```bash
# Working directory vs Staging area
git diff

# Staging area vs Last commit
git diff --staged
# or
git diff --cached

# Working directory vs Last commit
git diff HEAD

# Between commits
git diff commit1 commit2

# Specific file
git diff file.txt

# Between branches
git diff branch1 branch2
```

## What are the different ways to undo changes in Git?

**Answer:**

**1. Unstage files (keep changes):**

```bash
git reset HEAD <file>
# or in newer Git
git restore --staged <file>
```

**2. Discard working directory changes:**

```bash
git checkout -- <file>
# or newer syntax
git restore <file>
```

**3. Amend last commit:**

```bash
git commit --amend
```

**4. Undo commits (keep changes):**

```bash
git reset --soft HEAD~1
```

**5. Undo commits (discard changes):**

```bash
git reset --hard HEAD~1
```

## What is the staging area (index)?

**Answer:**
The staging area (also called "index") is an intermediate area between the working directory and repository.

**Purpose:**

- Prepare commits carefully
- Stage specific changes
- Review before committing
- Create logical, atomic commits

**Workflow:**

```bash
# Working Directory -> Staging Area
git add file.txt

# Check staged files
git status

# Staging Area -> Repository
git commit -m "message"
```

**Advantages:**

- Commit only related changes
- Split work into multiple commits
- Review changes before committing

## What is `git log` and its common options?

**Answer:**
`git log` shows commit history.

```bash
# Basic log
git log

# One line per commit
git log --oneline

# Show last n commits
git log -n 5

# Show graph
git log --graph --oneline --all

# Show with diffs
git log -p

# Show specific file history
git log file.txt

# Show commits by author
git log --author="John"

# Show commits in date range
git log --since="2 weeks ago"
git log --after="2024-01-01" --before="2024-12-31"

# Custom format
git log --pretty=format:"%h - %an, %ar : %s"
```

## Explain Git configuration levels

**Answer:**
Git has three configuration levels:

**1. System Level** (`--system`)

- Applies to all users and repositories
- Location: `/etc/gitconfig`

```bash
git config --system user.name "Name"
```

**2. Global Level** (`--global`)

- Applies to current user, all repositories
- Location: `~/.gitconfig` or `~/.config/git/config`

```bash
git config --global user.email "email@example.com"
```

**3. Local Level** (`--local`)

- Applies to specific repository only
- Location: `.git/config`

```bash
git config --local user.name "Project Name"
```

**Priority**: Local > Global > System

**View configuration:**

```bash
# View all settings
git config --list

# View specific setting
git config user.name

# View with source
git config --list --show-origin
```
