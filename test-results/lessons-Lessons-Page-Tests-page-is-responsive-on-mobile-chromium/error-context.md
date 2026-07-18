# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lessons.spec.ts >> Lessons Page Tests >> page is responsive on mobile
- Location: tests/lessons.spec.ts:29:3

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Lessons Page Tests', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/lessons');
  6  |   });
  7  | 
  8  |   test('lessons page loads with correct heading', async ({ page }) => {
  9  |     const lessonHeading = page.getByText('Lesson');
  10 |     const libraryHeading = page.getByText('Library');
  11 |     const isVisible = await lessonHeading.isVisible() || await libraryHeading.isVisible();
  12 |     expect(isVisible).toBeTruthy();
  13 |   });
  14 | 
  15 |   test('lesson list is displayed', async ({ page }) => {
  16 |     // Lessons should be displayed
  17 |     const lessonCards = page.locator('.lesson, [data-testid="lesson"], .card').first();
  18 |     const article = page.getByRole('article').first();
  19 |     const isVisible = await lessonCards.isVisible() || await article.isVisible();
  20 |     expect(isVisible).toBeTruthy();
  21 |   });
  22 | 
  23 |   test('lesson cards have titles', async ({ page }) => {
  24 |     // Lesson cards should have text content
  25 |     const lessonCard = page.locator('.lesson, [data-testid="lesson"], .card').first();
  26 |     await expect(lessonCard).toBeVisible();
  27 |   });
  28 | 
  29 |   test('page is responsive on mobile', async ({ page }) => {
  30 |     await page.setViewportSize({ width: 375, height: 667 });
  31 |     await page.goto('/lessons');
  32 |     
  33 |     const lessonHeading = page.getByText('Lesson');
  34 |     const libraryHeading = page.getByText('Library');
  35 |     const isVisible = await lessonHeading.isVisible() || await libraryHeading.isVisible();
> 36 |     expect(isVisible).toBeTruthy();
     |                       ^ Error: expect(received).toBeTruthy()
  37 |   });
  38 | 
  39 |   test('page is responsive on tablet', async ({ page }) => {
  40 |     await page.setViewportSize({ width: 768, height: 1024 });
  41 |     await page.goto('/lessons');
  42 |     
  43 |     const lessonHeading = page.getByText('Lesson');
  44 |     const libraryHeading = page.getByText('Library');
  45 |     const isVisible = await lessonHeading.isVisible() || await libraryHeading.isVisible();
  46 |     expect(isVisible).toBeTruthy();
  47 |   });
  48 | });
  49 | 
```