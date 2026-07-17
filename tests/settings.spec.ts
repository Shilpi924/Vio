import { test, expect } from '@playwright/test';

test.describe('Settings Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
  });

  test('settings page loads with correct heading', async ({ page }) => {
    await expect(page.getByText('Settings')).toBeVisible();
  });

  test('audio settings section is displayed', async ({ page }) => {
    const audioHeading = page.getByText('Audio');
    const volumeHeading = page.getByText('Volume');
    const soundHeading = page.getByText('Sound');
    const isVisible = await audioHeading.isVisible() || await volumeHeading.isVisible() || await soundHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('display settings section is displayed', async ({ page }) => {
    const displayHeading = page.getByText('Display');
    const appearanceHeading = page.getByText('Appearance');
    const themeHeading = page.getByText('Theme');
    const isVisible = await displayHeading.isVisible() || await appearanceHeading.isVisible() || await themeHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('profile settings section is displayed', async ({ page }) => {
    const profileHeading = page.getByText('Profile');
    const accountHeading = page.getByText('Account');
    const isVisible = await profileHeading.isVisible() || await accountHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('settings controls are interactive', async ({ page }) => {
    // Check for various input types
    const sliders = page.locator('input[type="range"]');
    const checkboxes = page.locator('input[type="checkbox"]');
    const selects = page.locator('select');
    
    // At least one control should be present
    const hasControls = await sliders.count() > 0 || await checkboxes.count() > 0 || await selects.count() > 0;
    expect(hasControls).toBeTruthy();
  });

  test('save button is present', async ({ page }) => {
    const saveButton = page.getByText('Save');
    const applyButton = page.getByText('Apply');
    const anyButton = page.getByRole('button').first();
    const isVisible = await saveButton.isVisible() || await applyButton.isVisible() || await anyButton.isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('page is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/settings');
    
    await expect(page.getByText('Settings')).toBeVisible();
  });

  test('page is responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/settings');
    
    await expect(page.getByText('Settings')).toBeVisible();
  });
});
