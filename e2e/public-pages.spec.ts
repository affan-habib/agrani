import { test, expect } from '@playwright/test';

const publicRoutes = [
  { path: '/', name: 'Home Page' },
  { path: '/about', name: 'About Us' },
  { path: '/services', name: 'Services Catalog' },
  { path: '/products', name: 'Products Catalog' },
  { path: '/expertise', name: 'Tech Stack & Capabilities' },
  { path: '/customer-experience', name: 'Testimonials & Reviews' },
  { path: '/case-studies', name: 'Case Studies Grid' },
  { path: '/case-study-details', name: 'Dynamic Content Blocks Reader' },
  { path: '/blog', name: 'Blog Index & Category Filter' },
  { path: '/blog-details', name: 'Blog Post Reader & Social Share' },
  { path: '/career', name: 'Culture & Job Openings' },
  { path: '/contact', name: 'Interactive Map & Office Info' },
  { path: '/why-choose-us', name: 'Value Metrics' },
];

test.describe('Public Marketing Portal Integrity', () => {
  for (const route of publicRoutes) {
    test(`${route.name} (${route.path}) loads successfully`, async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);

      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await expect(page.locator('header')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('footer')).toBeVisible({ timeout: 5000 });

      await expect(page.locator('h1')).toBeVisible({ timeout: 5000 });

      const images = page.locator('img');
      const imageCount = await images.count();
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        await expect(img).toBeVisible({ timeout: 5000 });
      }

      expect(consoleErrors.filter(e => !e.includes('favicon') && !e.includes('manifest'))).toHaveLength(0);
    });
  }
});