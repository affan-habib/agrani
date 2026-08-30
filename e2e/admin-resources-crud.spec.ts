import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'superadmin1@example.com';
const ADMIN_PASSWORD = 'Password@123';

test.describe('Core Entity CRUD Lifecycles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin$/);
  });

  test.describe('Blog Posts CRUD', () => {
    test('Create new blog post, verify in DataTable, then delete', async ({ page }) => {
      await page.goto('/admin/blog');
      await expect(page.locator('button:has-text("Add New Post")')).toBeVisible();

      await page.click('button:has-text("Add New Post")');
      await expect(page.locator('input[name="title"]')).toBeVisible();

      const testTitle = `Playwright Test Post ${Date.now()}`;
      const testSlug = `playwright-test-post-${Date.now()}`;

      await page.fill('input[name="title"]', testTitle);
      await page.fill('input[name="slug"]', testSlug);
      await page.fill('textarea[name="content"]', 'This is test content from Playwright E2E test.');
      await page.selectOption('select[name="category"]', { index: 1 });
      await page.click('button:has-text("Save Post")');

      await expect(page.locator('text=Blog post created successfully')).toBeVisible({ timeout: 5000 });
      await expect(page.locator(`text=${testTitle}`)).toBeVisible({ timeout: 5000 });

      await page.click(`button[data-testid="delete-${testSlug}"]`);
      await page.click('button:has-text("Confirm Delete")');
      await expect(page.locator('text=Blog post deleted successfully')).toBeVisible({ timeout: 5000 });
      await expect(page.locator(`text=${testTitle}`)).not.toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Case Studies CRUD', () => {
    test('Create case study, edit summary, verify persistence, clean up', async ({ page }) => {
      await page.goto('/admin/case-studies');
      await expect(page.locator('button:has-text("Add New Case Study")')).toBeVisible();

      await page.click('button:has-text("Add New Case Study")');
      const testTitle = `Playwright Test Case Study ${Date.now()}`;
      const testSlug = `playwright-test-case-study-${Date.now()}`;

      await page.fill('input[name="title"]', testTitle);
      await page.fill('input[name="slug"]', testSlug);
      await page.fill('textarea[name="summary"]', 'Original summary from Playwright test.');
      await page.fill('textarea[name="challenge"]', 'Test challenge');
      await page.fill('textarea[name="solution"]', 'Test solution');
      await page.fill('textarea[name="results"]', 'Test results');
      await page.click('button:has-text("Save Case Study")');

      await expect(page.locator('text=Case study created successfully')).toBeVisible({ timeout: 5000 });
      await expect(page.locator(`text=${testTitle}`)).toBeVisible({ timeout: 5000 });

      await page.click(`button[data-testid="edit-${testSlug}"]`);
      await page.fill('textarea[name="summary"]', 'Updated summary from Playwright test.');
      await page.click('button:has-text("Save Case Study")');
      await expect(page.locator('text=Case study updated successfully')).toBeVisible({ timeout: 5000 });

      await page.reload();
      await expect(page.locator('textarea[name="summary"]')).toHaveValue('Updated summary from Playwright test.');

      await page.goto('/admin/case-studies');
      await page.click(`button[data-testid="delete-${testSlug}"]`);
      await page.click('button:has-text("Confirm Delete")');
      await expect(page.locator('text=Case study deleted successfully')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Company & Team', () => {
    test('Switch tabs between Leadership, Core Values, Capabilities, Proof Metrics', async ({ page }) => {
      await page.goto('/admin/company');

      await expect(page.locator('button:has-text("Leadership")')).toBeVisible();
      await expect(page.locator('button:has-text("Core Values")')).toBeVisible();
      await expect(page.locator('button:has-text("Capabilities")')).toBeVisible();
      await expect(page.locator('button:has-text("Proof Metrics")')).toBeVisible();

      await page.click('button:has-text("Core Values")');
      await expect(page).toHaveURL(/\/admin\/company\?tab=core-values/);

      await page.click('button:has-text("Capabilities")');
      await expect(page).toHaveURL(/\/admin\/company\?tab=capabilities/);

      await page.click('button:has-text("Proof Metrics")');
      await expect(page).toHaveURL(/\/admin\/company\?tab=proof-metrics/);
    });

    test('Add new Metric, verify auto-generated key slug, and delete', async ({ page }) => {
      await page.goto('/admin/company?tab=proof-metrics');
      await expect(page.locator('button:has-text("Add Metric")')).toBeVisible();

      await page.click('button:has-text("Add Metric")');
      await page.fill('input[name="label"]', 'E2E Uptime');
      await page.fill('input[name="value"]', '99.9');
      await page.fill('input[name="suffix"]', '%');
      await page.click('button:has-text("Save Metric")');

      await expect(page.locator('text=Metric created successfully')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=E2E Uptime')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=e2e-uptime')).toBeVisible({ timeout: 5000 });

      await page.click('button[data-testid="delete-metric-e2e-uptime"]');
      await page.click('button:has-text("Confirm Delete")');
      await expect(page.locator('text=Metric deleted successfully')).toBeVisible({ timeout: 5000 });
    });
  });
});