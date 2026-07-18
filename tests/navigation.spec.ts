import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('home page loads correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Welcome to Violin Mentor!');
    await expect(page.getByText('Your journey to mastering the violin starts here')).toBeVisible();
  });

  test('home button navigates to dashboard', async ({ page }) => {
    await page.goto('/free-play');
    await expect(page.getByRole('heading', { name: 'Free Play', exact: true })).toBeVisible();
    
    // Click home button
    await page.getByTitle('Home').click();
    await expect(page.getByText('Learn violin, have fun!')).toBeVisible();
  });

  test('back button works after navigation', async ({ page }) => {
    await page.goto('/free-play');
    await expect(page.getByRole('heading', { name: 'Free Play', exact: true })).toBeVisible();

    await page.goto('/tutorials');
    await expect(page.getByRole('heading', { name: 'Violin Tutorials', exact: true })).toBeVisible();
    
    // Click back button
    await page.getByTitle('Go back').click();
    await expect(page.getByRole('heading', { name: 'Free Play', exact: true })).toBeVisible();
  });

  test('quick action buttons navigate correctly', async ({ page }) => {
    // Test Free Play
    await page.getByRole('button', { name: 'Open Free Play', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Free Play', exact: true })).toBeVisible();
    
    // Go back to home
    await page.getByTitle('Home').click();
    
    // Test Tutorials
    await page.getByRole('button', { name: 'Open Tutorials', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Violin Tutorials', exact: true })).toBeVisible();
    
    // Go back to home
    await page.getByTitle('Home').click();
    
    // Test Learning Path
    await page.getByRole('button', { name: 'Open Learning Path', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Learning Path', exact: true })).toBeVisible();
    
    // Go back to home
    await page.getByTitle('Home').click();
    
    // Test Progress
    await page.getByRole('button', { name: 'Open Progress', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Your Progress', exact: true })).toBeVisible();
  });

  test('navigation bar shows correct page title', async ({ page }) => {
    await page.goto('/free-play');
    await expect(page.getByRole('heading', { name: '🎵 Free Play', exact: true })).toBeVisible();

    await page.goto('/statistics');
    await expect(page.getByRole('heading', { name: 'Your Progress', exact: true })).toBeVisible();
  });
});
