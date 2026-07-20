# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: free-play.spec.ts >> Free Play Page Tests >> volume control is visible
- Location: tests/free-play.spec.ts:17:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[type="range"]')
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[type="range"]')

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
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Free Play Page Tests', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/free-play');
  6  |   });
  7  | 
  8  |   test('free play page loads with correct heading', async ({ page }) => {
  9  |     await expect(page.getByText('� Free Play')).toBeVisible();
  10 |     await expect(page.getByText('Tap the strings and make music!')).toBeVisible();
  11 |   });
  12 | 
  13 |   test('violin strings are displayed', async ({ page }) => {
  14 |     await expect(page.locator('.bg-white').first()).toBeVisible();
  15 |   });
  16 | 
  17 |   test('volume control is visible', async ({ page }) => {
  18 |     const volumeSlider = page.locator('input[type="range"]');
> 19 |     await expect(volumeSlider).toBeVisible();
     |                                ^ Error: expect(locator).toBeVisible() failed
  20 |   });
  21 | 
  22 |   test('tips section is displayed', async ({ page }) => {
  23 |     await expect(page.getByText('Tips')).toBeVisible();
  24 |   });
  25 | 
  26 |   test('back button is displayed', async ({ page }) => {
  27 |     await expect(page.getByText('Back to Home')).toBeVisible();
  28 |   });
  29 | 
  30 |   test('back button navigates to home', async ({ page }) => {
  31 |     await page.getByText('Back to Home').click();
  32 |     await expect(page).toHaveURL('/');
  33 |   });
  34 | 
  35 |   test('page is responsive on mobile', async ({ page }) => {
  36 |     await page.setViewportSize({ width: 375, height: 667 });
  37 |     await page.goto('/free-play');
  38 |     
  39 |     await expect(page.getByText('� Free Play')).toBeVisible();
  40 |   });
  41 | 
  42 |   test('page is responsive on tablet', async ({ page }) => {
  43 |     await page.setViewportSize({ width: 768, height: 1024 });
  44 |     await page.goto('/free-play');
  45 |     
  46 |     await expect(page.getByText('� Free Play')).toBeVisible();
  47 |   });
  48 | });
  49 | 
```