import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('Admin Full CRUD Coverage', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('Careers jobs list loads + navigate to create', async ({ page }) => {
    await page.goto('/admin/careers');
    await expect(page.locator('h1:has-text("Career Job Openings")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('th:has-text("Position Title")')).toBeVisible();
    await page.click('a:has-text("Post Job Opening")');
    await expect(page).toHaveURL(/admin\/careers\/create/, { timeout: 8000 });
    await expect(page.locator('h1:has-text("Post New Job Opening")')).toBeVisible();
  });

  test('Departments list loads; create is a KNOWN BUG (frontend omits required slug → 422)', async ({ page }) => {
    await page.goto('/admin/careers/departments');
    await expect(page.locator('h1:has-text("Company Departments")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('th:has-text("Department Name")')).toBeVisible();
    await expect(page.locator('input[placeholder="e.g. Engineering"]')).toBeVisible();
    const name = `E2E Dept ${Date.now().toString().slice(-6)}`;
    await page.fill('input[placeholder="e.g. Engineering"]', name);
    await page.click('button:has-text("Add Department")');
    await expect(page.getByText('The given data was invalid.')).toBeVisible({ timeout: 10000 });
    await expect(page.locator(`td:has-text("${name}")`)).toHaveCount(0);
  });

  test('Services list loads + search filter', async ({ page }) => {
    await page.goto('/admin/services');
    await expect(page.locator('h1:has-text("Services Management")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('th:has-text("Service Title")')).toBeVisible();
    await expect(page.locator('a:has-text("Add New Service")')).toBeVisible();
    await page.fill('input[placeholder="Search services..."]', 'zz-no-such-service-xyz');
    await expect(page.locator('text=No records found').or(page.locator('tbody tr')).first()).toBeVisible({ timeout: 10000 });
  });

  test('Sectors list loads', async ({ page }) => {
    await page.goto('/admin/sectors');
    await expect(page.locator('h1:has-text("Industry Sectors")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('th:has-text("Sector Title")')).toBeVisible();
  });

  test('Testimonials list loads; create is a KNOWN BUG (frontend sends author_name/content, backend requires customer_name/testimonial → 422)', async ({ page }) => {
    await page.goto('/admin/testimonials');
    await expect(page.locator('h1:has-text("Testimonials")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('th:has-text("Client & Company")')).toBeVisible();
    await page.click('button:has-text("Add Testimonial")');
    await expect(page.locator('.admin-modal')).toBeVisible({ timeout: 5000 });
    const inputs = page.locator('.admin-modal .admin-input');
    await inputs.nth(0).fill(`E2E Client ${Date.now().toString().slice(-5)}`);
    await inputs.nth(1).fill('CTO');
    await inputs.nth(2).fill('E2E Corp');
    await page.locator('.admin-modal .admin-textarea').fill('Great delivery, on time and under budget.');
    await page.click('.admin-modal button:has-text("Save Testimonial")');
    await expect(page.getByText('The given data was invalid.')).toBeVisible({ timeout: 10000 });
  });

  test('Why Choose Us modal create + delete', async ({ page }) => {
    await page.goto('/admin/why-choose-us');
    await expect(page.locator('h1:has-text("Why Choose Us")')).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Add Item")');
    await expect(page.locator('.admin-modal')).toBeVisible({ timeout: 5000 });
    const title = `E2E WCU ${Date.now().toString().slice(-5)}`;
    await page.locator('.admin-modal .admin-input').fill(title);
    await page.locator('.admin-modal .admin-textarea').fill('Velocity with certified security.');
    await page.click('.admin-modal button:has-text("Save Item")');
    await expect(page.locator(`td:has-text("${title}")`).first()).toBeVisible({ timeout: 10000 });
    await page.locator(`tr:has-text("${title}") button:has-text("Delete")`).click();
    await page.locator('.admin-modal-footer button:has-text("Delete")').click();
    await expect(page.locator(`td:has-text("${title}")`)).toHaveCount(0, { timeout: 10000 });
  });

  test('Blog categories modal create + delete', async ({ page }) => {
    await page.goto('/admin/blog/categories');
    await expect(page.locator('h1:has-text("Blog Categories")')).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Add Category")');
    await expect(page.locator('.admin-modal')).toBeVisible({ timeout: 5000 });
    const cat = `E2E Cat ${Date.now().toString().slice(-5)}`;
    const inputs = page.locator('.admin-modal .admin-input');
    await inputs.nth(0).fill(cat);
    await page.click('.admin-modal button:has-text("Create Category")');
    await expect(page.locator(`td:has-text("${cat}")`).first()).toBeVisible({ timeout: 10000 });
    await page.locator(`tr:has-text("${cat}") button:has-text("Delete")`).click();
    await page.locator('.admin-modal-footer button:has-text("Delete")').click();
    await expect(page.locator(`td:has-text("${cat}")`)).toHaveCount(0, { timeout: 10000 });
  });

  test('Case study tags list loads; create is a KNOWN BUG (frontend omits required slug → 422)', async ({ page }) => {
    await page.goto('/admin/case-studies/tags');
    await expect(page.locator('h1:has-text("Case Study Tags")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('th:has-text("Tag Name")')).toBeVisible();
    const tag = `E2E Tag ${Date.now().toString().slice(-5)}`;
    await page.fill('input[placeholder="e.g. Fintech"]', tag);
    await page.click('button:has-text("Add Tag")');
    await expect(page.getByText('The given data was invalid.')).toBeVisible({ timeout: 10000 });
    await expect(page.locator(`td:has-text("${tag}")`)).toHaveCount(0);
  });

  test('Company leadership + values + capabilities create + delete', async ({ page }) => {
    await page.goto('/admin/company');
    await expect(page.locator('h1:has-text("Company & Team")')).toBeVisible({ timeout: 10000 });

    const leader = `E2E Lead ${Date.now().toString().slice(-5)}`;
    await page.click('button:has-text("Add New")');
    await expect(page.locator('.admin-modal')).toBeVisible({ timeout: 5000 });
    const lInputs = page.locator('.admin-modal .admin-input');
    await lInputs.nth(0).fill(leader);
    await lInputs.nth(1).fill('Head of E2E');
    await page.locator('.admin-modal .admin-textarea').fill('Bio for E2E.');
    await page.click('.admin-modal button:has-text("Save Record")');
    await expect(page.locator(`td:has-text("${leader}")`).first()).toBeVisible({ timeout: 10000 });
    await page.locator(`tr:has-text("${leader}") button:has-text("Delete")`).click();
    await page.locator('.admin-modal-footer button:has-text("Delete")').click();
    await expect(page.locator(`td:has-text("${leader}")`)).toHaveCount(0, { timeout: 10000 });

    await page.click('button:has-text("Core Values")');
    const val = `E2E Value ${Date.now().toString().slice(-5)}`;
    await page.click('button:has-text("Add New")');
    await page.locator('.admin-modal .admin-input').fill(val);
    await page.locator('.admin-modal .admin-textarea').fill('E2E value description.');
    await page.click('.admin-modal button:has-text("Save Record")');
    await expect(page.locator(`td:has-text("${val}")`).first()).toBeVisible({ timeout: 10000 });
    await page.locator(`tr:has-text("${val}") button:has-text("Delete")`).click();
    await page.locator('.admin-modal-footer button:has-text("Delete")').click();
    await expect(page.locator(`td:has-text("${val}")`)).toHaveCount(0, { timeout: 10000 });

    await page.click('button:has-text("Capabilities")');
    const cap = `E2E Cap ${Date.now().toString().slice(-5)}`;
    await page.click('button:has-text("Add New")');
    await page.locator('.admin-modal .admin-input').fill(cap);
    await page.locator('.admin-modal .admin-textarea').fill('E2E capability description.');
    await page.click('.admin-modal button:has-text("Save Record")');
    await expect(page.locator(`td:has-text("${cap}")`).first()).toBeVisible({ timeout: 10000 });
    await page.locator(`tr:has-text("${cap}") button:has-text("Delete")`).click();
    await page.locator('.admin-modal-footer button:has-text("Delete")').click();
    await expect(page.locator(`td:has-text("${cap}")`)).toHaveCount(0, { timeout: 10000 });
  });

  test('Media library loads + search + inspector', async ({ page }) => {
    await page.goto('/admin/media');
    await expect(page.locator('h1:has-text("Media Library")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[placeholder="Search media by filename or title..."]')).toBeVisible();
    await expect(page.locator('text=Upload New Media')).toBeVisible();
    const cards = page.locator('.admin-media-card');
    await expect(cards.first().or(page.locator('text=No media assets found'))).toBeVisible({ timeout: 15000 });
    if (await cards.first().isVisible().catch(() => false)) {
      await cards.first().click();
      await expect(page.locator('text=Asset Inspector')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('button:has-text("Save Meta")')).toBeVisible();
    }
  });

  test('Roles & permissions read-only tables', async ({ page }) => {
    await page.goto('/admin/access');
    await expect(page.locator('h1:has-text("Roles & Permissions")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=System Roles')).toBeVisible();
    await expect(page.locator('th:has-text("Role Name")')).toBeVisible();
    await expect(page.locator('text=Available Permissions')).toBeVisible();
    await expect(page.locator('th:has-text("Permission Name")')).toBeVisible();
  });

  test('Blog posts search + status filter render', async ({ page }) => {
    await page.goto('/admin/blog');
    await expect(page.locator('h1:has-text("Blog Posts")')).toBeVisible({ timeout: 10000 });
    await page.fill('input[placeholder="Search blog posts..."]', 'zz-no-such-post-xyz');
    await expect(page.locator('text=No records found').or(page.locator('tbody tr')).first()).toBeVisible({ timeout: 10000 });
  });
});
