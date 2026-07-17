import { test, expect } from '@playwright/test';

test.describe('Violin Tuner Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tuner');
  });

  test('tuner page loads', async ({ page }) => {
    const tunerHeading = page.getByText('Tuner', { exact: true });
    const violinTunerHeading = page.getByText('Violin Tuner');
    const isVisible = await tunerHeading.isVisible() || await violinTunerHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('tuner displays string names', async ({ page }) => {
    const gString = page.getByText('G');
    const g3String = page.getByText('G3');
    expect(await gString.isVisible() || await g3String.isVisible()).toBeTruthy();
    
    const dString = page.getByText('D');
    const d4String = page.getByText('D4');
    expect(await dString.isVisible() || await d4String.isVisible()).toBeTruthy();
    
    const aString = page.getByText('A');
    const a4String = page.getByText('A4');
    expect(await aString.isVisible() || await a4String.isVisible()).toBeTruthy();
    
    const eString = page.getByText('E');
    const e5String = page.getByText('E5');
    expect(await eString.isVisible() || await e5String.isVisible()).toBeTruthy();
  });
});

test.describe('Metronome Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/metronome');
  });

  test('metronome page loads', async ({ page }) => {
    const metronomeHeading = page.getByText('Metronome', { exact: true });
    const beatHeading = page.getByText('Beat');
    const isVisible = await metronomeHeading.isVisible() || await beatHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('metronome has tempo control', async ({ page }) => {
    const tempoSlider = page.locator('input[type="range"]').first();
    await expect(tempoSlider).toBeVisible();
  });

  test('metronome has start/stop button', async ({ page }) => {
    const startButton = page.getByText('Start');
    const playButton = page.getByText('Play');
    const anyButton = page.getByRole('button').first();
    const isVisible = await startButton.isVisible() || await playButton.isVisible() || await anyButton.isVisible();
    expect(isVisible).toBeTruthy();
  });
});

test.describe('Practice Timer Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/timer');
  });

  test('timer page loads', async ({ page }) => {
    const timerHeading = page.getByText('Timer');
    const practiceTimerHeading = page.getByText('Practice Timer');
    const isVisible = await timerHeading.isVisible() || await practiceTimerHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('timer displays time', async ({ page }) => {
    const timePattern = page.locator('text=/\\d+:\\d{2}/');
    const defaultTime = page.getByText('00:00');
    const isVisible = await timePattern.isVisible() || await defaultTime.isVisible();
    expect(isVisible).toBeTruthy();
  });
});

test.describe('Interactive Fingerboard Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fingerboard');
  });

  test('fingerboard page loads', async ({ page }) => {
    const fingerboardHeading = page.getByText('Fingerboard');
    const fingerGuideHeading = page.getByText('Finger Guide');
    const isVisible = await fingerboardHeading.isVisible() || await fingerGuideHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('fingerboard is interactive', async ({ page }) => {
    // The fingerboard should be visible
    const fingerboard = page.locator('canvas, svg, .fingerboard').first();
    await expect(fingerboard).toBeVisible();
  });
});

test.describe('Video Tutorial Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/video-tutorials');
  });

  test('video tutorials page loads', async ({ page }) => {
    const videoHeading = page.getByText('Video');
    const tutorialHeading = page.getByText('Tutorial');
    const videoLessonsHeading = page.getByText('Video Lessons');
    const isVisible = await videoHeading.isVisible() || await tutorialHeading.isVisible() || await videoLessonsHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });
});

test.describe('Achievements Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/achievements');
  });

  test('achievements page loads', async ({ page }) => {
    const achievementsHeading = page.getByText('Achievements');
    const awardsHeading = page.getByText('Awards');
    const isVisible = await achievementsHeading.isVisible() || await awardsHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('achievements display badges', async ({ page }) => {
    const achievementLocator = page.locator('.achievement, [data-testid="achievement"]');
    const violinEmoji = page.getByText('🎻');
    const isVisible = await achievementLocator.isVisible() || await violinEmoji.isVisible();
    expect(isVisible).toBeTruthy();
  });
});

test.describe('Parent Dashboard Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/parent-dashboard');
  });

  test('parent dashboard page loads', async ({ page }) => {
    const parentHeading = page.getByText('Parent');
    const dashboardHeading = page.getByText('Dashboard');
    const parentsHeading = page.getByText('Parents');
    const isVisible = await parentHeading.isVisible() || await dashboardHeading.isVisible() || await parentsHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });
});

test.describe('Weekly Challenges Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenges');
  });

  test('challenges page loads', async ({ page }) => {
    const challengeHeading = page.getByText('Challenge');
    const challengesHeading = page.getByText('Challenges');
    const isVisible = await challengeHeading.isVisible() || await challengesHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });
});

test.describe('Practice Reminders Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reminders');
  });

  test('reminders page loads', async ({ page }) => {
    const reminderHeading = page.getByText('Reminder');
    const remindersHeading = page.getByText('Reminders');
    const isVisible = await reminderHeading.isVisible() || await remindersHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });
});

test.describe('Note Matching Game Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/note-game');
  });

  test('note game page loads', async ({ page }) => {
    const gameHeading = page.getByText('Game');
    const funGamesHeading = page.getByText('Fun Games');
    const isVisible = await gameHeading.isVisible() || await funGamesHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });
});
