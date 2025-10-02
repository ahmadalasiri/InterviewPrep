# Git Advanced - Bisect and Debugging

## Git Bisect Basics

### Finding bugs with binary search

```bash
# Start bisect session
git bisect start

# Mark current commit as bad
git bisect bad

# Mark known good commit
git bisect good v1.0.0
# or
git bisect good abc123

# Git checks out middle commit
# Test for bug...

# Mark as bad or good
git bisect bad   # if bug exists
git bisect good  # if bug doesn't exist

# Git continues binary search
# Repeat testing until found

# Git identifies first bad commit
# abc123 is the first bad commit

# End bisect session
git bisect reset
```

### How bisect works

```
Commit history: A---B---C---D---E---F---G---H
Good: A                                    Bad: H

Step 1: Test D (middle)
  Bad: Narrow to D---E---F---G---H

Step 2: Test F
  Good: Narrow to F---G---H

Step 3: Test G
  Bad: G is first bad commit

Binary search: O(log n) instead of O(n)
```

## Manual Bisect Workflow

### Complete bisect example

```bash
# Bug exists now, was working in v2.0.0
git bisect start

# Current version is broken
git bisect bad HEAD

# v2.0.0 was working
git bisect good v2.0.0

# Bisecting: 50 revisions left to test
# [abc123] Some commit message

# Build and test
npm install
npm test

# Mark result
git bisect bad  # Tests fail

# Continue testing
# Bisecting: 25 revisions left to test
npm install && npm test
git bisect good  # Tests pass

# Repeat until:
# def456 is the first bad commit
# [detailed commit info]

# Return to original state
git bisect reset
```

### Skip commits

```bash
# Current commit can't be tested (build broken)
git bisect skip

# Skip range
git bisect skip v2.1.0..v2.3.0

# Git finds next commit to test
```

## Automated Bisect

### Using git bisect run

```bash
# Create test script
cat > test.sh << 'EOF'
#!/bin/bash
npm install > /dev/null 2>&1 || exit 125
npm test > /dev/null 2>&1
EOF

chmod +x test.sh

# Run automated bisect
git bisect start HEAD v1.0.0
git bisect run ./test.sh

# Git automatically finds bad commit
# Exit codes:
# 0 - good
# 1-124, 126-127 - bad
# 125 - skip (can't test)
```

### Test script examples

**Python tests:**

```bash
#!/bin/bash
# test.sh

# Build
python setup.py build || exit 125

# Run tests
python -m pytest tests/
```

**JavaScript tests:**

```bash
#!/bin/bash
# test.sh

# Install dependencies (skip if fails)
npm install > /dev/null 2>&1 || exit 125

# Run specific test
npm test -- --testNamePattern="user authentication"

# Exit code: 0 = pass, 1 = fail
```

**Go tests:**

```bash
#!/bin/bash
# test.sh

# Build
go build || exit 125

# Test
go test ./... -run TestSpecificFunction
```

### Advanced bisect run

```bash
# With build and test
git bisect start HEAD v1.0.0
git bisect run sh -c 'make && make test'

# With timeout
git bisect run timeout 30s ./test.sh

# With cleanup
git bisect run sh -c '
    npm install || exit 125
    npm test
    EXIT_CODE=$?
    npm run clean
    exit $EXIT_CODE
'
```

## Bisect Options and Commands

### Bisect terms

```bash
# Use custom terms instead of good/bad
git bisect start --term-old=works --term-new=broken

git bisect broken  # instead of bad
git bisect works   # instead of good
```

### Bisect log

```bash
# View bisect log
git bisect log

# Save bisect log
git bisect log > bisect-log.txt

# Replay bisect session
git bisect replay bisect-log.txt
```

### Bisect visualize

```bash
# Visualize remaining commits
git bisect visualize
git bisect view

# With specific options
git bisect visualize --oneline --graph
```

## Git Blame

### Find who changed lines

