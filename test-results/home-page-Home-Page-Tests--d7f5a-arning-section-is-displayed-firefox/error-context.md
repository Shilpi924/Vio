# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home-page.spec.ts >> Home Page Tests >> continue learning section is displayed
- Location: tests/home-page.spec.ts:89:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Continue Learning')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Continue Learning')

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Home Page Tests', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/');
  6   |   });
  7   | 
  8   |   test('home page loads with correct title and heading', async ({ page }) => {
  9   |     await expect(page).toHaveTitle(/Violin Mentor/);
  10  |     await expect(page.getByText('🎻 Violin Mentor')).toBeVisible();
  11  |     await expect(page.getByText('Start your violin journey')).toBeVisible();
  12  |   });
  13  | 
  14  |   test('progress statistics are displayed', async ({ page }) => {
  15  |     await expect(page.getByText('Practice')).toBeVisible();
  16  |     await expect(page.getByText('Day Streak')).toBeVisible();
  17  |     await expect(page.getByText('Accuracy')).toBeVisible();
  18  |   });
  19  | 
  20  |   test('main action buttons are visible and clickable', async ({ page }) => {
  21  |     await expect(page.getByText('Learn')).toBeVisible();
  22  |     await expect(page.getByText('Practice')).toBeVisible();
  23  |     await expect(page.getByText('Play')).toBeVisible();
  24  |   });
  25  | 
  26  |   test('main action buttons navigate to correct pages', async ({ page }) => {
  27  |     // Test Learn button
  28  |     await page.getByText('Learn').click();
  29  |     await expect(page).toHaveURL('/beginner-path');
  30  |     
  31  |     await page.goto('/');
  32  |     
  33  |     // Test Practice button
  34  |     await page.getByText('Practice').click();
  35  |     await expect(page).toHaveURL('/free-play');
  36  |     
  37  |     await page.goto('/');
  38  |     
  39  |     // Test Play button
  40  |     await page.getByText('Play').click();
  41  |     await expect(page).toHaveURL('/lessons');
  42  |   });
  43  | 
  44  |   test('quick tools section is displayed', async ({ page }) => {
  45  |     await expect(page.getByText('Quick Tools')).toBeVisible();
  46  |     await expect(page.getByText('Tuner')).toBeVisible();
  47  |     await expect(page.getByText('Beat')).toBeVisible();
  48  |   });
  49  | 
  50  |   test('quick tools navigate to correct pages', async ({ page }) => {
  51  |     // Test Tuner
  52  |     await page.getByText('Tuner').click();
  53  |     await expect(page).toHaveURL('/tuner');
  54  |     
  55  |     await page.goto('/');
  56  |     
  57  |     // Test Beat (Metronome)
  58  |     await page.getByText('Beat').click();
  59  |     await expect(page).toHaveURL('/metronome');
  60  |   });
  61  | 
  62  |   test('more tools section expands and collapses', async ({ page }) => {
  63  |     const moreToolsButton = page.getByText('More Tools');
  64  |     await expect(moreToolsButton).toBeVisible();
  65  |     
  66  |     // Initially collapsed
  67  |     await expect(page.getByText('Finger Guide')).not.toBeVisible();
  68  |     
  69  |     // Expand
  70  |     await moreToolsButton.click();
  71  |     await expect(page.getByText('Finger Guide')).toBeVisible();
  72  |     await expect(page.getByText('Video Lessons')).toBeVisible();
  73  |     await expect(page.getByText('Sound Compare')).toBeVisible();
  74  |     
  75  |     // Collapse
  76  |     await moreToolsButton.click();
  77  |     await expect(page.getByText('Finger Guide')).not.toBeVisible();
  78  |   });
  79  | 
  80  |   test('more tools buttons navigate correctly', async ({ page }) => {
  81  |     // Expand more tools
  82  |     await page.getByText('More Tools').click();
  83  |     
  84  |     // Test a few tools
  85  |     await page.getByText('Finger Guide').click();
  86  |     await expect(page).toHaveURL('/fingerboard');
  87  |   });
  88  | 
  89  |   test('continue learning section is displayed', async ({ page }) => {
> 90  |     await expect(page.getByText('Continue Learning')).toBeVisible();
      |                                                       ^ Error: expect(locator).toBeVisible() failed
  91  |     await expect(page.getByText('Ready to start learning?')).toBeVisible();
  92  |   });
  93  | 
  94  |   test('continue learning button navigates to beginner path', async ({ page }) => {
  95  |     await page.getByText('Start Beginner Path').click();
  96  |     await expect(page).toHaveURL('/beginner-path');
  97  |   });
  98  | 
  99  |   test('Google Sign In button is visible when not authenticated', async ({ page }) => {
  100 |     // Clear localStorage to simulate not authenticated state
  101 |     await page.goto('/');
  102 |     await page.evaluate(() => localStorage.clear());
  103 |     await page.reload();
  104 |     
  105 |     await expect(page.getByText('Sign in with Google')).toBeVisible();
  106 |   });
  107 | 
  108 |   test('page is responsive on mobile', async ({ page }) => {
  109 |     await page.setViewportSize({ width: 375, height: 667 });
  110 |     await page.goto('/');
  111 |     
  112 |     await expect(page.getByText('🎻 Violin Mentor')).toBeVisible();
  113 |     await expect(page.getByText('Learn')).toBeVisible();
  114 |   });
  115 | 
  116 |   test('page is responsive on tablet', async ({ page }) => {
  117 |     await page.setViewportSize({ width: 768, height: 1024 });
  118 |     await page.goto('/');
  119 |     
  120 |     await expect(page.getByText('🎻 Violin Mentor')).toBeVisible();
  121 |     await expect(page.getByText('Learn')).toBeVisible();
  122 |   });
  123 | });
  124 | 
```