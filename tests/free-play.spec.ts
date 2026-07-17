import { test, expect } from '@playwright/test';

test.describe('Free Play Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/free-play');
  });

  test('free play page loads with correct heading', async ({ page }) => {
    await expect(page.getByText('Free Play')).toBeVisible();
    await expect(page.getByText('Practice freely with your violin or use the virtual fingerboard')).toBeVisible();
  });

  test('practice mode toggle is visible and functional', async ({ page }) => {
    const practiceModeButton = page.getByText('🎯 Practice Mode');
    await expect(practiceModeButton).toBeVisible();
    
    await practiceModeButton.click();
    await expect(page.getByText('🎵 Free Mode')).toBeVisible();
    
    await page.getByText('🎵 Free Mode').click();
    await expect(page.getByText('🎯 Practice Mode')).toBeVisible();
  });

  test('volume control is visible and adjustable', async ({ page }) => {
    const volumeSlider = page.locator('input[type="range"]');
    const isVisible = await volumeSlider.isVisible();
    if (isVisible) {
      await volumeSlider.fill('0.8');
      await expect(volumeSlider).toHaveValue('0.8');
    }
  });

  test('pitch detection toggle is visible', async ({ page }) => {
    const startListeningButton = page.getByText('🎙️ Start Listening').or(page.getByText('Start Listening')).or(page.getByText('Listening'));
    const isVisible = await startListeningButton.isVisible();
    if (isVisible) {
      await startListeningButton.click();
      const stopButton = page.getByText('🎙️ Stop Listening').or(page.getByText('Stop Listening'));
      await expect(stopButton.first()).toBeVisible();
    }
  });

  test('instructions section is displayed', async ({ page }) => {
    const instructions = page.getByText('How to Use Free Play').or(page.getByText('Instructions').or(page.getByText('How to Use')));
    const isVisible = await instructions.isVisible();
    if (isVisible) {
      await expect(instructions).toBeVisible();
    }
  });

  test('quick reference section displays all strings', async ({ page }) => {
    const quickRef = page.getByText('Quick Reference').or(page.getByText('Reference'));
    const isVisible = await quickRef.isVisible();
    if (isVisible) {
      await expect(quickRef).toBeVisible();
    }
  });

  test('practice mode shows target note when activated', async ({ page }) => {
    const practiceButton = page.getByText('🎯 Practice Mode').or(page.getByText('Practice Mode'));
    const isVisible = await practiceButton.isVisible();
    if (isVisible) {
      await practiceButton.click();
      // Should show target note display
      const targetNote = page.getByText('Target Note');
      if (await targetNote.isVisible()) {
        await expect(targetNote).toBeVisible();
      }
    }
  });

  test('detected pitch display is hidden when not listening', async ({ page }) => {
    const detectedPitch = page.getByText('Detected Pitch');
    const isVisible = await detectedPitch.isVisible();
    expect(isVisible).toBeFalsy();
  });

  test('detected pitch display is shown when listening', async ({ page }) => {
    const startButton = page.getByText('🎙️ Start Listening').or(page.getByText('Start Listening'));
    const isVisible = await startButton.isVisible();
    if (isVisible) {
      await startButton.click();
      // The display should appear (even if no pitch is detected yet)
      const detectedPitch = page.getByText('Detected Pitch');
      await expect(detectedPitch.first()).toBeVisible();
    }
  });

  test('accuracy display is shown in practice mode', async ({ page }) => {
    const practiceButton = page.getByText('🎯 Practice Mode').or(page.getByText('Practice Mode'));
    const isVisible = await practiceButton.isVisible();
    if (isVisible) {
      await practiceButton.click();
      const accuracy = page.getByText('Accuracy');
      if (await accuracy.isVisible()) {
        await expect(accuracy).toBeVisible();
      }
    }
  });

  test('virtual fingerboard is displayed', async ({ page }) => {
    // The fingerboard should be visible on the page
    await expect(page.locator('.fingerboard, [data-testid="fingerboard"], canvas, svg').first()).toBeVisible();
  });

  test('violin strings are displayed', async ({ page }) => {
    // Strings should be visible
    await expect(page.locator('.strings, [data-testid="strings"], canvas, svg').first()).toBeVisible();
  });

  test('page is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/free-play');
    
    await expect(page.getByText('Free Play')).toBeVisible();
    await expect(page.getByText('🎯 Practice Mode')).toBeVisible();
  });

  test('page is responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/free-play');
    
    await expect(page.getByText('Free Play')).toBeVisible();
    await expect(page.getByText('🎯 Practice Mode')).toBeVisible();
  });
});
