import { test, expect } from '@playwright/test';

test.describe('Home Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('home page loads with correct title and heading', async ({ page }) => {
    await expect(page).toHaveTitle(/Violin Mentor/);
    await expect(page.getByText('🎻 Violin Mentor')).toBeVisible();
    await expect(page.getByText('Start your violin journey')).toBeVisible();
  });

  test('progress statistics are displayed', async ({ page }) => {
    await expect(page.getByText('Practice')).toBeVisible();
    await expect(page.getByText('Day Streak')).toBeVisible();
    await expect(page.getByText('Accuracy')).toBeVisible();
  });

  test('main action buttons are visible and clickable', async ({ page }) => {
    await expect(page.getByText('Learn')).toBeVisible();
    await expect(page.getByText('Practice')).toBeVisible();
    await expect(page.getByText('Play')).toBeVisible();
  });

  test('main action buttons navigate to correct pages', async ({ page }) => {
    // Test Learn button
    await page.getByText('Learn').click();
    await expect(page).toHaveURL('/beginner-path');
    
    await page.goto('/');
    
    // Test Practice button
    await page.getByText('Practice').click();
    await expect(page).toHaveURL('/free-play');
    
    await page.goto('/');
    
    // Test Play button
    await page.getByText('Play').click();
    await expect(page).toHaveURL('/lessons');
  });

  test('quick tools section is displayed', async ({ page }) => {
    await expect(page.getByText('Quick Tools')).toBeVisible();
    await expect(page.getByText('Tuner')).toBeVisible();
    await expect(page.getByText('Beat')).toBeVisible();
  });

  test('quick tools navigate to correct pages', async ({ page }) => {
    // Test Tuner
    await page.getByText('Tuner').click();
    await expect(page).toHaveURL('/tuner');
    
    await page.goto('/');
    
    // Test Beat (Metronome)
    await page.getByText('Beat').click();
    await expect(page).toHaveURL('/metronome');
  });

  test('more tools section expands and collapses', async ({ page }) => {
    const moreToolsButton = page.getByText('More Tools');
    await expect(moreToolsButton).toBeVisible();
    
    // Initially collapsed
    await expect(page.getByText('Finger Guide')).not.toBeVisible();
    
    // Expand
    await moreToolsButton.click();
    await expect(page.getByText('Finger Guide')).toBeVisible();
    await expect(page.getByText('Video Lessons')).toBeVisible();
    await expect(page.getByText('Sound Compare')).toBeVisible();
    
    // Collapse
    await moreToolsButton.click();
    await expect(page.getByText('Finger Guide')).not.toBeVisible();
  });

  test('more tools buttons navigate correctly', async ({ page }) => {
    // Expand more tools
    await page.getByText('More Tools').click();
    
    // Test a few tools
    await page.getByText('Finger Guide').click();
    await expect(page).toHaveURL('/fingerboard');
  });

  test('continue learning section is displayed', async ({ page }) => {
    await expect(page.getByText('Continue Learning')).toBeVisible();
    await expect(page.getByText('Ready to start learning?')).toBeVisible();
  });

  test('continue learning button navigates to beginner path', async ({ page }) => {
    await page.getByText('Start Beginner Path').click();
    await expect(page).toHaveURL('/beginner-path');
  });

  test('Google Sign In button is visible when not authenticated', async ({ page }) => {
    // Clear localStorage to simulate not authenticated state
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    await expect(page.getByText('Sign in with Google')).toBeVisible();
  });

  test('page is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await expect(page.getByText('🎻 Violin Mentor')).toBeVisible();
    await expect(page.getByText('Learn')).toBeVisible();
  });

  test('page is responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    await expect(page.getByText('🎻 Violin Mentor')).toBeVisible();
    await expect(page.getByText('Learn')).toBeVisible();
  });
});
