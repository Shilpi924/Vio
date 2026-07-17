# Testing Guide for Violin Mentor

This document explains the automated testing setup for the Violin Mentor project.

## Overview

The project uses two types of automated tests:
- **Unit Tests**: Vitest tests for individual components and functions
- **E2E Tests**: Playwright tests for full user flows and integration testing

## Test Scripts

### Available NPM Scripts

```bash
# Run unit tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Run E2E tests (headless)
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode (visible browser)
npm run test:e2e:headed

# Run E2E tests in debug mode
npm run test:e2e:debug

# Run all tests (unit + E2E)
npm run test:all
```

## Git Hooks

The project uses Husky to automatically run tests before git operations.

### Pre-commit Hook
Runs **unit tests** before every commit.
- **Trigger**: `git commit`
- **Tests**: Unit tests only
- **Skip**: Use `git commit --no-verify` to bypass

### Pre-push Hook
Runs **E2E tests** before every push to remote.
- **Trigger**: `git push`
- **Tests**: Playwright E2E tests
- **Skip**: Use `git push --no-verify` to bypass

## Test Files

### Unit Tests
Located in `src/test/` directory (if any exist)

### E2E Tests
Located in `tests/` directory:
- `navigation.spec.ts` - Navigation and routing tests
- `home-page.spec.ts` - Home page functionality tests
- `free-play.spec.ts` - Free play mode tests
- `statistics.spec.ts` - Statistics page tests
- `components.spec.ts` - Individual component tests
- `settings.spec.ts` - Settings page tests
- `beginner-path.spec.ts` - Beginner learning path tests
- `tutorials.spec.ts` - Tutorials page tests
- `lessons.spec.ts` - Lessons library tests

## Running Tests Manually

### Before Committing
```bash
# Run unit tests (required for commit)
npm test

# If unit tests pass, you can commit
git add .
git commit -m "Your message"
```

### Before Pushing to GitHub
```bash
# Run E2E tests (required for push)
npm run test:e2e

# If E2E tests pass, you can push
git push origin main
```

### Quick Development Cycle
```bash
# Run all tests at once
npm run test:all

# Then commit and push
git add .
git commit -m "Your message"
git push origin main
```

## Skipping Tests (When Necessary)

If you need to skip tests temporarily:

```bash
# Skip pre-commit hook (unit tests)
git commit --no-verify -m "Your message"

# Skip pre-push hook (E2E tests)
git push --no-verify origin main
```

**Note**: Only skip tests if you're absolutely sure your changes don't break functionality.

## Test Coverage

The current E2E tests cover:
- ✅ Navigation between pages
- ✅ Home page functionality
- ✅ Free play mode
- ✅ Statistics and progress tracking
- ✅ Component rendering (tuner, metronome, timer, etc.)
- ✅ Settings page
- ✅ Learning paths and lessons
- ✅ Tutorials
- ✅ Responsive design (mobile, tablet, desktop)

## Adding New Tests

### Adding E2E Tests

1. Create a new test file in `tests/` directory
2. Name it with `.spec.ts` extension
3. Use Playwright test syntax:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Your Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/your-page');
  });

  test('your test description', async ({ page }) => {
    // Your test logic
    await expect(page.getByText('Something')).toBeVisible();
  });
});
```

### Adding Unit Tests

1. Create test files next to your components or in `src/test/`
2. Use Vitest + React Testing Library syntax

## Troubleshooting

### Playwright Browsers Not Installed
```bash
npx playwright install
```

### Tests Failing Due to UI Changes
- Update selectors in test files to match new UI
- Use more flexible selectors (e.g., `getByText`, `getByRole`)
- Add optional visibility checks for conditional elements

### Git Hooks Not Running
```bash
# Ensure Husky is installed
npm run prepare

# Check hook permissions
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

### Slow E2E Tests
- Run specific test files: `npm run test:e2e -- tests/navigation.spec.ts`
- Run specific tests: `npm run test:e2e -g "test name"`
- Use `test:e2e:ui` for faster debugging

## Best Practices

1. **Always run tests before committing** - The hooks will catch issues, but running manually saves time
2. **Write tests for new features** - Add E2E tests when adding new pages or major features
3. **Keep tests independent** - Each test should be able to run in isolation
4. **Use descriptive test names** - Make it clear what each test is checking
5. **Test critical paths** - Focus on user flows that are essential to the app

## CI/CD Integration

When pushing to GitHub, the tests will run automatically via git hooks. For additional CI/CD:
- Consider adding GitHub Actions workflows
- Configure tests to run on pull requests
- Add test reporting to your CI pipeline

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Husky Documentation](https://typicode.github.io/husky/)
