const { test, expect } = require('@playwright/test');
const { loginAs, clickNav, ADMIN } = require('./helpers');

test.describe('Admin - Student Management', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin', ADMIN.email, ADMIN.password);
    await clickNav(page, 'Students');
  });

  test('Students page loads with list', async ({ page }) => {
    await expect(page.locator('text=Student Management')).toBeVisible();
  });

  test('Search filters students', async ({ page }) => {
    await page.locator('input[placeholder*="Search"]').fill('naveen');
    await page.waitForTimeout(400);
    await expect(page.locator('text=naveen').first()).toBeVisible();
  });

  test('Edit student modal opens', async ({ page }) => {
    await page.locator('button:has-text("Edit")').first().click();
    await expect(page.locator('text=Edit Student')).toBeVisible();
  });

  test('Edit student - email is read-only div not input', async ({ page }) => {
    await page.locator('button:has-text("Edit")').first().click();
    await expect(page.locator('text=Edit Student')).toBeVisible();
    // Email should be a div (read-only), not an editable input
    const emailInputs = page.locator('input[type="email"]');
    await expect(emailInputs).toHaveCount(0);
  });

  test('Edit student - no department/year/semester dropdowns', async ({ page }) => {
    await page.locator('button:has-text("Edit")').first().click();
    await expect(page.locator('text=Edit Student')).toBeVisible();
    const selects = page.locator('select');
    await expect(selects).toHaveCount(0);
  });

  test('Edit student modal closes on Cancel', async ({ page }) => {
    await page.locator('button:has-text("Edit")').first().click();
    await page.locator('button:has-text("Cancel")').click();
    await expect(page.locator('text=Edit Student')).not.toBeVisible({ timeout: 3000 });
  });

});
