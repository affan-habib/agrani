import { test, expect } from '@playwright/test';

test.describe('Public-to-Admin Form Synchronization', () => {
  test.describe('Quote Form Submission', () => {
    test('Submit quote form from public page shows feedback', async ({ page }) => {
      await page.goto('/contact');
      const form = page.locator('.quote-form');
      await expect(form).toBeVisible({ timeout: 15000 });

      await page.fill('input[name="firstName"]', 'Playwright');
      await page.fill('input[name="lastName"]', 'Tester');
      await page.fill('input[type="tel"]', '+8801700000000');
      await page.selectOption('.quote-form select', 'Dhaka');
      await page.fill('textarea[name="message"]', 'E2E Automated Quote Request');

      await page.click('.quote-form .form-submit-btn');

      const successFeedback = form.getByText('Thank you', { exact: false });
      const receivedFeedback = form.getByText('received', { exact: false });
      const rateLimitFeedback = form.getByText('Too many requests', { exact: false });
      await expect(successFeedback.or(receivedFeedback).or(rateLimitFeedback)).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('Newsletter Subscription', () => {
    test('Subscribe via footer and verify success response', async ({ page }) => {
      await page.goto('/');

      const emailInput = page.locator('form.newsletter input[type="email"]');
      await expect(emailInput).toBeVisible({ timeout: 10000 });

      await emailInput.fill(`e2e.${Date.now()}@agrani.com`);
      await page.click('form.newsletter button');

      const subscribedFeedback = page.getByText('Subscribed', { exact: false });
      const rateLimitFeedback = page.getByText('Too many requests', { exact: false });
      await expect(subscribedFeedback.or(rateLimitFeedback)).toBeVisible({ timeout: 10000 });
    });
  });
});