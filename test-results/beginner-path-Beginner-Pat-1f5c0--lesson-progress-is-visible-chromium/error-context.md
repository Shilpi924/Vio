# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: beginner-path.spec.ts >> Beginner Path Page Tests >> lesson progress is visible
- Location: tests/beginner-path.spec.ts:23:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[style*="width"], .progress, [data-testid="progress"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[style*="width"], .progress, [data-testid="progress"]').first()

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Beginner Path Page Tests', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/beginner-path');
  6  |   });
  7  | 
  8  |   test('beginner path page loads with correct heading', async ({ page }) => {
  9  |     const beginnerHeading = page.getByText('Beginner');
  10 |     const learningPathHeading = page.getByText('Learning Path');
  11 |     const isVisible = await beginnerHeading.isVisible() || await learningPathHeading.isVisible();
  12 |     expect(isVisible).toBeTruthy();
  13 |   });
  14 | 
  15 |   test('lesson cards are displayed', async ({ page }) => {
  16 |     // Lessons should be displayed as cards or list items
  17 |     const lessonCards = page.locator('.lesson, [data-testid="lesson"], .card').first();
  18 |     const article = page.getByRole('article').first();
  19 |     const isVisible = await lessonCards.isVisible() || await article.isVisible();
  20 |     expect(isVisible).toBeTruthy();
  21 |   });
  22 | 
  23 |   test('lesson progress is visible', async ({ page }) => {
  24 |     // Progress indicators should be visible
> 25 |     await expect(page.locator('[style*="width"], .progress, [data-testid="progress"]').first()).toBeVisible();
     |                                                                                                 ^ Error: expect(locator).toBeVisible() failed
  26 |   });
  27 | 
  28 |   test('lessons are clickable', async ({ page }) => {
  29 |     const firstLesson = page.locator('.lesson, [data-testid="lesson"], .card, button').first();
  30 |     await expect(firstLesson).toBeVisible();
  31 |   });
  32 | 
  33 |   test('page is responsive on mobile', async ({ page }) => {
  34 |     await page.setViewportSize({ width: 375, height: 667 });
  35 |     await page.goto('/beginner-path');
  36 |     
  37 |     const beginnerHeading = page.getByText('Beginner');
  38 |     const learningPathHeading = page.getByText('Learning Path');
  39 |     const isVisible = await beginnerHeading.isVisible() || await learningPathHeading.isVisible();
  40 |     expect(isVisible).toBeTruthy();
  41 |   });
  42 | 
  43 |   test('page is responsive on tablet', async ({ page }) => {
  44 |     await page.setViewportSize({ width: 768, height: 1024 });
  45 |     await page.goto('/beginner-path');
  46 |     
  47 |     const beginnerHeading = page.getByText('Beginner');
  48 |     const learningPathHeading = page.getByText('Learning Path');
  49 |     const isVisible = await beginnerHeading.isVisible() || await learningPathHeading.isVisible();
  50 |     expect(isVisible).toBeTruthy();
  51 |   });
  52 | });
  53 | 
```