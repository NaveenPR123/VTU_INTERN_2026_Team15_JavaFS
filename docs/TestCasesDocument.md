# EduTrack — Test Cases Document

**Project:** EduTrack Academic Management Platform  
**Team:** VTU Internship 2026 — Team 15  
**Date:** April 2026

---

## Testing Overview

| Test Type | Tool | Total Tests |
|---|---|---|
| Unit Tests (Service Layer) | JUnit 5 + Mockito | 22 tests |
| Controller Tests (API Layer) | Spring MockMvc | 8 tests |
| End-to-End Tests (Browser) | Playwright | 43 tests |
| API Tests | Postman | 26 requests |
| **Total** | | **99 tests** |

---

## Part 1 — JUnit Unit Tests (AuthServiceTest)

### Module: Student Login

| TC ID | Test Case | Input | Expected Output | Status |
|---|---|---|---|---|
| TC-SL-01 | Valid student login | email: student@test.com, password: Test@123 | success: true, role: student | Pass |
| TC-SL-02 | Wrong password | email: student@test.com, password: wrongpass | success: false, message: "Invalid email or password" | Pass |
| TC-SL-03 | Email not found | email: nobody@test.com, password: Test@123 | success: false | Pass |

---

### Module: Teacher Login

| TC ID | Test Case | Input | Expected Output | Status |
|---|---|---|---|---|
| TC-TL-01 | Valid teacher login | email: teacher@test.com, password: Test@123 | success: true, role: teacher | Pass |
| TC-TL-02 | Wrong password | email: teacher@test.com, password: wrongpass | success: false | Pass |

---

### Module: Admin Login

| TC ID | Test Case | Input | Expected Output | Status |
|---|---|---|---|---|
| TC-AL-01 | Valid admin login | email: admin@edutrack.com, password: Admin@123 | success: true, role: admin | Pass |
| TC-AL-02 | Wrong password | email: admin@edutrack.com, password: wrongpass | success: false, message: "Invalid email or password" | Pass |
| TC-AL-03 | Email not found | email: ghost@test.com, password: Admin@123 | success: false | Pass |

---

### Module: Change Password

| TC ID | Test Case | Input | Expected Output | Status |
|---|---|---|---|---|
| TC-CP-01 | Admin correct current password | adminId: 1, current: Admin@123, new: NewPass@123 | success: true, message: "Password changed successfully" | Pass |
| TC-CP-02 | Admin wrong current password | adminId: 1, current: wrongpass, new: NewPass@123 | success: false, message: "Current password is incorrect" | Pass |
| TC-CP-03 | Admin not found | adminId: 99, current: Admin@123, new: NewPass@123 | success: false, message: "Admin not found" | Pass |
| TC-CP-04 | Student correct current password | studentId: 1, current: Test@123, new: NewPass@123 | success: true | Pass |
| TC-CP-05 | Student wrong current password | studentId: 1, current: wrongpass, new: NewPass@123 | success: false, message: "Current password is incorrect" | Pass |

---

### Module: Student Registration

| TC ID | Test Case | Input | Expected Output | Status |
|---|---|---|---|---|
| TC-SR-01 | New email registration | email: new@test.com | success: true | Pass |
| TC-SR-02 | Duplicate email | email: student@test.com (already exists) | success: false, message: "Email already registered" | Pass |

---

## Part 2 — JUnit Unit Tests (OtpServiceTest)

### Module: OTP Validation

| TC ID | Test Case | Input | Expected Output | Status |
|---|---|---|---|---|
| TC-OTP-01 | Valid OTP within expiry | email: test@test.com, otp: 123456, expiry: +5 min | true | Pass |
| TC-OTP-02 | Wrong OTP | email: test@test.com, otp: 999999 | false | Pass |
| TC-OTP-03 | Expired OTP | email: test@test.com, otp: 123456, expiry: -15 min | false | Pass |
| TC-OTP-04 | Already used OTP | email: test@test.com, otp: 123456, used: true | false | Pass |
| TC-OTP-05 | No OTP record found | email: ghost@test.com | false | Pass |
| TC-OTP-06 | OTP marked as used after success | email: test@test.com, otp: 123456 | used = true, save() called once | Pass |

