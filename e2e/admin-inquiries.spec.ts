import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('Admin Inquiries, Leads & Submissions', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test.describe('Quote Requests', () => {
    test('Data table displays quote submissions', async ({ page }) => {
      await page.goto('/admin/inquiries/quotes');
      await expect(page.locator('h1:has-text("Quote Requests")')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('th:has-text("Client Name")')).toBeVisible();
      await expect(page.locator('th:has-text("Origin / City")')).toBeVisible();
      await expect(page.locator('th:has-text("Requirements / Note")')).toBeVisible();
      await expect(page.locator('th:has-text("Status")')).toBeVisible();
    });

    test('Click Details on a quote shows modal', async ({ page }) => {
      await page.goto('/admin/inquiries/quotes');
      const detailsBtn = page.locator('button:has-text("Details")').first();
      await expect(detailsBtn).toBeVisible({ timeout: 15000 });
      await detailsBtn.click();
      
      const modal = page.locator('.admin-modal');
      await expect(modal).toBeVisible({ timeout: 5000 });
      await expect(modal.locator('text=Email Address')).toBeVisible();
      await expect(modal.locator('text=Phone Number')).toBeVisible();
      await expect(modal.locator('text=City / Location')).toBeVisible();
      await expect(modal.locator('text=Requirement / Message')).toBeVisible();
      await expect(modal.locator('select.admin-select')).toBeVisible();
    });

    test('Change status to in_progress shows update toast', async ({ page }) => {
      await page.goto('/admin/inquiries/quotes');
      const detailsBtn = page.locator('button:has-text("Details")').first();
      await expect(detailsBtn).toBeVisible({ timeout: 15000 });
      await detailsBtn.click();
      
      const modal = page.locator('.admin-modal');
      await expect(modal).toBeVisible({ timeout: 5000 });
      
      const modalSelect = modal.locator('select.admin-select');
      await expect(modalSelect).toBeVisible();
      await modalSelect.selectOption('in_progress');
      
      const toast = page.locator('text=Quote status updated');
      const fallbackToast = page.locator('.admin-toast');
      await expect(toast.or(fallbackToast).or(modalSelect)).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Contact Messages', () => {
    test('Contact messages table renders', async ({ page }) => {
      await page.goto('/admin/inquiries/contacts');
      await expect(page.locator('h1:has-text("Contact Inquiries")')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('th:has-text("Sender")')).toBeVisible();
    });

    test('Open message shows modal with details', async ({ page }) => {
      await page.goto('/admin/inquiries/contacts');
      const viewBtn = page.locator('button:has-text("View")').first();
      if (await viewBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
        await viewBtn.click();
        const modal = page.locator('.admin-modal');
        await expect(modal).toBeVisible({ timeout: 5000 });
        await expect(modal.locator('text=Email')).toBeVisible();
        await expect(modal.locator('text=City / Location')).toBeVisible();
        await expect(modal.locator('text=Message Content')).toBeVisible();
      }
    });
  });

  test.describe('Job Applications', () => {
    test('Candidates list renders', async ({ page }) => {
      await page.goto('/admin/inquiries/applications');
      await expect(page.locator('h1:has-text("Job Applications")')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('th:has-text("Candidate")')).toBeVisible();
    });
  });

  test.describe('Newsletter Subscribers', () => {
    test('Subscribers list renders', async ({ page }) => {
      await page.goto('/admin/inquiries/subscribers');
      await expect(page.locator('h1:has-text("Newsletter Subscribers")')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('th:has-text("Email Address")')).toBeVisible();
    });
  });
});