```bash
# Show line-by-line authorship
git blame file.txt

# Output format:
# abc123 (John Doe 2024-01-15 10:30:00 +0000 1) First line
# def456 (Jane Smith 2024-01-20 14:45:00 +0000 2) Second line
```

### Blame options

```bash
# Show email instead of name
git blame -e file.txt

# Show only specific lines
git blame -L 10,20 file.txt

# Start from specific line
git blame -L 10,+5 file.txt  # 10-15

# Blame with function context
git blame -L :functionName file.txt

# Ignore whitespace changes
git blame -w file.txt

# Follow content across file moves
git blame -C file.txt

# More aggressive copy detection
git blame -C -C file.txt
```

### Blame with commit details

```bash
# Show commit hash only
git blame --abbrev=12 file.txt

# Show relative dates
git blame --date=relative file.txt

# Show specific date format
git blame --date=iso file.txt
git blame --date=short file.txt
```

## Git Log for Debugging

### Find when file changed

```bash
# Show commits that modified file
git log -- file.txt

# Show with diffs
git log -p -- file.txt

# Follow renames
git log --follow -- file.txt

# Show with stats
git log --stat -- file.txt
```

### Search commit messages

```bash
# Find commits mentioning "bug"
git log --grep="bug"

# Case insensitive
git log --grep="BUG" -i

# Multiple patterns (OR)
git log --grep="bug" --grep="fix"

# Multiple patterns (AND)
git log --grep="bug" --grep="fix" --all-match

# Invert match
git log --grep="bug" --invert-grep
```

### Search code changes

```bash
# Find commits adding/removing "function_name"
git log -S "function_name"

# Find commits changing "function_name" (pickaxe)
git log -S "function_name" --oneline

# With diffs
git log -S "function_name" -p

# Search with regex
git log -G "function.*name"

# Search in specific files
git log -S "function_name" -- src/
```

### Find when bug was introduced

```bash
# Show commits introducing "TODO" or "FIXME"
git log -S "TODO" --oneline
git log -S "FIXME" --oneline

# Find commits with specific text
git log --all --source -S "bug_text"

# When was function removed?
git log -S "function_name" --diff-filter=D
```

## Git Grep

### Search working directory

```bash
# Search for text in files
git grep "search_term"

# Case insensitive
git grep -i "search_term"

# Show line numbers
git grep -n "search_term"

# Show function name
git grep -p "search_term"

# Show count of matches
git grep -c "search_term"
```

### Grep in specific commits

```bash
# Search in specific commit
git grep "search_term" abc123

# Search in all branches
git grep "search_term" $(git rev-list --all)

# Search in specific files
git grep "search_term" -- "*.js"

# Exclude files
git grep "search_term" -- "*.js" ":!node_modules"
```

### Advanced grep

```bash
# AND search
git grep -e "pattern1" --and -e "pattern2"

# OR search
git grep -e "pattern1" -e "pattern2"

# NOT search
git grep "pattern" --not -e "exclude"

# Context lines
git grep -C 3 "search_term"  # 3 lines before and after
git grep -B 2 "search_term"  # 2 lines before
git grep -A 2 "search_term"  # 2 lines after
```

## Git Show

### Show commit details

```bash
# Show specific commit
git show abc123

# Show with stats
git show --stat abc123

# Show only files changed
git show --name-only abc123

# Show with word diff
git show --word-diff abc123
```

### Show file at specific commit

```bash
# Show file content from commit
git show abc123:path/to/file.txt

# Show from different branch
git show main:README.md

# Show from HEAD
git show HEAD:file.txt

# Show from 3 commits ago
git show HEAD~3:file.txt
```

## Git Reflog

### View reference log

```bash
# Show reflog for HEAD
git reflog

# Show reflog for branch
git reflog show main

# With dates
git reflog --relative-date

# Detailed format
git reflog --format='%C(auto)%h %<|(17)%gd %C(blue)%cr%C(reset) %gs %C(dim)<%an>%C(reset)'
```

