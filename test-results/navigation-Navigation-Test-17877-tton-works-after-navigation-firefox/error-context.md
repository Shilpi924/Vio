# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Navigation Tests >> back button works after navigation
- Location: tests/navigation.spec.ts:22:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Free Play', exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Free Play', exact: true })

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Navigation Tests', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   test('home page loads correctly', async ({ page }) => {
  9  |     await expect(page.getByRole('heading', { level: 1 })).toContainText('Welcome to Violin Mentor!');
  10 |     await expect(page.getByText('Your journey to mastering the violin starts here')).toBeVisible();
  11 |   });
  12 | 
  13 |   test('home button navigates to dashboard', async ({ page }) => {
  14 |     await page.goto('/free-play');
  15 |     await expect(page.getByRole('heading', { name: 'Free Play', exact: true })).toBeVisible();
  16 |     
  17 |     // Click home button
  18 |     await page.getByTitle('Go to home').click();
  19 |     await expect(page.getByRole('heading', { level: 1 })).toContainText('Welcome to Violin Mentor!');
  20 |   });
  21 | 
  22 |   test('back button works after navigation', async ({ page }) => {
  23 |     await page.goto('/free-play');
> 24 |     await expect(page.getByRole('heading', { name: 'Free Play', exact: true })).toBeVisible();
     |                                                                                 ^ Error: expect(locator).toBeVisible() failed
  25 | 
  26 |     await page.goto('/tutorials');
  27 |     await expect(page.getByRole('heading', { name: 'Violin Tutorials', exact: true })).toBeVisible();
  28 |     
  29 |     // Click back button
  30 |     await page.getByTitle('Go back').click();
  31 |     await expect(page.getByRole('heading', { name: 'Free Play', exact: true })).toBeVisible();
  32 |   });
  33 | 
  34 |   test('quick action buttons navigate correctly', async ({ page }) => {
  35 |     // Test Free Play
  36 |     await page.getByRole('button', { name: 'Open Free Play', exact: true }).click();
  37 |     await expect(page.getByRole('heading', { name: 'Free Play', exact: true })).toBeVisible();
  38 |     
  39 |     // Go back to home
  40 |     await page.getByTitle('Go to home').click();
  41 |     
  42 |     // Test Tutorials
  43 |     await page.getByRole('button', { name: 'Open Tutorials', exact: true }).click();
  44 |     await expect(page.getByRole('heading', { name: 'Violin Tutorials', exact: true })).toBeVisible();
  45 |     
  46 |     // Go back to home
  47 |     await page.getByTitle('Go to home').click();
  48 |     
  49 |     // Test Learning Path
  50 |     await page.getByRole('button', { name: 'Open Learning Path', exact: true }).click();
  51 |     await expect(page.getByRole('heading', { name: 'Learning Path', exact: true })).toBeVisible();
  52 |     
  53 |     // Go back to home
  54 |     await page.getByTitle('Go to home').click();
  55 |     
  56 |     // Test Progress
  57 |     await page.getByRole('button', { name: 'Open Progress', exact: true }).click();
  58 |     await expect(page.getByRole('heading', { name: 'Your Progress', exact: true })).toBeVisible();
  59 |   });
  60 | 
  61 |   test('navigation bar shows correct page title', async ({ page }) => {
  62 |     await page.goto('/free-play');
  63 |     await expect(page.getByRole('heading', { name: 'Free Play', exact: true })).toBeVisible();
  64 | 
  65 |     await page.goto('/statistics');
  66 |     await expect(page.getByRole('heading', { name: 'Your Progress', exact: true })).toBeVisible();
  67 |   });
  68 | });
  69 | 
```