# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: components.spec.ts >> Practice Timer Component Tests >> timer displays time
- Location: tests/components.spec.ts:72:3

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
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Violin Tuner Component Tests', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/tuner');
  6   |   });
  7   | 
  8   |   test('tuner page loads', async ({ page }) => {
  9   |     const tunerHeading = page.getByText('Tuner', { exact: true });
  10  |     const violinTunerHeading = page.getByText('Violin Tuner');
  11  |     const isVisible = await tunerHeading.isVisible() || await violinTunerHeading.isVisible();
  12  |     expect(isVisible).toBeTruthy();
  13  |   });
  14  | 
  15  |   test('tuner displays string names', async ({ page }) => {
  16  |     const gString = page.getByText('G');
  17  |     const g3String = page.getByText('G3');
  18  |     expect(await gString.isVisible() || await g3String.isVisible()).toBeTruthy();
  19  |     
  20  |     const dString = page.getByText('D');
  21  |     const d4String = page.getByText('D4');
  22  |     expect(await dString.isVisible() || await d4String.isVisible()).toBeTruthy();
  23  |     
  24  |     const aString = page.getByText('A');
  25  |     const a4String = page.getByText('A4');
  26  |     expect(await aString.isVisible() || await a4String.isVisible()).toBeTruthy();
  27  |     
  28  |     const eString = page.getByText('E');
  29  |     const e5String = page.getByText('E5');
  30  |     expect(await eString.isVisible() || await e5String.isVisible()).toBeTruthy();
  31  |   });
  32  | });
  33  | 
  34  | test.describe('Metronome Component Tests', () => {
  35  |   test.beforeEach(async ({ page }) => {
  36  |     await page.goto('/metronome');
  37  |   });
  38  | 
  39  |   test('metronome page loads', async ({ page }) => {
  40  |     const metronomeHeading = page.getByText('Metronome', { exact: true });
  41  |     const beatHeading = page.getByText('Beat');
  42  |     const isVisible = await metronomeHeading.isVisible() || await beatHeading.isVisible();
  43  |     expect(isVisible).toBeTruthy();
  44  |   });
  45  | 
  46  |   test('metronome has tempo control', async ({ page }) => {
  47  |     const tempoSlider = page.locator('input[type="range"]').first();
  48  |     await expect(tempoSlider).toBeVisible();
  49  |   });
  50  | 
  51  |   test('metronome has start/stop button', async ({ page }) => {
  52  |     const startButton = page.getByText('Start');
  53  |     const playButton = page.getByText('Play');
  54  |     const anyButton = page.getByRole('button').first();
  55  |     const isVisible = await startButton.isVisible() || await playButton.isVisible() || await anyButton.isVisible();
  56  |     expect(isVisible).toBeTruthy();
  57  |   });
  58  | });
  59  | 
  60  | test.describe('Practice Timer Component Tests', () => {
  61  |   test.beforeEach(async ({ page }) => {
  62  |     await page.goto('/timer');
  63  |   });
  64  | 
  65  |   test('timer page loads', async ({ page }) => {
  66  |     const timerHeading = page.getByText('Timer');
  67  |     const practiceTimerHeading = page.getByText('Practice Timer');
  68  |     const isVisible = await timerHeading.isVisible() || await practiceTimerHeading.isVisible();
  69  |     expect(isVisible).toBeTruthy();
  70  |   });
  71  | 
  72  |   test('timer displays time', async ({ page }) => {
  73  |     const timePattern = page.locator('text=/\\d+:\\d{2}/');
  74  |     const defaultTime = page.getByText('00:00');
  75  |     const isVisible = await timePattern.isVisible() || await defaultTime.isVisible();
> 76  |     expect(isVisible).toBeTruthy();
      |                       ^ Error: expect(received).toBeTruthy()
  77  |   });
  78  | });
  79  | 
  80  | test.describe('Interactive Fingerboard Component Tests', () => {
  81  |   test.beforeEach(async ({ page }) => {
  82  |     await page.goto('/fingerboard');
  83  |   });
  84  | 
  85  |   test('fingerboard page loads', async ({ page }) => {
  86  |     const fingerboardHeading = page.getByText('Fingerboard');
  87  |     const fingerGuideHeading = page.getByText('Finger Guide');
  88  |     const isVisible = await fingerboardHeading.isVisible() || await fingerGuideHeading.isVisible();
  89  |     expect(isVisible).toBeTruthy();
  90  |   });
  91  | 
  92  |   test('fingerboard is interactive', async ({ page }) => {
  93  |     // The fingerboard should be visible
  94  |     const fingerboard = page.locator('canvas, svg, .fingerboard').first();
  95  |     await expect(fingerboard).toBeVisible();
  96  |   });
  97  | });
  98  | 
  99  | test.describe('Video Tutorial Component Tests', () => {
  100 |   test.beforeEach(async ({ page }) => {
  101 |     await page.goto('/video-tutorials');
  102 |   });
  103 | 
  104 |   test('video tutorials page loads', async ({ page }) => {
  105 |     const videoHeading = page.getByText('Video');
  106 |     const tutorialHeading = page.getByText('Tutorial');
  107 |     const videoLessonsHeading = page.getByText('Video Lessons');
  108 |     const isVisible = await videoHeading.isVisible() || await tutorialHeading.isVisible() || await videoLessonsHeading.isVisible();
  109 |     expect(isVisible).toBeTruthy();
  110 |   });
  111 | });
  112 | 
  113 | test.describe('Achievements Component Tests', () => {
  114 |   test.beforeEach(async ({ page }) => {
  115 |     await page.goto('/achievements');
  116 |   });
  117 | 
  118 |   test('achievements page loads', async ({ page }) => {
  119 |     const achievementsHeading = page.getByText('Achievements');
  120 |     const awardsHeading = page.getByText('Awards');
  121 |     const isVisible = await achievementsHeading.isVisible() || await awardsHeading.isVisible();
  122 |     expect(isVisible).toBeTruthy();
  123 |   });
  124 | 
  125 |   test('achievements display badges', async ({ page }) => {
  126 |     const achievementLocator = page.locator('.achievement, [data-testid="achievement"]');
  127 |     const violinEmoji = page.getByText('🎻');
  128 |     const isVisible = await achievementLocator.isVisible() || await violinEmoji.isVisible();
  129 |     expect(isVisible).toBeTruthy();
  130 |   });
  131 | });
  132 | 
  133 | test.describe('Parent Dashboard Component Tests', () => {
  134 |   test.beforeEach(async ({ page }) => {
  135 |     await page.goto('/parent-dashboard');
  136 |   });
  137 | 
  138 |   test('parent dashboard page loads', async ({ page }) => {
  139 |     const parentHeading = page.getByText('Parent');
  140 |     const dashboardHeading = page.getByText('Dashboard');
  141 |     const parentsHeading = page.getByText('Parents');
  142 |     const isVisible = await parentHeading.isVisible() || await dashboardHeading.isVisible() || await parentsHeading.isVisible();
  143 |     expect(isVisible).toBeTruthy();
  144 |   });
  145 | });
  146 | 
  147 | test.describe('Weekly Challenges Component Tests', () => {
  148 |   test.beforeEach(async ({ page }) => {
  149 |     await page.goto('/challenges');
  150 |   });
  151 | 
  152 |   test('challenges page loads', async ({ page }) => {
  153 |     const challengeHeading = page.getByText('Challenge');
  154 |     const challengesHeading = page.getByText('Challenges');
  155 |     const isVisible = await challengeHeading.isVisible() || await challengesHeading.isVisible();
  156 |     expect(isVisible).toBeTruthy();
  157 |   });
  158 | });
  159 | 
  160 | test.describe('Practice Reminders Component Tests', () => {
  161 |   test.beforeEach(async ({ page }) => {
  162 |     await page.goto('/reminders');
  163 |   });
  164 | 
  165 |   test('reminders page loads', async ({ page }) => {
  166 |     const reminderHeading = page.getByText('Reminder');
  167 |     const remindersHeading = page.getByText('Reminders');
  168 |     const isVisible = await reminderHeading.isVisible() || await remindersHeading.isVisible();
  169 |     expect(isVisible).toBeTruthy();
  170 |   });
  171 | });
  172 | 
  173 | test.describe('Note Matching Game Component Tests', () => {
  174 |   test.beforeEach(async ({ page }) => {
  175 |     await page.goto('/note-game');
  176 |   });
```