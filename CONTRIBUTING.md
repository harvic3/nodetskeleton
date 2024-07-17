# Contributing to NodeTskeleton

If you found a mistake or think of a cool new feature, please [create an issue](https://github.com/harvic3/nodetskeleton/issues/new/choose) or, if you want to implement it yourself, [fork this repo](https://github.com/harvic3/nodetskeleton/fork) and open a Pull Request!

We'll take a look as soon as we can.

Thanks!


## File Naming Conventions

When contributing to the project, please adhere to the following guidelines for naming files:

- **Index files** should be named in lowercase. For example, use `index.ts` instead of `Index.ts`.
- **Local resources** related to internationalization must start with a lowercase letter. For example, use `en.local.ts` for English language resources.
- **Class and Interface files** should start with an uppercase letter. For example, use `User.ts` for a class file and `IUser.ts` for an interface file.
- **Test files** should start with an uppercase letter. For example, use `User.ts` for a class file and `User.test.ts` for an interface file.
- **Especial files** should be according to the tool convention, for example `Dockerfile` for Docker or `.something` for some special tool.

Following these conventions helps maintain consistency and readability in the project's codebase. Thank you for contributing!


## Commit Rules

We use specific tags to indicate the type of change made in each commit. Below are the tags you should use, along with a brief description of when to use them:

- **[FEATURE]**: For adding a new feature.
- **[FIX]**: For fixing a bug.
- **[UPDATE]**: For updates that do not add new features or fix bugs (e.g., dependency updates).
- **[CHANGE]**: For changes that do not fall into the above categories but are necessary (e.g., project configuration changes).
- **[CHORE]**: For routine maintenance tasks that do not affect production code (e.g., CI/CD configuration changes, code formatting).

### Examples

- `[FEATURE] Add user authentication module`
- `[FIX] Corrected login error`
- `[UPDATE] Upgrade to latest version of some package`
- `[CHANGE] Modify project structure for better readability`
- `[CHORE] Update CI/CD pipeline configuration`

## General Guidelines

1. **Commit Message Format**: Each commit message should start with one of the tags followed by a brief description of the change. For example: `[FIX] Corrected typo in README`.
2. **Scope**: If necessary, you can add a scope in parentheses after the tag to specify the area of the project affected. For example: `[FEATURE] (auth) Add JWT authentication`.
3. **Imperative Mood**: Write your commit message in the imperative mood. For example: "Add feature" instead of "Added feature" or "Adding feature".
4. **Line Length**: Keep the first line of the commit message under 50 characters. If more detail is needed, add a blank line followed by a detailed explanation.

By following these guidelines, you will help ensure a clean, readable, and maintainable project history. Thank you for your contributions!


## Maintainers

- [Vick](https://github.com/harvic3)
- [Retamiro](https://github.com/retamiro)
