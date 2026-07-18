# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tutorials.spec.ts >> Tutorials Page Tests >> tutorials are clickable
- Location: tests/tutorials.spec.ts:23:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.tutorial, [data-testid="tutorial"], button, a').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.tutorial, [data-testid="tutorial"], button, a').first()

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Tutorials Page Tests', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/tutorials');
  6  |   });
  7  | 
  8  |   test('tutorials page loads with correct heading', async ({ page }) => {
  9  |     const violinTutorialsHeading = page.getByText('Violin Tutorials');
  10 |     const howToHeading = page.getByText('How-To');
  11 |     const isVisible = await violinTutorialsHeading.isVisible() || await howToHeading.isVisible();
  12 |     expect(isVisible).toBeTruthy();
  13 |   });
  14 | 
  15 |   test('tutorial categories are displayed', async ({ page }) => {
  16 |     // Tutorial content should be visible
  17 |     const tutorialCards = page.locator('.tutorial, [data-testid="tutorial"], .category').first();
  18 |     const article = page.getByRole('article').first();
  19 |     const isVisible = await tutorialCards.isVisible() || await article.isVisible();
  20 |     expect(isVisible).toBeTruthy();
  21 |   });
  22 | 
  23 |   test('tutorials are clickable', async ({ page }) => {
  24 |     const firstTutorial = page.locator('.tutorial, [data-testid="tutorial"], button, a').first();
> 25 |     await expect(firstTutorial).toBeVisible();
     |                                 ^ Error: expect(locator).toBeVisible() failed
  26 |   });
  27 | 
  28 |   test('page is responsive on mobile', async ({ page }) => {
  29 |     await page.setViewportSize({ width: 375, height: 667 });
  30 |     await page.goto('/tutorials');
  31 |     
  32 |     const violinTutorialsHeading = page.getByText('Violin Tutorials');
  33 |     const howToHeading = page.getByText('How-To');
  34 |     const isVisible = await violinTutorialsHeading.isVisible() || await howToHeading.isVisible();
  35 |     expect(isVisible).toBeTruthy();
  36 |   });
  37 | 
  38 |   test('page is responsive on tablet', async ({ page }) => {
  39 |     await page.setViewportSize({ width: 768, height: 1024 });
  40 |     await page.goto('/tutorials');
  41 |     
  42 |     const violinTutorialsHeading = page.getByText('Violin Tutorials');
  43 |     const howToHeading = page.getByText('How-To');
  44 |     const isVisible = await violinTutorialsHeading.isVisible() || await howToHeading.isVisible();
  45 |     expect(isVisible).toBeTruthy();
  46 |   });
  47 | });
  48 | 
```