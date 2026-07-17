import { test, expect } from '@playwright/test';

test.describe('Statistics Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/statistics');
  });

  test('statistics page loads with correct heading', async ({ page }) => {
    await expect(page.getByText('Your Progress')).toBeVisible();
    await expect(page.getByText('Track your violin learning journey')).toBeVisible();
  });

  test('overview cards are displayed', async ({ page }) => {
    await expect(page.getByText('Total Practice')).toBeVisible();
    await expect(page.getByText('Notes Played')).toBeVisible();
    await expect(page.getByText('Accuracy')).toBeVisible();
    await expect(page.getByText('Current Streak')).toBeVisible();
  });

  test('practice time card shows data', async ({ page }) => {
    await expect(page.getByText('⏱️')).toBeVisible();
    await expect(page.getByText('Lifetime practice time')).toBeVisible();
  });

  test('notes played card shows data', async ({ page }) => {
    await expect(page.getByText('🎵')).toBeVisible();
    await expect(page.getByText('Total notes practiced')).toBeVisible();
  });

  test('accuracy card shows data', async ({ page }) => {
    await expect(page.getByText('🎯')).toBeVisible();
    await expect(page.getByText('Overall accuracy')).toBeVisible();
  });

  test('streak card shows data', async ({ page }) => {
    await expect(page.getByText('🔥')).toBeVisible();
    await expect(page.getByText('Keep it up!')).toBeVisible();
  });

  test('lessons completed section is displayed', async ({ page }) => {
    await expect(page.getByText('Lessons Completed')).toBeVisible();
    await expect(page.getByText('Total Completed')).toBeVisible();
    await expect(page.getByText('Total XP Earned')).toBeVisible();
    await expect(page.getByText('Songs Completed')).toBeVisible();
  });

  test('recent activity section is displayed', async ({ page }) => {
    await expect(page.getByText('Recent Activity')).toBeVisible();
  });

  test('skills progress section is displayed', async ({ page }) => {
    await expect(page.getByText('Skills Progress')).toBeVisible();
    await expect(page.getByText('Note Reading')).toBeVisible();
    await expect(page.getByText('Intonation')).toBeVisible();
    await expect(page.getByText('Rhythm')).toBeVisible();
    await expect(page.getByText('Bowing Technique')).toBeVisible();
    await expect(page.getByText('Scales')).toBeVisible();
    await expect(page.getByText('Sight Reading')).toBeVisible();
  });

  test('skill progress bars are visible', async ({ page }) => {
    // Check for progress bars (they should have width styles)
    const progressBars = page.locator('[style*="width"]');
    await expect(progressBars.first()).toBeVisible();
  });

  test('achievements section is displayed', async ({ page }) => {
    await expect(page.getByText('Achievements')).toBeVisible();
    await expect(page.getByText('First Note')).toBeVisible();
    await expect(page.getByText('Sharp Shooter')).toBeVisible();
    await expect(page.getByText('Week Warrior')).toBeVisible();
  });

  test('practice tips section is displayed', async ({ page }) => {
    await expect(page.getByText('💡 Practice Tips')).toBeVisible();
    await expect(page.getByText('Aim for at least 15-30 minutes of practice daily')).toBeVisible();
  });

  test('achievement badges are displayed', async ({ page }) => {
    await expect(page.getByText('🎻')).toBeVisible();
    await expect(page.getByText('🎯')).toBeVisible();
    await expect(page.getByText('🔥')).toBeVisible();
  });

  test('page is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/statistics');
    
    await expect(page.getByText('Your Progress')).toBeVisible();
    await expect(page.getByText('Total Practice')).toBeVisible();
  });

  test('page is responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/statistics');
    
    await expect(page.getByText('Your Progress')).toBeVisible();
    await expect(page.getByText('Total Practice')).toBeVisible();
  });
});
