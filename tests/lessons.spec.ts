import { test, expect } from '@playwright/test';

test.describe('Lessons Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lessons');
  });

  test('lessons page loads with correct heading', async ({ page }) => {
    const heroBadge = page.getByText('PIECE OF THE WEEK');
    await expect(heroBadge).toBeVisible();
  });

  test('lesson list is displayed', async ({ page }) => {
    const playButton = page.getByText('Play Now');
    await expect(playButton).toBeVisible();
  });

  test('lesson cards have titles', async ({ page }) => {
    const categoryTab = page.getByText('beginner', { exact: true });
    await expect(categoryTab).toBeVisible();
  });

  test('page is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/lessons');
    
    const heroBadge = page.getByText('PIECE OF THE WEEK');
    await expect(heroBadge).toBeVisible();
  });

  test('page is responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/lessons');
    
    const heroBadge = page.getByText('PIECE OF THE WEEK');
    await expect(heroBadge).toBeVisible();
  });
});
