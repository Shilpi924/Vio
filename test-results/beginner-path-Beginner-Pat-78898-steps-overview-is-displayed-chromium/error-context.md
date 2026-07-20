# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: beginner-path.spec.ts >> Beginner Path Page Tests >> steps overview is displayed
- Location: tests/beginner-path.spec.ts:22:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('All Steps')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('All Steps')

```

```yaml
- main:
  - text: Let's make some music!
  - heading "Hello, Learner! 🎹" [level=1]
  - combobox:
    - option "EN" [selected]
    - option "ZH"
    - option "JA"
    - option "DE"
    - option "ES"
  - button "Learner"
  - button "Path Follow the guided learning roadmap.":
    - heading "Path" [level=2]
    - paragraph: Follow the guided learning roadmap.
  - button "Free Play Just jam! No rules, just you and the piano.":
    - heading "Free Play" [level=2]
    - paragraph: Just jam! No rules, just you and the piano.
  - button "Song Library Learn your favorite songs step-by-step.":
    - heading "Song Library" [level=2]
    - paragraph: Learn your favorite songs step-by-step.
  - button "Arcade Play fun mini-games":
    - heading "Arcade" [level=3]
    - paragraph: Play fun mini-games
  - button "Rewards Shop Spend your XP!":
    - heading "Rewards Shop" [level=3]
    - paragraph: Spend your XP!
  - button "Tutorials Learn the basics":
    - heading "Tutorials" [level=3]
    - paragraph: Learn the basics
  - button "WebXR Piano Virtual reality mode":
    - heading "WebXR Piano" [level=3]
    - paragraph: Virtual reality mode
  - button "Duet Mode Real-time multiplayer":
    - heading "Duet Mode" [level=3]
    - paragraph: Real-time multiplayer
  - button "My Progress See your achievements":
    - heading "My Progress" [level=3]
    - paragraph: See your achievements
  - button "Settings Tweak your piano":
    - heading "Settings" [level=3]
    - paragraph: Tweak your piano
- text: 🎹 Click me for a fun tip!
- button
- img
- button "Enter XR"
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
  9  |     const violinHeading = page.getByText('� Your Violin Journey');
  10 |     const isVisible = await violinHeading.isVisible();
  11 |     expect(isVisible).toBeTruthy();
  12 |   });
  13 | 
  14 |   test('progress bar is visible', async ({ page }) => {
  15 |     await expect(page.getByText('Progress')).toBeVisible();
  16 |   });
  17 | 
  18 |   test('current step card is displayed', async ({ page }) => {
  19 |     await expect(page.getByText('I did it!')).toBeVisible();
  20 |   });
  21 | 
  22 |   test('steps overview is displayed', async ({ page }) => {
> 23 |     await expect(page.getByText('All Steps')).toBeVisible();
     |                                               ^ Error: expect(locator).toBeVisible() failed
  24 |   });
  25 | 
  26 |   test('page is responsive on mobile', async ({ page }) => {
  27 |     await page.setViewportSize({ width: 375, height: 667 });
  28 |     await page.goto('/beginner-path');
  29 |     
  30 |     const violinHeading = page.getByText('� Your Violin Journey');
  31 |     const isVisible = await violinHeading.isVisible();
  32 |     expect(isVisible).toBeTruthy();
  33 |   });
  34 | 
  35 |   test('page is responsive on tablet', async ({ page }) => {
  36 |     await page.setViewportSize({ width: 768, height: 1024 });
  37 |     await page.goto('/beginner-path');
  38 |     
  39 |     const violinHeading = page.getByText('� Your Violin Journey');
  40 |     const isVisible = await violinHeading.isVisible();
  41 |     expect(isVisible).toBeTruthy();
  42 |   });
  43 | });
  44 | 
```