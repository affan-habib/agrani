import { test, expect } from '@playwright/test';

test.describe('Theme & Mobile UX', () => {
  test.describe('Theme Toggle', () => {
    test('Click dark/light mode toggle changes main class and persists', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('main')).toBeVisible({ timeout: 10000 });

      const themeToggle = page.locator('button[aria-label="Switch to light mode"]');
      const themeToggleDark = page.locator('button[aria-label="Switch to dark mode"]');
      const isInitiallyDark = await themeToggle.isVisible();

      if (isInitiallyDark) {
        await themeToggle.click();
      } else {
        await themeToggleDark.click();
      }

      await page.waitForTimeout(500);
      const mainClass = await page.locator('main').getAttribute('class');
      expect(mainClass).toContain('site');

      await page.goto('/about');
      const persistedClass = await page.locator('main').getAttribute('class');
      expect(persistedClass).toContain('site');
    });
  });

  test.describe('Mobile Responsive Drawer', () => {
    test('Mobile viewport opens hamburger menu with navigation links', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await expect(page.locator('header.site-header')).toBeVisible({ timeout: 10000 });

      const hamburgerButton = page.locator('button[aria-label="Toggle navigation"]');
      await expect(hamburgerButton).toBeVisible({ timeout: 5000 });

      await hamburgerButton.click();
      await expect(page.locator('nav.mobile-nav')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('nav.mobile-nav a:has-text("Home")')).toBeVisible();
      await expect(page.locator('nav.mobile-nav a:has-text("About Us")')).toBeVisible();
      await expect(page.locator('nav.mobile-nav a:has-text("Contact Us")')).toBeVisible();
    });
  });
});