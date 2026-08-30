import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'superadmin1@example.com';
const ADMIN_PASSWORD = 'Password@123';

test.describe('Admin Inquiries, Leads & Submissions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin$/);
  });

  test.describe('Quote Requests', () => {
    test('Data table displays quote submissions with Sender, Origin/City, Note, Status', async ({ page }) => {
      await page.goto('/admin/inquiries/quotes');
      await expect(page.locator('table')).toBeVisible();
      await expect(page.locator('th:has-text("Sender")')).toBeVisible();
      await expect(page.locator('th:has-text("Origin/City")')).toBeVisible();
      await expect(page.locator('th:has-text("Note")')).toBeVisible();
      await expect(page.locator('th:has-text("Status")')).toBeVisible();
    });

    test('Click Details on a quote shows modal with client info and status dropdown', async ({ page }) => {
      await page.goto('/admin/inquiries/quotes');
      await page.waitForSelector('button:has-text("Details")', { timeout: 5000 });

      const detailsButtons = page.locator('button:has-text("Details")');
      if (await detailsButtons.count() > 0) {
        await detailsButtons.first().click();
        await expect(page.locator('text=Client Name')).toBeVisible();
        await expect(page.locator('text=Phone')).toBeVisible();
        await expect(page.locator('text=Email')).toBeVisible();
        await expect(page.locator('text=Requirement')).toBeVisible();
        await expect(page.locator('select[name="status"]')).toBeVisible();
      }
    });

    test('Change status to in_progress shows update toast', async ({ page }) => {
      await page.goto('/admin/inquiries/quotes');
      await page.waitForSelector('button:has-text("Details")', { timeout: 5000 });

      const detailsButtons = page.locator('button:has-text("Details")');
      if (await detailsButtons.count() > 0) {
        await detailsButtons.first().click();
        await page.selectOption('select[name="status"]', 'in_progress');
        await page.click('button:has-text("Update Status")');
        await expect(page.locator('text=Status updated successfully')).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Contact Messages', () => {
    test('Contact messages table renders without 404 errors', async ({ page }) => {
      await page.goto('/admin/inquiries/contacts');
      await expect(page.locator('table')).toBeVisible();
      await expect(page.locator('th:has-text("Name")')).toBeVisible();
      await expect(page.locator('th:has-text("Email")')).toBeVisible();
      await expect(page.locator('th:has-text("Subject")')).toBeVisible();
    });

    test('Open message shows Reply via Email with correct mailto link', async ({ page }) => {
      await page.goto('/admin/inquiries/contacts');
      await page.waitForSelector('button:has-text("View")', { timeout: 5000 });

      const viewButtons = page.locator('button:has-text("View")');
      if (await viewButtons.count() > 0) {
        await viewButtons.first().click();
        const replyLink = page.locator('a[href^="mailto:"]');
        await expect(replyLink).toBeVisible();
        const href = await replyLink.getAttribute('href');
        expect(href).toContain('mailto:');
      }
    });
  });

  test.describe('Job Applications', () => {
    test('Candidates list, position applied, and resume links render', async ({ page }) => {
      await page.goto('/admin/inquiries/applications');
      await expect(page.locator('table')).toBeVisible();
      await expect(page.locator('th:has-text("Candidate")')).toBeVisible();
      await expect(page.locator('th:has-text("Position")')).toBeVisible();
      await expect(page.locator('th:has-text("Resume")')).toBeVisible();
    });
  });

  test.describe('Newsletter Subscribers', () => {
    test('Subscribers list and active status tags render', async ({ page }) => {
      await page.goto('/admin/inquiries/subscribers');
      await expect(page.locator('table')).toBeVisible();
      await expect(page.locator('th:has-text("Email")')).toBeVisible();
      await expect(page.locator('th:has-text("Status")')).toBeVisible();
    });
  });
});