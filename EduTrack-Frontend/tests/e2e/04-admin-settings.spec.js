const { test, expect } = require('@playwright/test');
const { loginAs, clickNav, ADMIN } = require('./helpers');

test.describe('Admin - Settings & Password', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin', ADMIN.email, ADMIN.password);
    await clickNav(page, 'Settings');
  });

  test('Settings page loads', async ({ page }) => {
    await expect(page.locator('text=Personal Information')).toBeVisible();
  });

  test('System settings tab visible for admin only', async ({ page }) => {
    await expect(page.locator('text=System').first()).toBeVisible();
  });

  test('Change password modal opens from Security tab', async ({ page }) => {
    await page.locator('text=Security').first().click();
    await page.locator('button:has-text("Change Password")').click();
    await expect(page.locator('text=Change Password').last()).toBeVisible();
  });

  test('Change password with wrong current password shows error', async ({ page }) => {
    await page.locator('text=Security').first().click();
    await page.locator('button:has-text("Change Password")').click();
    await page.locator('input').nth(0).fill('wrongpassword');
    await page.locator('input').nth(1).fill('NewPass@123');
    await page.locator('input').nth(2).fill('NewPass@123');
    await page.locator('button:has-text("Update Password")').click();
    await expect(
      page.locator('text=incorrect').or(page.locator('text=Failed'))
    ).toBeVisible({ timeout: 5000 });
  });

  test('Change password modal closes on Cancel', async ({ page }) => {
    await page.locator('text=Security').first().click();
    await page.locator('button:has-text("Change Password")').click();
    // Confirm modal is open
    await expect(page.locator('input[placeholder*="current"], input[placeholder*="Current"]').first()).toBeVisible({ timeout: 3000 });
    await page.locator('button:has-text("Cancel")').click();
    // After cancel, the password inputs should be gone
    await expect(page.locator('input[placeholder*="current"], input[placeholder*="Current"]').first()).not.toBeVisible({ timeout: 3000 });
  });

});
