const { test, expect } = require('@playwright/test');
const { goToLogin } = require('./helpers');

async function goToForgotPassword(page) {
  await goToLogin(page);
  await page.locator('text=Forgot password?').click();
  await page.locator('.fp-role').first().waitFor({ timeout: 5000 });
}

test.describe('Forgot Password', () => {

  test('Forgot password page loads with Enter Email step', async ({ page }) => {
    await goToForgotPassword(page);
    await expect(page.locator('.fp-role').first()).toBeVisible();
    await expect(page.locator('text=Send OTP')).toBeVisible();
  });

  test('Shows 3 role options', async ({ page }) => {
    await goToForgotPassword(page);
    await expect(page.locator('.fp-role')).toHaveCount(3);
  });

  test('Switching role clears email', async ({ page }) => {
    await goToForgotPassword(page);
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('.fp-role').nth(1).click(); // Teacher
    const val = await page.locator('input[type="email"]').inputValue();
    expect(val).toBe('');
  });

  test('Non-existent email shows error', async ({ page }) => {
    await goToForgotPassword(page);
    await page.locator('input[type="email"]').fill('ghost@nowhere.com');
    await page.locator('button:has-text("Send OTP")').click();
    await expect(page.locator('text=No account found')).toBeVisible({ timeout: 5000 });
  });

  test('Admin email tried as Teacher role shows error', async ({ page }) => {
    await goToForgotPassword(page);
    await page.locator('.fp-role').nth(1).click(); // Teacher
    await page.locator('input[type="email"]').fill('admin@edutrack.com');
    await page.locator('button:has-text("Send OTP")').click();
    await expect(page.locator('text=No account found')).toBeVisible({ timeout: 5000 });
  });

  test('Empty email shows validation error', async ({ page }) => {
    await goToForgotPassword(page);
    await page.locator('button:has-text("Send OTP")').click();
    await expect(page.locator('text=Please enter your email')).toBeVisible({ timeout: 3000 });
  });

  test('Back to login link works', async ({ page }) => {
    await goToForgotPassword(page);
    await page.locator('text=Sign in').click();
    await expect(page.locator('.role-btn').first()).toBeVisible({ timeout: 5000 });
  });

});
