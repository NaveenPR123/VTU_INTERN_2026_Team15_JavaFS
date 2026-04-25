# EduTrack — Project Scope Document

**Project:** EduTrack Academic Management Platform  
**Team:** VTU Internship 2026 — Team 15  
**Date:** April 2026  
**Version:** 1.0

---

## 1. Project Overview

EduTrack is a full-stack web-based academic management platform designed to digitize and streamline academic operations in educational institutions. It connects three types of users — students, teachers, and administrators — through a centralized platform that manages attendance, assignments, marks, course materials, and system settings in real time.

---

## 2. Project Objectives

- Provide a centralized platform for managing academic activities
- Eliminate manual paper-based attendance and marks tracking
- Enable real-time access to academic data for students, teachers, and admins
- Provide secure role-based access for all three user types
- Support OTP-based password recovery for all users
- Allow administrators to control platform-wide settings including maintenance mode and registration

---

## 3. Scope

### 3.1 In Scope

#### Admin Module
- Login and logout
- Add, edit, delete, and search students
- Add, edit, and delete teachers
- Update student and teacher status
- Reset passwords for students and teachers
- Bulk import students and teachers via CSV
- Enable/disable maintenance mode
- Open/close student self-registration
- Set active academic year and semester

#### Teacher Module
- Login and logout
- Create, update, and delete courses
- Mark, view, and update student attendance
- View attendance statistics per student
- Enter, update, and view student marks (auto-graded)
- Create, update, and delete assignments
- View student submissions
- Upload and delete course materials
- Update personal profile

#### Student Module
- Self-registration and login
- View attendance per course with percentage
- View marks and grades per course
- View CGPA
- View and submit assignments
- View and download course materials
- Update personal profile
- Reset password via OTP

#### Security & System
- BCrypt password hashing for all users
- OTP-based password reset via Gmail SMTP
- Role-based access (separate portals per role)
- Maintenance mode to block student/teacher logins
- CORS support for cross-origin API access

#### Testing
- 43 Playwright end-to-end tests
- 31 JUnit unit and controller tests
- 26 Postman API requests

#### Deployment
- Frontend deployed on Vercel
- Backend deployed on Render (Docker)
- Database hosted on Railway (MySQL)

---

### 3.2 Out of Scope

The following features are **not included** in this version:

- Mobile application (Android/iOS)
- Real-time notifications or push alerts
- Video conferencing or live classes
- Fee management or payment processing
- Library management
- Timetable or scheduling system
- Parent portal
- Third-party authentication (Google/Facebook login)
- Advanced analytics or reporting dashboards
- Multi-institution support

---

## 4. Deliverables

| Deliverable | Description |
|---|---|
| Frontend Application | React 19 web app deployed on Vercel |
| Backend REST API | Spring Boot 3 API deployed on Render |
| Database | MySQL schema with 11 tables on Railway |
| Source Code | GitHub repository with full codebase |
| Test Suite | 43 Playwright + 31 JUnit tests |
| Postman Collection | 26 API requests for all endpoints |
| System Design Document | Architecture, DB design, API overview |
| User Stories | 64 user stories across 3 roles |
| WBS | Work breakdown structure with task assignments |
| Project Scope Document | This document |

---

## 5. Assumptions

- Users have a stable internet connection to access the platform
- Gmail SMTP is available for OTP email delivery
- MySQL 8+ is used as the database
- The platform is used by a single institution
- Admin accounts are created manually (no self-registration for admins)
- Department and academic details (year, semester) cannot be changed after registration

---

## 6. Constraints

| Constraint | Details |
|---|---|
| Technology | React, Spring Boot, MySQL only |
| Deployment | Free tier hosting (Render sleeps after 15 min inactivity) |
| Time | 7-week internship timeline |
| Team Size | 9 members |
| Authentication | No JWT — session-less custom auth |

---

## 7. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Backend sleep on free tier | Slow first request after inactivity | Wake up backend before demo |
| Gmail SMTP limits | OTP emails may be delayed | Use Gmail App Password, not main password |
| Database connection loss | App becomes unavailable | Railway MySQL is managed and reliable |
| Scope creep | Delayed delivery | Strict scope defined in this document |

---

## 8. Stakeholders

| Stakeholder | Role |
|---|---|
| VTU Internship Evaluators | Project reviewers |
| Naveen P R | Team Leader & Core Developer |
| Team Members (8) | Developers |
| Students (end users) | Use student portal |
| Teachers (end users) | Use teacher portal |
| Admin (end user) | Use admin portal |

---

## 9. Timeline

| Phase | Duration |
|---|---|
| Planning & Requirements | Week 1 |
| Database Design | Week 1–2 |
| Backend Development | Week 2–4 |
| Frontend Development | Week 3–5 |
| Integration & Bug Fixes | Week 5–6 |
| Testing | Week 6 |
| Deployment | Week 7 |

---

## 10. Success Criteria

- All three portals (Admin, Teacher, Student) are fully functional
- OTP-based password reset works end to end
- All 43 Playwright tests pass
- All 31 JUnit tests pass
- Application is accessible via public URL
- Admin can manage students, teachers, and system settings
- Teachers can mark attendance and enter marks
- Students can view their academic data

---

*EduTrack — VTU Internship 2026, Team 15*
