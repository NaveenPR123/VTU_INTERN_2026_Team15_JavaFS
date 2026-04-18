const { test, expect, request } = require('@playwright/test');

const API = 'http://localhost:8080';

test.describe('Backend API', () => {

  test('Admin login API returns success', async ({ request }) => {
    const res = await request.post(`${API}/api/auth/login/admin`, {
      data: { email: 'admin@edutrack.com', password: 'naveen' }
    });
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.role).toBe('admin');
  });

  test('Admin login with wrong password returns failure', async ({ request }) => {
    const res = await request.post(`${API}/api/auth/login/admin`, {
      data: { email: 'admin@edutrack.com', password: 'wrongpass' }
    });
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test('OTP forgot-password rejects unknown email', async ({ request }) => {
    const res = await request.post(`${API}/api/otp/forgot-password`, {
      data: { email: 'ghost@nowhere.com', role: 'student' }
    });
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toContain('No account found');
  });

  test('OTP forgot-password rejects wrong role for existing email', async ({ request }) => {
    const res = await request.post(`${API}/api/otp/forgot-password`, {
      data: { email: 'admin@edutrack.com', role: 'teacher' }
    });
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test('GET /api/students returns array', async ({ request }) => {
    const res = await request.get(`${API}/api/students`);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('GET /api/teachers returns array', async ({ request }) => {
    const res = await request.get(`${API}/api/teachers`);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('Change admin password with wrong current password fails', async ({ request }) => {
    // First get admin ID
    const loginRes = await request.post(`${API}/api/auth/login/admin`, {
      data: { email: 'admin@edutrack.com', password: 'naveen' }
    });
    const { adminId } = await loginRes.json();

    const res = await request.post(`${API}/api/auth/change-password/admin`, {
      data: { id: adminId, currentPassword: 'wrongpass', newPassword: 'NewPass@123' }
    });
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toContain('incorrect');
  });

  test('OTP verify rejects invalid OTP', async ({ request }) => {
    const res = await request.post(`${API}/api/otp/verify`, {
      data: { email: 'admin@edutrack.com', otp: '000000' }
    });
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test('System settings endpoint returns data', async ({ request }) => {
    const res = await request.get(`${API}/api/system/settings`);
    const body = await res.json();
    expect(body).toHaveProperty('activeYear');
    expect(body).toHaveProperty('maintenanceMode');
  });

});
