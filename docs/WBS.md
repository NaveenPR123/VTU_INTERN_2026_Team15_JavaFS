# EduTrack — Work Breakdown Structure (WBS)

**Project:** EduTrack Academic Management Platform  
**Team:** VTU Internship 2026 — Team 15  
**Date:** April 2026

---

## Team Members

| # | Name | Role |
|---|---|---|
| 1 | Naveen P R | Team Leader & Core Developer |
| 2 | Rashmi S P | Developer |
| 3 | Sneha H S | Developer |
| 4 | Soujanya M | Developer |
| 5 | Deepa G R | Developer |
| 6 | Kavana N | Developer |
| 7 | Vanashree R | Developer |
| 8 | Deeksha D R | Developer |
| 9 | Saud Shaik | Developer |

---

## Phase 1 — Project Planning & Requirements

| Task | Owner |
|---|---|
| Project scope definition and requirement gathering | Naveen P R |
| Technology stack selection (React, Spring Boot, MySQL) | Naveen P R |
| System architecture design | Naveen P R |
| Database schema design | Rashmi S P |
| Task allocation to team members | Naveen P R |

---

## Phase 2 — Database Design & Setup

| Task | Owner |
|---|---|
| ER diagram design | Rashmi S P |
| MySQL schema creation (all 10 tables) | Sneha H S |
| Foreign key relationships and constraints | Rashmi S P |

---

## Phase 3 — Backend Development

| Task | Owner |
|---|---|
| Spring Boot project setup and configuration | Naveen P R |
| Entity classes (Student, Teacher, Admin, Course, etc.) | Rashmi S P |
| Repository layer (JPA repositories) | Sneha H S |
| AuthService — login, register, change password | Naveen P R |
| OtpService — generate, send, validate OTP | Naveen P R |
| EmailService — Gmail SMTP integration | Naveen P R |
| AuthController — login/register endpoints | Naveen P R |
| Student entity and repository design | Rashmi S P |
| Teacher entity and repository design | Rashmi S P |
| StudentController — CRUD endpoints | Sneha H S |
| TeacherController — CRUD endpoints | Soujanya M |
| CourseController — CRUD endpoints | Deepa G R |
| AttendanceController — mark and fetch attendance | Soujanya M |
| MarksController — enter and fetch marks | Kavana N |
| AssignmentController — CRUD endpoints | Vanashree R |
| SubmissionController — submission endpoints | Deeksha D R |
| CourseMaterialController — upload/fetch materials | Saud Shaik |
| OtpController — forgot password flow | Naveen P R |
| PasswordResetController — reset endpoints | Naveen P R |
| SystemSettingsController — maintenance mode | Naveen P R |
| BulkImportController — CSV upload | Soujanya M |
| Marks entity and repository design | Sneha H S |
| Attendance entity and repository design | Sneha H S |
| SecurityConfig — CORS and Spring Security | Naveen P R |
| AdminSeeder — default admin auto-creation | Naveen P R |

---

## Phase 4 — Frontend Development

| Task | Owner |
|---|---|
| React project setup and folder structure | Naveen P R |
| Theme system (dark/light mode) | Naveen P R |
| Landing Page | Kavana N |
| Login Page (role selector, validation) | Naveen P R |
| Signup Page | Vanashree R |
| Forgot Password (3-step OTP flow) | Naveen P R |
| Admin Dashboard | Naveen P R |
| Admin — Student Management (CRUD) | Rashmi S P |
| Admin — Bulk CSV import UI | Rashmi S P |
| Admin — Teacher Management (CRUD) | Sneha H S |
| Student profile settings page | Sneha H S |
| Admin — Course Management | Deepa G R |
| Admin — System Settings | Naveen P R |
| Student Dashboard | Naveen P R |
| Student — Attendance view | Soujanya M |
| Student — Marks and CGPA view | Kavana N |
| Student — Assignments view | Vanashree R |
| Student — Course Materials | Deeksha D R |
| Teacher Dashboard | Naveen P R |
| Teacher — Mark Attendance | Soujanya M |
| Teacher — Enter Marks | Rashmi S P |
| Teacher — Manage Assignments | Vanashree R |
| Teacher — Upload Materials | Saud Shaik |
| Settings Page (profile, password, system) | Naveen P R |
| Bulk Import (CSV upload UI) | Soujanya M |

---

## Phase 5 — Integration & Bug Fixes

| Task | Owner |
|---|---|
| Frontend-backend API integration | Naveen P R |
| CORS configuration for production | Naveen P R |
| Bug fix — change password endpoint (admin) | Naveen P R |
| Bug fix — role switching clears fields | Naveen P R |
| Bug fix — OTP role validation | Naveen P R |
| Bug fix — edit modal read-only fields | Rashmi S P |
| API response validation and error handling | Rashmi S P |
| Bug fix — profile name update in sidebar | Sneha H S |
| Frontend form validation improvements | Sneha H S |
| Bug fix — input focus loss in forgot password | Naveen P R |
| Bug fix — admin edit student/teacher | Soujanya M |

---

## Phase 6 — Testing

| Task | Owner |
|---|---|
| JUnit unit tests — AuthService | Naveen P R |
| JUnit unit tests — OtpService | Naveen P R |
| JUnit controller tests — AuthController | Naveen P R |
| Playwright E2E — Authentication tests | Naveen P R |
| Playwright E2E — Admin student management | Naveen P R |
| Playwright E2E — Admin teacher management | Naveen P R |
| Playwright E2E — Settings and password | Naveen P R |
| Playwright E2E — Forgot password flow | Naveen P R |
| Playwright E2E — Student portal | Naveen P R |
| Playwright E2E — Backend API tests | Naveen P R |
| Postman collection (26 requests) | Naveen P R |

---

## Phase 7 — Deployment

| Task | Owner |
|---|---|
| Dockerfile creation for Spring Boot | Naveen P R |
| Backend deployment on Render | Naveen P R |
| Database deployment on Railway (MySQL) | Naveen P R |
| Frontend deployment on Vercel | Naveen P R |
| Environment variables configuration | Naveen P R |
| Production CORS fix | Naveen P R |
| GitHub repository setup and push | Naveen P R |

---

*EduTrack — VTU Internship 2026, Team 15*
