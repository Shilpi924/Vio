import { test, expect } from '@playwright/test';

test.describe('Statistics Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/statistics');
  });

  test('statistics page loads with correct heading', async ({ page }) => {
    await expect(page.getByText('🎉 Your Progress')).toBeVisible();
    await expect(page.getByText('Look how much you\'ve learned!')).toBeVisible();
  });

  test('stats cards are displayed', async ({ page }) => {
    await expect(page.getByText('Practice Time')).toBeVisible();
    await expect(page.getByText('Day Streak')).toBeVisible();
    await expect(page.getByText('Notes Played')).toBeVisible();
    await expect(page.getByText('Lessons Done')).toBeVisible();
  });

  test('achievement section is displayed', async ({ page }) => {
    await expect(page.getByText('Amazing Work!')).toBeVisible();
  });

  test('tips section is displayed', async ({ page }) => {
    await expect(page.getByText('Tips')).toBeVisible();
  });

  test('back button is displayed', async ({ page }) => {
    await expect(page.getByText('Back to Home')).toBeVisible();
  });

  test('back button navigates to home', async ({ page }) => {
    await page.getByText('Back to Home').click();
    await expect(page).toHaveURL('/');
  });

  test('page is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/statistics');
    
    await expect(page.getByText('🎉 Your Progress')).toBeVisible();
  });

  test('page is responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/statistics');
    
    await expect(page.getByText('🎉 Your Progress')).toBeVisible();
  });
});
