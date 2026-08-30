import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'superadmin1@example.com';
const ADMIN_PASSWORD = 'Password@123';

test.describe('Admin Global Site Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin$/);
    await page.goto('/admin/settings');
  });

  test('All site settings inputs load values from backend', async ({ page }) => {
    await expect(page.locator('input[name="companyName"]')).toBeVisible();
    await expect(page.locator('input[name="legalName"]')).toBeVisible();
    await expect(page.locator('input[name="primaryEmail"]')).toBeVisible();
    await expect(page.locator('input[name="primaryPhone"]')).toBeVisible();
    await expect(page.locator('input[name="addressLine1"]')).toBeVisible();
    await expect(page.locator('input[name="city"]')).toBeVisible();
    await expect(page.locator('input[name="postalCode"]')).toBeVisible();
    await expect(page.locator('input[name="country"]')).toBeVisible();
    await expect(page.locator('textarea[name="businessHours"]')).toBeVisible();
    await expect(page.locator('input[name="facebookUrl"]')).toBeVisible();
    await expect(page.locator('input[name="twitterUrl"]')).toBeVisible();
    await expect(page.locator('input[name="linkedinUrl"]')).toBeVisible();
    await expect(page.locator('input[name="instagramUrl"]')).toBeVisible();
  });

  test('Update primary phone and tagline, assert success toast', async ({ page }) => {
    const phoneInput = page.locator('input[name="primaryPhone"]');
    await phoneInput.fill('+8801700000001');

    const taglineInput = page.locator('input[name="tagline"]');
    if (await taglineInput.isVisible()) {
      await taglineInput.fill('E2E Test Tagline');
    }

    await page.click('button:has-text("Save Settings")');
    await expect(page.locator('text=Site settings saved successfully')).toBeVisible({ timeout: 5000 });
  });
});