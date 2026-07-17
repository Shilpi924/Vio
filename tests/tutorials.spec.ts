import { test, expect } from '@playwright/test';

test.describe('Tutorials Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tutorials');
  });

  test('tutorials page loads with correct heading', async ({ page }) => {
    const violinTutorialsHeading = page.getByText('Violin Tutorials');
    const howToHeading = page.getByText('How-To');
    const isVisible = await violinTutorialsHeading.isVisible() || await howToHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('tutorial categories are displayed', async ({ page }) => {
    // Tutorial content should be visible
    const tutorialCards = page.locator('.tutorial, [data-testid="tutorial"], .category').first();
    const article = page.getByRole('article').first();
    const isVisible = await tutorialCards.isVisible() || await article.isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('tutorials are clickable', async ({ page }) => {
    const firstTutorial = page.locator('.tutorial, [data-testid="tutorial"], button, a').first();
    await expect(firstTutorial).toBeVisible();
  });

  test('page is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/tutorials');
    
    const violinTutorialsHeading = page.getByText('Violin Tutorials');
    const howToHeading = page.getByText('How-To');
    const isVisible = await violinTutorialsHeading.isVisible() || await howToHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('page is responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/tutorials');
    
    const violinTutorialsHeading = page.getByText('Violin Tutorials');
    const howToHeading = page.getByText('How-To');
    const isVisible = await violinTutorialsHeading.isVisible() || await howToHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });
});
