import { test, expect } from '@playwright/test';

test.describe('Home Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('home page loads with correct title and heading', async ({ page }) => {
    // Wait for the app logo in the navbar
    await expect(page.getByText('Violin Mentor')).toBeVisible();
    await expect(page.getByText('Learn violin, have fun!')).toBeVisible();
  });

  test('progress statistics are displayed', async ({ page }) => {
    await expect(page.getByText('Practice')).toBeVisible();
    await expect(page.getByText('Days')).toBeVisible();
  });

  test('main action buttons are visible and clickable', async ({ page }) => {
    await expect(page.getByText('Learn')).toBeVisible();
    await expect(page.getByText('Play')).toBeVisible();
    await expect(page.getByText('Songs')).toBeVisible();
  });

  test('main action buttons navigate to correct pages', async ({ page }) => {
    // Test Learn button
    await page.getByText('Learn').click();
    await expect(page).toHaveURL('/beginner-path');
    
    await page.goto('/');
    
    // Test Play button
    await page.getByText('Play').click();
    await expect(page).toHaveURL('/free-play');
    
    await page.goto('/');
    
    // Test Songs button
    await page.getByText('Songs').click();
    await expect(page).toHaveURL('/lessons');
  });

  test('continue learning section is displayed', async ({ page }) => {
    await expect(page.getByText('Ready to play your first song?')).toBeVisible();
  });

  test('continue learning button navigates to beginner path', async ({ page }) => {
    await page.getByText('Start Learning').click();
    await expect(page).toHaveURL('/beginner-path');
  });

  test('page is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await expect(page.getByText('Learn')).toBeVisible();
  });

  test('page is responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    await expect(page.getByText('Learn')).toBeVisible();
  });
});
