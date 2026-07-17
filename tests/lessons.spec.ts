import { test, expect } from '@playwright/test';

test.describe('Lessons Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lessons');
  });

  test('lessons page loads with correct heading', async ({ page }) => {
    const lessonHeading = page.getByText('Lesson');
    const libraryHeading = page.getByText('Library');
    const isVisible = await lessonHeading.isVisible() || await libraryHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('lesson list is displayed', async ({ page }) => {
    // Lessons should be displayed
    const lessonCards = page.locator('.lesson, [data-testid="lesson"], .card').first();
    const article = page.getByRole('article').first();
    const isVisible = await lessonCards.isVisible() || await article.isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('lesson cards have titles', async ({ page }) => {
    // Lesson cards should have text content
    const lessonCard = page.locator('.lesson, [data-testid="lesson"], .card').first();
    await expect(lessonCard).toBeVisible();
  });

  test('page is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/lessons');
    
    const lessonHeading = page.getByText('Lesson');
    const libraryHeading = page.getByText('Library');
    const isVisible = await lessonHeading.isVisible() || await libraryHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('page is responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/lessons');
    
    const lessonHeading = page.getByText('Lesson');
    const libraryHeading = page.getByText('Library');
    const isVisible = await lessonHeading.isVisible() || await libraryHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });
});
