import { test } from '@playwright/test';

test.describe('Betting Window Lock', () => {
  test('User cannot click entries to predict after contest starts', async () => {
    // This is a placeholder test that needs to be updated with real selectors and auth logic
    // once the frontend implementation is complete. It assumes the contest is mocked as "started"
    
    // Setup mock data/state where a contest has already started
    
    // await page.goto('/semi1');
    
    // Verify the entry has pointer-events-none class
    // const entry = page.locator('.entry-item').first();
    // await expect(entry).toHaveClass(/pointer-events-none/);
    
    // Verify styles remain intact (opacity 1, border standard)
    // await expect(entry).toHaveCSS('opacity', '1');
  });
});
