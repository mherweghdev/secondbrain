# Git Hooks & Code Quality Guide

This project uses **Husky** and **lint-staged** to enforce code quality standards locally before code is committed.

## Overview

The following checks run automatically when you attempt to commit code:

1.  **ESLint**: Checks for code errors and style issues (auto-fixes where possible).
2.  **Prettier**: Formats code to ensuring consistent style (auto-formats).
3.  **Jest**: Runs tests related to the changed files.

**Note:** TypeScript type checking is NOT included in pre-commit hooks (too slow for large projects). Run `npm run typecheck` manually before committing, or let CI/CD validate types when you push.

## Setup

These hooks are automatically installed when you run:

```bash
npm install
```

If hooks are not triggering, ensure you have initialized Husky:

```bash
npm run prepare
```

## Cross-Platform Support

These hooks are designed to work on **macOS**, **Linux**, and **Windows**.

### Windows Requirements

For Windows users, we strongly recommend using **Git Bash** (included with Git for Windows).

1.  **Line Endings**: Ensure you are using LF (Unix-style) line endings. The `.gitattributes` file in this repository handles this automatically for new checkouts.
    *   If you experience issues, configure git globally: `git config --global core.autocrlf input`
2.  **Permissions**: If you get a "Permission denied" error, you may need to make the hook executable:
    ```bash
    chmod +x .husky/pre-commit
    ```
    (Run this in Git Bash).

## Troubleshooting

### "pre-commit script failed"

If the pre-commit hook fails, check the output for specific errors.

*   **Lint Errors**: Fix the issues reported by ESLint. Some issues are auto-fixed and re-staged. If manual intervention is needed, the commit will be blocked.
*   **Formatting Errors**: Prettier will auto-format your code. If fixes are applied, they're staged and you can retry the commit.
*   **Test Failures**: Use `npm test` to debug failing tests related to your changes.
*   **Type Errors**: Run `npm run typecheck` manually to check TypeScript types. Type errors won't block commits locally but will be caught by CI/CD.

### Bypassing Hooks

In **rare emergencies** (e.g., critical hotfixes or WIP saves that won't be pushed), you can bypass the hooks:

```bash
git commit -m "wip" --no-verify
```

**⚠️ Warning:** CI/CD pipelines will still run all checks and will reject PRs with failing checks. Using `--no-verify` simply defers usage of the quality gate to the remote pipeline.

## Configuration

*   **Husky**: `.husky/` directory.
*   **lint-staged**: configured in `package.json`.
*   **Prettier**: `.prettierrc`.
*   **ESLint**: `.eslintrc.json`.