---

### Module: OTP Generation

| TC ID | Test Case | Input | Expected Output | Status |
|---|---|---|---|---|
| TC-OTP-07 | OTP saved to repository | email: test@test.com | otpRepo.save() called once | Pass |
| TC-OTP-08 | Old OTP deleted before new one | email: test@test.com | otpRepo.deleteByEmail() called once | Pass |

---

## Part 3 — Controller Tests (AuthControllerTest)

### Module: Admin Login API

| TC ID | Test Case | Endpoint | Input | Expected HTTP | Expected Response | Status |
|---|---|---|---|---|---|---|
| TC-API-01 | Valid admin login | POST /api/auth/login/admin | email: admin@edutrack.com, password: Admin@123 | 200 OK | success: true, role: admin | Pass |
| TC-API-02 | Wrong admin password | POST /api/auth/login/admin | email: admin@edutrack.com, password: wrongpass | 200 OK | success: false, message: "Invalid email or password" | Pass |

---

### Module: Student Login API

| TC ID | Test Case | Endpoint | Input | Expected HTTP | Expected Response | Status |
|---|---|---|---|---|---|---|
| TC-API-03 | Valid student login | POST /api/auth/login/student | email: student@test.com, password: Test@123 | 200 OK | success: true, role: student | Pass |
| TC-API-04 | Wrong student password | POST /api/auth/login/student | email: student@test.com, password: wrongpass | 200 OK | success: false | Pass |

---

### Module: Teacher Login API

| TC ID | Test Case | Endpoint | Input | Expected HTTP | Expected Response | Status |
|---|---|---|---|---|---|---|
| TC-API-05 | Valid teacher login | POST /api/auth/login/teacher | email: teacher@test.com, password: Test@123 | 200 OK | success: true, role: teacher | Pass |

---

### Module: Change Password API

| TC ID | Test Case | Endpoint | Input | Expected HTTP | Expected Response | Status |
|---|---|---|---|---|---|---|
| TC-API-06 | Correct current password | POST /api/auth/change-password/admin | id: 1, current: Admin@123, new: NewPass@123 | 200 OK | success: true | Pass |
| TC-API-07 | Missing required fields | POST /api/auth/change-password/admin | id: 1 only | 200 OK | success: false | Pass |

---

## Part 4 — Playwright E2E Tests

### Module: Authentication

| TC ID | Test Case | Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-E2E-01 | Landing page loads | Open app URL | EduTrack text visible | Pass |
| TC-E2E-02 | Login page shows 3 role buttons | Navigate to login | Student, Teacher, Admin buttons visible | Pass |
| TC-E2E-03 | Switching roles clears email | Type email, switch role | Email field cleared | Pass |
| TC-E2E-04 | Admin login success | Enter valid admin credentials | Admin Portal visible | Pass |
| TC-E2E-05 | Wrong password shows error | Enter wrong password | "Invalid email or password" shown | Pass |
| TC-E2E-06 | Empty fields shows error | Click login without filling | "Please fill in all fields" shown | Pass |
| TC-E2E-07 | Admin logout | Click Logout | Redirected to landing page | Pass |

---

### Module: Admin Student Management

| TC ID | Test Case | Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-E2E-08 | Students page loads | Login as admin, click Students | Student Management visible | Pass |
| TC-E2E-09 | Search filters students | Type "naveen" in search | Matching students shown | Pass |
| TC-E2E-10 | Edit student modal opens | Click Edit on a student | Edit Student modal visible | Pass |
| TC-E2E-11 | Email is read-only | Open edit modal | No email input field | Pass |
| TC-E2E-12 | No department/year/semester dropdowns | Open edit modal | No select dropdowns | Pass |
| TC-E2E-13 | Cancel closes modal | Click Cancel | Modal disappears | Pass |

---

### Module: Admin Teacher Management

