const BASE = 'http://localhost:3000';
const API  = 'http://localhost:8080';

const ADMIN   = { email: 'admin@edutrack.com', password: 'naveen' };
const STUDENT = { email: 'naveenpr719@gmail.com', password: 'naveen' };
const TEACHER = { email: 'alan@example.com',      password: 'Test@123' };

async function goToLogin(page) {
  await page.goto(BASE);
  // Wait for landing page, then click Sign In
  await page.locator('text=Sign In').first().waitFor({ timeout: 8000 });
  await page.locator('text=Sign In').first().click();
  // Wait for role buttons to appear
  await page.locator('.role-btn').first().waitFor({ timeout: 8000 });
}

async function selectRole(page, role) {
  await page.locator('.role-btn', { hasText: role }).click();
}

async function loginAs(page, role, email, password) {
  await goToLogin(page);
  await selectRole(page, role.charAt(0).toUpperCase() + role.slice(1));
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').first().fill(password);
  await page.locator('button[type="submit"]').click();
  // Wait for dashboard nav to appear
  await page.locator('.nav-item').first().waitFor({ timeout: 10000 });
}

async function clickNav(page, label) {
  await page.locator('.nav-item', { hasText: label }).first().click();
  await page.waitForTimeout(600);
}

module.exports = { BASE, API, ADMIN, STUDENT, TEACHER, goToLogin, selectRole, loginAs, clickNav };
