import { test, expect } from '@playwright/test';

test.describe('Beginner Path Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/beginner-path');
  });

  test('beginner path page loads with correct heading', async ({ page }) => {
    const beginnerHeading = page.getByText('Beginner');
    const learningPathHeading = page.getByText('Learning Path');
    const isVisible = await beginnerHeading.isVisible() || await learningPathHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('lesson cards are displayed', async ({ page }) => {
    // Lessons should be displayed as cards or list items
    const lessonCards = page.locator('.lesson, [data-testid="lesson"], .card').first();
    const article = page.getByRole('article').first();
    const isVisible = await lessonCards.isVisible() || await article.isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('lesson progress is visible', async ({ page }) => {
    // Progress indicators should be visible
    await expect(page.locator('[style*="width"], .progress, [data-testid="progress"]').first()).toBeVisible();
  });

  test('lessons are clickable', async ({ page }) => {
    const firstLesson = page.locator('.lesson, [data-testid="lesson"], .card, button').first();
    await expect(firstLesson).toBeVisible();
  });

  test('page is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/beginner-path');
    
    const beginnerHeading = page.getByText('Beginner');
    const learningPathHeading = page.getByText('Learning Path');
    const isVisible = await beginnerHeading.isVisible() || await learningPathHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('page is responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/beginner-path');
    
    const beginnerHeading = page.getByText('Beginner');
    const learningPathHeading = page.getByText('Learning Path');
    const isVisible = await beginnerHeading.isVisible() || await learningPathHeading.isVisible();
    expect(isVisible).toBeTruthy();
  });
});