| TC ID | Test Case | Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-E2E-14 | Teachers page loads | Login as admin, click Teachers | Teacher Management visible | Pass |
| TC-E2E-15 | Edit teacher modal opens | Click Edit on a teacher | Edit Teacher modal visible | Pass |
| TC-E2E-16 | Department is read-only | Open edit modal | No department dropdown | Pass |
| TC-E2E-17 | Email is read-only | Open edit modal | No email input | Pass |
| TC-E2E-18 | Cancel closes modal | Click Cancel | Modal disappears | Pass |

---

### Module: Admin Settings

| TC ID | Test Case | Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-E2E-19 | Settings page loads | Login as admin, click Settings | Personal Information visible | Pass |
| TC-E2E-20 | System tab visible for admin | Open settings | System tab visible | Pass |
| TC-E2E-21 | Change password modal opens | Click Security, then Change Password | Modal visible | Pass |
| TC-E2E-22 | Wrong current password shows error | Enter wrong current password | Error message shown | Pass |
| TC-E2E-23 | Cancel closes modal | Click Cancel | Password inputs gone | Pass |

---

### Module: Forgot Password

| TC ID | Test Case | Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-E2E-24 | Forgot password page loads | Click Forgot password? | 3 role options visible | Pass |
| TC-E2E-25 | Shows 3 role options | Open forgot password | 3 role buttons visible | Pass |
| TC-E2E-26 | Switching role clears email | Type email, switch role | Email cleared | Pass |
| TC-E2E-27 | Non-existent email shows error | Enter ghost@nowhere.com | "No account found" shown | Pass |
| TC-E2E-28 | Wrong role for email shows error | Admin email as Teacher role | "No account found" shown | Pass |
| TC-E2E-29 | Empty email shows error | Click Send OTP without email | "Please enter your email" shown | Pass |
| TC-E2E-30 | Back to login works | Click Sign in | Login page shown | Pass |

---

### Module: Student Portal

| TC ID | Test Case | Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-E2E-31 | Student dashboard loads | Login as student | Student Portal visible | Pass |
| TC-E2E-32 | Nav items visible | Login as student | My Courses, Attendance, Assignments, My Marks visible | Pass |
| TC-E2E-33 | Settings page loads | Click Settings | Personal Information visible | Pass |
| TC-E2E-34 | No System tab for student | Open settings | System tab not visible | Pass |

---

### Module: Backend API (Direct)

| TC ID | Test Case | Endpoint | Expected Response | Status |
|---|---|---|---|---|
| TC-API-08 | Admin login returns success | POST /api/auth/login/admin | success: true, role: admin | Pass |
| TC-API-09 | Wrong password returns failure | POST /api/auth/login/admin | success: false | Pass |
| TC-API-10 | OTP rejects unknown email | POST /api/otp/forgot-password | success: false, "No account found" | Pass |
| TC-API-11 | OTP rejects wrong role | POST /api/otp/forgot-password | success: false | Pass |
| TC-API-12 | GET students returns array | GET /api/students | Array of students | Pass |
| TC-API-13 | GET teachers returns array | GET /api/teachers | Array of teachers | Pass |
| TC-API-14 | Wrong current password fails | POST /api/auth/change-password/admin | success: false, "incorrect" | Pass |
| TC-API-15 | Invalid OTP rejected | POST /api/otp/verify | success: false | Pass |
| TC-API-16 | System settings returns data | GET /api/system/settings | activeYear, maintenanceMode present | Pass |

---

## Test Summary

| Module | JUnit | Playwright | Total |
|---|---|---|---|
| Student Login | 3 | 0 | 3 |
| Teacher Login | 2 | 0 | 2 |
| Admin Login | 3 | 2 | 5 |
| Change Password | 5 | 2 | 7 |
| Registration | 2 | 0 | 2 |
| OTP Validation | 8 | 4 | 12 |
| Admin Student Mgmt | 0 | 6 | 6 |
| Admin Teacher Mgmt | 0 | 5 | 5 |
| Admin Settings | 0 | 5 | 5 |
| Student Portal | 0 | 4 | 4 |
| Backend API | 8 | 9 | 17 |
| **Total** | **31** | **43** | **74** |

---

*EduTrack — VTU Internship 2026, Team 15*
