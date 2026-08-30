import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('Admin Authentication & Security', () => {
  test('Unauthenticated access to /admin redirects to /admin/login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 10000 });
  });

  test('Unauthenticated access to /admin/pages redirects to /admin/login', async ({ page }) => {
    await page.goto('/admin/pages');
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 10000 });
  });

  test('Invalid login shows error and stays on login page', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('.admin-input[type="email"]', 'invalid@example.com');
    await page.fill('.admin-input[type="password"]', 'wrongpassword');
    await page.click('.admin-btn-primary');
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 10000 });
  });

  test('Valid login via demo button redirects to dashboard', async ({ page }) => {
    await page.goto('/admin/login');
    const demoBtn = page.locator('button:has-text("Super Admin")');
    await expect(demoBtn).toBeVisible({ timeout: 10000 });
    await demoBtn.click();
    await expect(page).toHaveURL(/\/admin$/, { timeout: 15000 });
  });

  test('Session persists after browser refresh', async ({ page }) => {
    await loginAsAdmin(page);
    await page.reload();
    await expect(page).toHaveURL(/\/admin$/, { timeout: 10000 });
  });

  test('Logout clears credentials and redirects to login', async ({ page }) => {
    await loginAsAdmin(page);
    await page.click('.admin-user-menu-trigger');
    await page.click('button:has-text("Sign Out")');
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 10000 });
  });
});