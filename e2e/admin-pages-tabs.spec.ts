import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'superadmin1@example.com';
const ADMIN_PASSWORD = 'Password@123';

test.describe('Admin Page Content Editors (Tabbed)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin$/);
    await page.goto('/admin/pages');
  });

  test('Tab bar renders all 9 page tabs with Lucide icons', async ({ page }) => {
    const tabs = [
      { name: 'Home', icon: 'home' },
      { name: 'About Us', icon: 'users' },
      { name: 'Products & Services', icon: 'package' },
      { name: 'Expertise', icon: 'cpu' },
      { name: 'Customer Experience', icon: 'heart' },
      { name: 'Case Studies', icon: 'folder-open' },
      { name: 'Blog & News', icon: 'newspaper' },
      { name: 'Careers', icon: 'briefcase' },
      { name: 'Contact Us', icon: 'mail' },
    ];

    for (const tab of tabs) {
      await expect(page.locator(`button:has-text("${tab.name}")`)).toBeVisible();
    }
  });

  test('Tab switching: About Us loads Director Keynote, Mission & Vision fields', async ({ page }) => {
    await page.click('button:has-text("About Us")');
    await expect(page).toHaveURL(/\/admin\/pages\?tab=about-page/);

    await expect(page.locator('input[name="directorKeynote"]')).toBeVisible();
    await expect(page.locator('textarea[name="mission"]')).toBeVisible();
    await expect(page.locator('textarea[name="vision"]')).toBeVisible();
  });

  test('Tab switching: Products & Services loads Services Tab Label and Products Tab Label', async ({ page }) => {
    await page.click('button:has-text("Products & Services")');
    await expect(page).toHaveURL(/\/admin\/pages\?tab=product-services-page/);

    await expect(page.locator('input[name="servicesTabLabel"]')).toBeVisible();
    await expect(page.locator('input[name="productsTabLabel"]')).toBeVisible();
  });

  test('Tab switching: Careers loads Current Openings and Internship titles', async ({ page }) => {
    await page.click('button:has-text("Careers")');
    await expect(page).toHaveURL(/\/admin\/pages\?tab=career-page/);

    await expect(page.locator('input[name="currentOpeningsTitle"]')).toBeVisible();
    await expect(page.locator('input[name="internshipTitle"]')).toBeVisible();
  });

  test('Content mutation & persistence: Update Hero Headline on Home tab', async ({ page }) => {
    await page.click('button:has-text("Home")');
    await expect(page).toHaveURL(/\/admin\/pages\?tab=home-page/);

    const heroHeadline = page.locator('input[name="heroHeadline"]');
    await heroHeadline.fill('Playwright Test Headline');

    await page.click('button:has-text("Save Page Content")');
    await expect(page.locator('text=Page content saved successfully')).toBeVisible({ timeout: 5000 });

    await page.reload();
    await expect(heroHeadline).toHaveValue('Playwright Test Headline');
  });
});