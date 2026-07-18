import { test, expect } from '@playwright/test';

test.describe('Beginner Path Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/beginner-path');
  });

  test('beginner path page loads with correct heading', async ({ page }) => {
    const violinHeading = page.getByText('� Your Violin Journey');
    const isVisible = await violinHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('progress bar is visible', async ({ page }) => {
    await expect(page.getByText('Progress')).toBeVisible();
  });

  test('current step card is displayed', async ({ page }) => {
    await expect(page.getByText('I did it!')).toBeVisible();
  });

  test('steps overview is displayed', async ({ page }) => {
    await expect(page.getByText('All Steps')).toBeVisible();
  });

  test('page is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/beginner-path');
    
    const violinHeading = page.getByText('� Your Violin Journey');
    const isVisible = await violinHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('page is responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/beginner-path');
    
    const violinHeading = page.getByText('� Your Violin Journey');
    const isVisible = await violinHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });
});
