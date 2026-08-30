import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('Admin Page Content Editors (Tabbed)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/pages');
    await expect(page.locator('h1:has-text("Page Content Editors")')).toBeVisible({ timeout: 10000 });
  });

  test('Tab bar renders all 9 page tabs', async ({ page }) => {
    await expect(page.locator('button:has-text("Home Page")')).toBeVisible();
    await expect(page.locator('button:has-text("About Us")')).toBeVisible();
    await expect(page.locator('button:has-text("Products & Services")')).toBeVisible();
    await expect(page.locator('button:has-text("Expertise")')).toBeVisible();
    await expect(page.locator('button:has-text("Customer Experience")')).toBeVisible();
    await expect(page.locator('button:has-text("Case Studies")')).toBeVisible();
    await expect(page.locator('button:has-text("Blog & News")')).toBeVisible();
    await expect(page.locator('button:has-text("Careers")')).toBeVisible();
    await expect(page.locator('button:has-text("Contact Us")')).toBeVisible();
  });

  test('Tab switching: About Us loads Director Keynote, Mission & Vision', async ({ page }) => {
    await page.click('button:has-text("About Us")');
    await expect(page).toHaveURL(/tab=about-page/, { timeout: 8000 });
    await expect(page.locator('text=Director Keynote Speech')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Mission & Vision' })).toBeVisible();
  });

  test('Tab switching: Products & Services loads tab labels', async ({ page }) => {
    await page.click('button:has-text("Products & Services")');
    await expect(page).toHaveURL(/tab=product-services-page/, { timeout: 8000 });
    await expect(page.locator('text=Services Tab Label')).toBeVisible();
    await expect(page.locator('text=Products Tab Label')).toBeVisible();
  });

  test('Tab switching: Careers loads Current Openings', async ({ page }) => {
    await page.click('button:has-text("Careers")');
    await expect(page).toHaveURL(/tab=career-page/, { timeout: 8000 });
    await expect(page.locator('text=Current Openings Title')).toBeVisible();
    await expect(page.locator('text=Internship Openings Title')).toBeVisible();
  });

  test('Content mutation & persistence: Update Hero Headline', async ({ page }) => {
    await page.click('button:has-text("Home Page")');
    await expect(page.locator('label:has-text("Main Headline Title")')).toBeVisible({ timeout: 8000 });

    const heroHeadline = page.locator('label:has-text("Main Headline Title")').locator('..').locator('.admin-input').first();
    await heroHeadline.fill('Playwright Test Headline');

    await page.click('button:has-text("Save Page Content")');
    await expect(page.locator('text=Page content saved successfully!')).toBeVisible({ timeout: 10000 });

    await page.reload();
    await expect(heroHeadline).toHaveValue('Playwright Test Headline', { timeout: 10000 });
  });
});