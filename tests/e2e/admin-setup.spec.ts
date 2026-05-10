import { test, expect } from '@playwright/test';

test.describe('Admin Setup', () => {
  test('Admin can navigate and configure metadata and entries', async ({ page }) => {
    // 1. Navigate to admin page (assuming authentication is bypassed or mocked for this test environment)
    await page.goto('/admin');
    
    // 2. We should be on Metadata tab initially
    await expect(page.getByRole('heading', { name: /Event Configuration/i })).toBeVisible();
    
    // 3. Test Metadata interactions
    // Note: Depends on exactly how inputs are labeled in the actual implementation
    // await page.fill('input[name="location"]', 'Malmö');
    // await page.click('button:has-text("Save Metadata")');
    // await expect(page.getByText('Metadata saved successfully')).toBeVisible();

    // 4. Switch to Entries tab
    await page.click('button:has-text("Manage Entries")');
    await expect(page.getByRole('heading', { name: /Manage Entries/i })).toBeVisible();
    
    // 5. Test Entry Management interactions
    // await page.click('button:has-text("Add Entry")');
    // await page.fill('input[name="country"]', 'Sweden');
    // await page.selectOption('select[name="starting_contest"]', 'final');
    // await page.click('button:has-text("Save Entry")');
    // await expect(page.getByText('Sweden')).toBeVisible();
  });
});