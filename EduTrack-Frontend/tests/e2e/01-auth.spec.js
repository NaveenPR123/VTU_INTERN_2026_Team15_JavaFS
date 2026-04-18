const { test, expect } = require('@playwright/test');
const { BASE, goToLogin, selectRole, loginAs, ADMIN } = require('./helpers');

test.describe('Authentication', () => {

  test('Landing page loads', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('text=EduTrack').first()).toBeVisible({ timeout: 8000 });
    await expect(page.locator('text=Sign In').first()).toBeVisible();
  });

  test('Login page shows 3 role buttons', async ({ page }) => {
    await goToLogin(page);
    await expect(page.locator('.role-btn')).toHaveCount(3);
  });

  test('Switching roles clears email field', async ({ page }) => {
    await goToLogin(page);
    await page.locator('input[type="email"]').fill('test@example.com');
    await selectRole(page, 'Teacher');
    const val = await page.locator('input[type="email"]').inputValue();
    expect(val).toBe('');
  });

  test('Admin login success', async ({ page }) => {
    await loginAs(page, 'admin', ADMIN.email, ADMIN.password);
    await expect(page.locator('text=Admin Portal')).toBeVisible({ timeout: 5000 });
  });

  test('Admin login with wrong password shows error', async ({ page }) => {
    await goToLogin(page);
    await selectRole(page, 'Admin');
    await page.locator('input[type="email"]').fill(ADMIN.email);
    await page.locator('input[type="password"]').first().fill('wrongpassword');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=Invalid email or password')).toBeVisible({ timeout: 5000 });
  });

  test('Login with empty fields shows error', async ({ page }) => {
    await goToLogin(page);
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=Please fill in all fields')).toBeVisible({ timeout: 3000 });
  });

  test('Admin logout returns to landing', async ({ page }) => {
    await loginAs(page, 'admin', ADMIN.email, ADMIN.password);
    await page.locator('button:has-text("Logout")').click();
    await expect(page.locator('text=Sign In').first()).toBeVisible({ timeout: 5000 });
  });

});