### Recover lost commits

```bash
# Find lost commit
git reflog

# Recover
git checkout abc123
# or create branch
git branch recovered-branch abc123
```

## Debugging Workflows

### Find bug introduction

```bash
# 1. Identify bug exists
# 2. Find last known good version
git log --oneline
git checkout v1.2.0
# Test: works

# 3. Bisect
git bisect start HEAD v1.2.0
git bisect run ./test.sh

# 4. Review bad commit
git show <bad-commit>
git log -p <bad-commit>

# 5. Fix or revert
```

### Track down file change

```bash
# Who last modified line 42?
git blame -L 42,42 file.txt

# When was it changed?
git log -L 42,42:file.txt

# Show full history of function
git log -L :functionName:file.txt
```

### Investigate regression

```bash
# Feature broke between v1.0 and v2.0
git bisect start v2.0 v1.0

# Automated testing
git bisect run make test_feature

# Found bad commit
git show <bad-commit>

# Check related changes
git log <bad-commit>~3..<bad-commit>+3 --oneline
```

### Find when file was deleted

```bash
# Find deletion commit
git log --diff-filter=D --summary | grep file.txt

# Show commit that deleted file
git log --all --full-history -- file.txt

# Recover deleted file
git checkout <commit-before-deletion> -- file.txt
```

## Advanced Debugging

### Custom bisect script with reporting

```bash
#!/bin/bash
# bisect-test.sh

COMMIT=$(git rev-parse --short HEAD)
echo "Testing commit: $COMMIT" >> bisect-log.txt

# Build
if ! npm install > /dev/null 2>&1; then
    echo "$COMMIT: Build failed (skip)" >> bisect-log.txt
    exit 125
fi

# Test
if npm test > /dev/null 2>&1; then
    echo "$COMMIT: Tests passed (good)" >> bisect-log.txt
    exit 0
else
    echo "$COMMIT: Tests failed (bad)" >> bisect-log.txt
    exit 1
fi
```

### Performance bisect

```bash
#!/bin/bash
# performance-test.sh

# Run performance test
TIME=$(/usr/bin/time -f "%e" npm run benchmark 2>&1)

# Compare with threshold (5 seconds)
if (( $(echo "$TIME < 5" | bc -l) )); then
    exit 0  # Good performance
else
    exit 1  # Bad performance
fi
```

## Best Practices

### Bisect effectively

```bash
# Tips for successful bisect:
# 1. Have a reliable test
# 2. Know a good commit (start point)
# 3. Know a bad commit (end point)
# 4. Automate if possible
# 5. Keep commits atomic for easier debugging

# Good test characteristics:
# - Fast (bisect runs many times)
# - Deterministic (same result every time)
# - Automated (no manual intervention)
# - Focused (tests one thing)
```

### Effective debugging workflow

```bash
# 1. Reproduce bug
# 2. Write test that fails
# 3. Bisect to find introduction
git bisect run ./test.sh

# 4. Understand the bad commit
git show <bad-commit>
git log -p <bad-commit>

# 5. Fix the bug
# 6. Verify fix
git bisect reset
# Apply fix
# Run tests

# 7. Add regression test
```

## Quick Reference

```bash
# Bisect
git bisect start                    # Begin bisect
git bisect bad                      # Mark as bad
git bisect good abc123              # Mark as good
git bisect skip                     # Skip commit
git bisect run ./test.sh            # Automated
git bisect reset                    # End bisect

# Blame
git blame file.txt                  # Line authors
git blame -L 10,20 file.txt        # Specific lines
git blame -w file.txt              # Ignore whitespace

# Search
git log -S "text"                   # Find in changes
git log --grep="pattern"            # Search messages
git grep "text"                     # Search files

# Debug commands
git reflog                          # Reference log
git show abc123                     # Show commit
git log -p -- file.txt             # File history
git log --follow -- file.txt       # Follow renames
```
