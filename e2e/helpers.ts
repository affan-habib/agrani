import { Page, expect } from '@playwright/test';

const TOKEN_KEY = 'agrani_admin_token';
let sharedToken: string | null = null;

export async function getAdminToken(page: Page): Promise<string> {
  if (sharedToken) return sharedToken;

  for (let i = 0; i < 6; i++) {
    try {
      const res = await page.request.post('http://192.168.30.27:8000/api/v1/admin/auth/login', {
        data: {
          email: 'superadmin1@example.com',
          password: 'Password@123',
        },
      });

      if (res.ok()) {
        const body = await res.json();
        const token =
          body?.data?.token ||
          body?.data?.access_token ||
          body?.token ||
          body?.access_token;
        if (token) {
          sharedToken = token;
          return token;
        }
      }
    } catch {
      // Retry after delay
    }
    await new Promise((r) => setTimeout(r, 2000));
  }

  // Fallback fallback token if already generated
  if (sharedToken) return sharedToken;
  throw new Error('Could not obtain admin authentication token');
}

export async function loginAsAdmin(page: Page) {
  const token = await getAdminToken(page);

  // Set cookie for Next.js middleware and SSR
  await page.context().addCookies([
    {
      name: TOKEN_KEY,
      value: token,
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
  ]);

  // Inject token into localStorage before loading pages
  await page.addInitScript(
    ({ key, val }) => {
      window.localStorage.setItem(key, val);
    },
    { key: TOKEN_KEY, val: token }
  );

  // Navigate to admin
  await page.goto('/admin', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.admin-root')).toBeVisible({ timeout: 10000 });
}
