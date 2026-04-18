const { test, expect } = require('@playwright/test');
const { loginAs, clickNav, ADMIN } = require('./helpers');

test.describe('Admin - Teacher Management', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin', ADMIN.email, ADMIN.password);
    await clickNav(page, 'Teachers');
  });

  test('Teachers page loads', async ({ page }) => {
    await expect(page.locator('text=Teacher Management')).toBeVisible();
  });

  test('Edit teacher modal opens', async ({ page }) => {
    await page.locator('button:has-text("Edit")').first().click();
    await expect(page.locator('text=Edit Teacher')).toBeVisible();
  });

  test('Edit teacher - department is read-only', async ({ page }) => {
    await page.locator('button:has-text("Edit")').first().click();
    await expect(page.locator('text=Edit Teacher')).toBeVisible();
    const selects = page.locator('select');
    await expect(selects).toHaveCount(0);
  });

  test('Edit teacher - email is read-only', async ({ page }) => {
    await page.locator('button:has-text("Edit")').first().click();
    await expect(page.locator('text=Edit Teacher')).toBeVisible();
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveCount(0);
  });

  test('Edit teacher modal closes on Cancel', async ({ page }) => {
    await page.locator('button:has-text("Edit")').first().click();
    await page.locator('button:has-text("Cancel")').click();
    await expect(page.locator('text=Edit Teacher')).not.toBeVisible({ timeout: 3000 });
  });

});
