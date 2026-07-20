# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: beginner-path.spec.ts >> Beginner Path Page Tests >> page is responsive on tablet
- Location: tests/beginner-path.spec.ts:35:3

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - main [ref=e5]:
      - generic [ref=e6]:
        - generic [ref=e7]:
          - generic [ref=e8]:
            - img [ref=e9]
            - text: Let's make some music!
          - heading "Hello, Learner! 🎹" [level=1] [ref=e12]
        - generic [ref=e13]:
          - generic [ref=e14]:
            - img [ref=e15]
            - combobox [ref=e18]:
              - option "EN" [selected]
              - option "ZH"
              - option "JA"
              - option "DE"
              - option "ES"
          - button "Learner" [ref=e20] [cursor=pointer]:
            - img [ref=e21]
            - generic [ref=e24]: Learner
            - img [ref=e25]
      - generic [ref=e27]:
        - button "Path Follow the guided learning roadmap." [ref=e28] [cursor=pointer]:
          - img [ref=e30]
          - img [ref=e33]
          - generic [ref=e35]:
            - heading "Path" [level=2] [ref=e36]
            - paragraph [ref=e37]: Follow the guided learning roadmap.
        - button "Free Play Just jam! No rules, just you and the piano." [ref=e38] [cursor=pointer]:
          - img [ref=e40]
          - img [ref=e43]
          - generic [ref=e45]:
            - heading "Free Play" [level=2] [ref=e46]
            - paragraph [ref=e47]: Just jam! No rules, just you and the piano.
        - button "Song Library Learn your favorite songs step-by-step." [ref=e48] [cursor=pointer]:
          - img [ref=e50]
          - img [ref=e55]
          - generic [ref=e57]:
            - heading "Song Library" [level=2] [ref=e58]
            - paragraph [ref=e59]: Learn your favorite songs step-by-step.
      - generic [ref=e60]:
        - button "Arcade Play fun mini-games" [ref=e61] [cursor=pointer]:
          - img [ref=e63]
          - generic [ref=e65]:
            - heading "Arcade" [level=3] [ref=e66]
            - paragraph [ref=e67]: Play fun mini-games
        - button "Rewards Shop Spend your XP!" [ref=e68] [cursor=pointer]:
          - img [ref=e70]
          - generic [ref=e73]:
            - heading "Rewards Shop" [level=3] [ref=e74]
            - paragraph [ref=e75]: Spend your XP!
        - button "Tutorials Learn the basics" [ref=e76] [cursor=pointer]:
          - img [ref=e78]
          - generic [ref=e80]:
            - heading "Tutorials" [level=3] [ref=e81]
            - paragraph [ref=e82]: Learn the basics
        - button "WebXR Piano Virtual reality mode" [ref=e83] [cursor=pointer]:
          - img [ref=e85]
          - generic [ref=e91]:
            - heading "WebXR Piano" [level=3] [ref=e92]
            - paragraph [ref=e93]: Virtual reality mode
        - button "Duet Mode Real-time multiplayer" [ref=e94] [cursor=pointer]:
          - img [ref=e96]
          - generic [ref=e101]:
            - heading "Duet Mode" [level=3] [ref=e102]
            - paragraph [ref=e103]: Real-time multiplayer
        - button "My Progress See your achievements" [ref=e104] [cursor=pointer]:
          - img [ref=e106]
          - generic [ref=e109]:
            - heading "My Progress" [level=3] [ref=e110]
            - paragraph [ref=e111]: See your achievements
        - button "Settings Tweak your piano" [ref=e112] [cursor=pointer]:
          - img [ref=e114]
          - generic [ref=e117]:
            - heading "Settings" [level=3] [ref=e118]
            - paragraph [ref=e119]: Tweak your piano
    - generic [ref=e121]:
      - generic [ref=e122] [cursor=pointer]: 🎹
      - generic [ref=e124]: Click me for a fun tip!
  - button [ref=e127] [cursor=pointer]:
    - img [ref=e128]
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
  23 |     await expect(page.getByText('All Steps')).toBeVisible();
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
> 41 |     expect(isVisible).toBeTruthy();
     |                       ^ Error: expect(received).toBeTruthy()
  42 |   });
  43 | });
  44 | 
```