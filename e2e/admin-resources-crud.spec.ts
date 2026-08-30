import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('Core Entity CRUD Lifecycles', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test.describe('Blog Posts', () => {
    test('Blog posts page loads with DataTable', async ({ page }) => {
      await page.goto('/admin/blog');
      await expect(page.locator('h1:has-text("Blog Posts")')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('th:has-text("Title & Slug")')).toBeVisible();
    });

    test('Navigate to create blog post form', async ({ page }) => {
      await page.goto('/admin/blog');
      await page.click('a:has-text("New Blog Post")');
      await expect(page).toHaveURL(/admin\/blog\/create/, { timeout: 8000 });
    });
  });

  test.describe('Case Studies', () => {
    test('Case studies page loads with DataTable', async ({ page }) => {
      await page.goto('/admin/case-studies');
      await expect(page.locator('h1:has-text("Case Studies")')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('th:has-text("Case Study Title")')).toBeVisible();
    });

    test('Navigate to create case study form', async ({ page }) => {
      await page.goto('/admin/case-studies');
      await page.click('a:has-text("New Case Study")');
      await expect(page).toHaveURL(/admin\/case-studies\/create/, { timeout: 8000 });
    });
  });

  test.describe('Company & Team', () => {
    test('Company page loads with 4 tabs', async ({ page }) => {
      await page.goto('/admin/company');
      await expect(page.locator('h1:has-text("Company & Team")')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('button:has-text("Leadership Team")')).toBeVisible();
      await expect(page.locator('button:has-text("Core Values")')).toBeVisible();
      await expect(page.locator('button:has-text("Capabilities")')).toBeVisible();
      await expect(page.locator('button:has-text("Proof Metrics")')).toBeVisible();
    });

    test('Tab switching between sections', async ({ page }) => {
      await page.goto('/admin/company');
      await expect(page.locator('h1:has-text("Company & Team")')).toBeVisible({ timeout: 10000 });

      await page.click('button:has-text("Core Values")');
      await expect(page.locator('th:has-text("Value Title")')).toBeVisible({ timeout: 5000 });

      await page.click('button:has-text("Capabilities")');
      await expect(page.locator('th:has-text("Capability")')).toBeVisible({ timeout: 5000 });

      await page.click('button:has-text("Proof Metrics")');
      await expect(page.locator('th:has-text("Label")')).toBeVisible({ timeout: 5000 });
    });

    test('Add new Metric and verify in table', async ({ page }) => {
      await page.goto('/admin/company');
      await page.click('button:has-text("Proof Metrics")');
      await expect(page.locator('th:has-text("Label")')).toBeVisible({ timeout: 8000 });

      await page.click('button:has-text("Add New")');
      await expect(page.locator('.admin-modal')).toBeVisible({ timeout: 5000 });

      const testLabel = `E2E Metric ${Date.now().toString().slice(-4)}`;
      await page.fill('input[placeholder="e.g. Completed Projects"]', testLabel);
      await page.fill('input[placeholder="e.g. 250"]', '99.9');
      await page.fill('input[placeholder="+"]', '%');
      await page.click('button:has-text("Save Record")');

      await expect(page.locator(`td:has-text("${testLabel}")`)).toBeVisible({ timeout: 10000 });

      // Clean up the created record
      const deleteBtn = page.locator(`tr:has-text("${testLabel}") button:has-text("Delete")`);
      if (await deleteBtn.isVisible().catch(() => false)) {
        await deleteBtn.click();
        const confirmBtn = page.locator('.admin-modal-footer button:has-text("Delete")');
        await expect(confirmBtn).toBeVisible({ timeout: 5000 });
        await confirmBtn.click();
      }
    });
  });
});