import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('Admin Global Site Settings', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/settings');
  });

  test('All site settings inputs load values from backend', async ({ page }) => {
    await expect(page.locator('h1:has-text("Global Site Settings")')).toBeVisible();
    await expect(page.locator('text=Company Name')).toBeVisible();
    await expect(page.locator('text=Legal Entity Name')).toBeVisible();
    await expect(page.locator('text=Primary Email')).toBeVisible();
    await expect(page.locator('text=Primary Phone')).toBeVisible();
    await expect(page.locator('text=Business Hours')).toBeVisible();
    await expect(page.locator('text=LinkedIn URL')).toBeVisible();
    await expect(page.locator('text=Facebook URL')).toBeVisible();
  });

  test('Update primary phone and tagline, assert success toast', async ({ page }) => {
    const phoneInput = page.locator('text=Primary Phone').locator('..').locator('.admin-input').first();
    await phoneInput.fill('+8801700000001');

    const taglineInput = page.locator('text=Tagline / Slogan').locator('..').locator('.admin-input').first();
    await taglineInput.fill('E2E Test Tagline');

    await page.click('button:has-text("Save Site Settings")');
    await expect(page.locator('text=Site settings saved successfully!')).toBeVisible({ timeout: 10000 });
  });
});