import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'superadmin1@example.com';
const ADMIN_PASSWORD = 'Password@123';

test.describe('Admin Authentication & Security', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
  });

  test('Unauthenticated access to /admin redirects to /admin/login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('Unauthenticated access to /admin/pages redirects to /admin/login', async ({ page }) => {
    await page.goto('/admin/pages');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('Invalid login shows error toast and stays on login page', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid credentials')).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('Valid login stores token, redirects to dashboard, and displays user name', async ({ page }) => {
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.locator('text=superadmin1')).toBeVisible({ timeout: 5000 });
  });

  test('Session persists after browser refresh', async ({ page }) => {
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/admin$/);
    await page.reload();
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.locator('text=superadmin1')).toBeVisible({ timeout: 5000 });
  });

  test('Logout clears credentials and redirects to login', async ({ page }) => {
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/admin$/);
    await page.click('text=Logout');
    await expect(page).toHaveURL(/\/admin\/login/);

    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});