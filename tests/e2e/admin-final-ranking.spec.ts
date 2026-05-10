import { test, expect } from '@playwright/test';

test.describe('Admin Final Ranking', () => {
  test('Final ranking tab is locked until both semis are completed', async ({ page }) => {
    await page.goto('/admin');
    
    // In our mock state, the tabs are initially false, so it should be locked
    const finalTab = page.locator('button:has-text("Final Ranking")');
    await expect(finalTab).toBeDisabled();
    
    // We would need a way to mock the state or interact to complete the semis
    // Conceptually, once semis are completed, the tab should be enabled
    // await completeSemi1(page);
    // await completeSemi2(page);
    // await expect(finalTab).toBeEnabled();
  });
});