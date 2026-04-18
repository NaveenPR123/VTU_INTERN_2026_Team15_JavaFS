const { test, expect } = require('@playwright/test');
const { loginAs, clickNav, STUDENT } = require('./helpers');

test.describe('Student Portal', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'student', STUDENT.email, STUDENT.password);
  });

  test('Student dashboard loads', async ({ page }) => {
    await expect(page.locator('text=Student Portal')).toBeVisible({ timeout: 5000 });
  });

  test('Nav items visible', async ({ page }) => {
    await expect(page.locator('.nav-item', { hasText: 'My Courses' })).toBeVisible();
    await expect(page.locator('.nav-item', { hasText: 'Attendance' })).toBeVisible();
    await expect(page.locator('.nav-item', { hasText: 'Assignments' })).toBeVisible();
    await expect(page.locator('.nav-item', { hasText: 'My Marks' })).toBeVisible();
  });

  test('Settings page loads for student', async ({ page }) => {
    await clickNav(page, 'Settings');
    await expect(page.locator('text=Personal Information')).toBeVisible({ timeout: 3000 });
  });

  test('Student settings has no System tab', async ({ page }) => {
    await clickNav(page, 'Settings');
    await expect(page.locator('text=System')).not.toBeVisible();
  });

});
