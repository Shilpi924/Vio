import { test, expect } from '@playwright/test';

test.describe('Free Play Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/free-play');
  });

  test('free play page loads with correct heading', async ({ page }) => {
    await expect(page.getByText('� Free Play')).toBeVisible();
    await expect(page.getByText('Tap the strings and make music!')).toBeVisible();
  });

  test('violin strings are displayed', async ({ page }) => {
    await expect(page.locator('.bg-white').first()).toBeVisible();
  });

  test('volume control is visible', async ({ page }) => {
    const volumeSlider = page.locator('input[type="range"]');
    await expect(volumeSlider).toBeVisible();
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
    await page.goto('/free-play');
    
    await expect(page.getByText('� Free Play')).toBeVisible();
  });

  test('page is responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/free-play');
    
    await expect(page.getByText('� Free Play')).toBeVisible();
  });
});
