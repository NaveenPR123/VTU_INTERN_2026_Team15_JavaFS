# EduTrack — System Design Document

**Version:** 1.0  
**Team:** VTU Internship 2026 — Team 15  
**Date:** April 2026

---

## 1. Overview

EduTrack is a full-stack academic management platform connecting students, teachers, and administrators. It provides real-time management of attendance, assignments, marks, course materials, and system settings through a role-based web application.

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                        CLIENT                            │
│               React 19 (Vercel CDN)                      │
│  https://vtu-intern-2026-team15-java-fs.vercel.app       │
└──────────────────────┬───────────────────────────────────┘
                       │ HTTPS REST API calls
┌──────────────────────▼───────────────────────────────────┐
│                      BACKEND                             │
│           Spring Boot 3 (Render - Docker)                │
│       https://edutrack-backend-o1ym.onrender.com         │
└──────────────────────┬───────────────────────────────────┘
                       │ JDBC (MySQL Connector)
┌──────────────────────▼───────────────────────────────────┐
│                     DATABASE                             │
│              MySQL 9.4 (Railway Cloud)                   │
│           hopper.proxy.rlwy.net:12491                    │
└──────────────────────────────────────────────────────────┘
```

### 2.2 Deployment

| Layer | Technology | Platform |
|---|---|---|
| Frontend | React 19 | Vercel |
| Backend | Spring Boot 3 / Docker | Render |
| Database | MySQL 9.4 | Railway |

---

## 3. Technology Stack

### Frontend
| Component | Technology |
|---|---|
| Framework | React 19 |
| Routing | Hash-based (window.history) |
| HTTP Client | Fetch API |
| Testing | Playwright E2E — 43 tests |
| Build | Create React App |

### Backend
| Component | Technology |
|---|---|
| Framework | Spring Boot 3.2.3 |
| Language | Java 21 |
| ORM | Spring Data JPA / Hibernate |
| Security | Spring Security + BCrypt |
| Email | Spring Mail (Gmail SMTP) |
| Build | Maven + Docker |
| Testing | JUnit 5 + Mockito — 31 tests |

### Database
| Component | Technology |
|---|---|
| RDBMS | MySQL 9.4 |
| Hosting | Railway Cloud |

---

## 4. Database Design

### Tables

#### admins
| Column | Type | Notes |
|---|---|---|
| admin_id | INT PK | Auto increment |
| name | VARCHAR(100) | Not null |
| email | VARCHAR(100) | Unique |
| password | VARCHAR(255) | BCrypt hashed |

#### teachers
| Column | Type | Notes |
|---|---|---|
| teacher_id | INT PK | Auto increment |
| name | VARCHAR(100) | Not null |
| email | VARCHAR(100) | Unique |
| password | VARCHAR(255) | BCrypt hashed |
| phone | VARCHAR(15) | |
| department | VARCHAR(100) | Not null |
| employee_id | VARCHAR(50) | Unique |
| status | VARCHAR(20) | Default: Active |

#### students
| Column | Type | Notes |
|---|---|---|
| student_id | INT PK | Auto increment |
| name | VARCHAR(100) | Not null |
| email | VARCHAR(100) | Unique |
| password | VARCHAR(255) | BCrypt hashed |
| phone | VARCHAR(15) | |
| usn | VARCHAR(50) | Unique |
| department | VARCHAR(100) | Not null |
| year | VARCHAR(20) | Not null |
| semester | VARCHAR(20) | |
| status | VARCHAR(20) | Default: Active |
| course_id | INT FK | → courses |

#### courses
| Column | Type | Notes |
|---|---|---|
| course_id | INT PK | Auto increment |
| course_name | VARCHAR(150) | Not null |
| credits | INT | Default: 3 |
| teacher_id | INT FK | → teachers (CASCADE) |

#### attendance
| Column | Type | Notes |
|---|---|---|
| attendance_id | INT PK | Auto increment |
| student_id | INT FK | → students (CASCADE) |
| course_id | INT FK | → courses (CASCADE) |
| attendance_date | DATE | Not null |
| status | VARCHAR(10) | Present / Absent |

#### assignments
| Column | Type | Notes |
|---|---|---|
| assignment_id | INT PK | Auto increment |
| course_id | INT FK | → courses (CASCADE) |
| title | VARCHAR(200) | Not null |
| description | TEXT | |
| due_date | DATE | Not null |

#### submissions
| Column | Type | Notes |
|---|---|---|
| submission_id | INT PK | Auto increment |
| assignment_id | INT FK | → assignments (CASCADE) |
| student_id | INT FK | → students (CASCADE) |
| submitted_at | DATETIME | Not null |
| file_url | VARCHAR(500) | |
| status | VARCHAR(20) | Default: Submitted |
| grade | VARCHAR(10) | |
| feedback | TEXT | |

#### marks
| Column | Type | Notes |
|---|---|---|
| mark_id | INT PK | Auto increment |
| student_id | INT FK | → students (CASCADE) |
| course_id | INT FK | → courses (CASCADE) |
| marks | INT | Default: 0 |
| grade | VARCHAR(5) | Auto-calculated |

#### course_materials
| Column | Type | Notes |
|---|---|---|
| material_id | INT PK | Auto increment |
| course_id | INT FK | → courses (CASCADE) |
| title | VARCHAR(200) | Not null |
| material_url | VARCHAR(500) | Not null |
| uploaded_at | DATETIME | Not null |

#### otp_verification
| Column | Type | Notes |
|---|---|---|
| id | BIGINT PK | Auto increment |
| email | VARCHAR(100) | Not null |
| otp | VARCHAR(6) | 6-digit code |
| expiry_time | DATETIME | 10 min from creation |
| used | BOOLEAN | Default: false |

#### system_settings
| Column | Type | Notes |
|---|---|---|
| id | INT PK | Fixed: 1 |
| active_year | VARCHAR(20) | e.g. 2025-26 |
| active_semester | VARCHAR(20) | e.g. Even |
| maintenance_mode | BOOLEAN | Default: false |
| registration_open | BOOLEAN | Default: true |

---

## 5. API Design

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/login/admin | Admin login |
| POST | /api/auth/login/student | Student login |
| POST | /api/auth/login/teacher | Teacher login |
| POST | /api/auth/register/student | Student registration |
| POST | /api/auth/admin/add-student | Admin adds student |
| POST | /api/auth/admin/add-teacher | Admin adds teacher |
| POST | /api/auth/change-password/admin | Change admin password |
| POST | /api/auth/change-password/student | Change student password |
| POST | /api/auth/change-password/teacher | Change teacher password |

### OTP / Password Reset
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/otp/forgot-password | Send OTP (role-validated) |
| POST | /api/otp/verify | Verify OTP |
| POST | /api/auth/reset-password/student | Reset student password |
| POST | /api/auth/reset-password/teacher | Reset teacher password |
| POST | /api/auth/reset-password/admin | Reset admin password |

### Students
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/students | List all |
| GET | /api/students/{id} | Get by ID |
| PUT | /api/students/{id} | Update profile |
| DELETE | /api/students/{id} | Delete |
| PATCH | /api/students/{id}/status | Update status |

### Teachers
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/teachers | List all |
| GET | /api/teachers/{id} | Get by ID |
| PUT | /api/teachers/{id} | Update profile |
| DELETE | /api/teachers/{id} | Delete (cascades) |
| PATCH | /api/teachers/{id}/status | Update status |

### Courses
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/courses | List all |
| POST | /api/courses | Create |
| PUT | /api/courses/{id} | Update |
| DELETE | /api/courses/{id} | Delete (cascades) |

### Attendance
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/attendance/student/{id} | By student |
| GET | /api/attendance/course/{id} | By course |
| GET | /api/attendance/course/{id}/stats | Stats per student |
| POST | /api/attendance | Mark (upsert) |

### Marks
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/marks/student/{id} | By student |
| GET | /api/marks/course/{id} | By course |
| POST | /api/marks | Enter (auto-grade) |
| PUT | /api/marks/{id} | Update |

### System Settings
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/system/settings | Get settings |
| PUT | /api/system/settings | Update settings |

---

## 6. Security Design

| Aspect | Implementation |
|---|---|
| Password storage | BCrypt (strength 10) |
| Authentication | Email + password match |
| OTP | 6-digit, 10-min expiry, single-use |
| OTP validation | Role + email existence checked before sending |
| CSRF | Disabled (stateless REST) |
| CORS | All origins allowed for production |
| Authorization | Role-based frontend portals |

---

## 7. Grading Logic

| Score | Grade |
|---|---|
| 90–100 | O |
| 80–89 | A+ |
| 70–79 | A |
| 60–69 | B+ |
| Below 60 | B |

---

## 8. Testing

| Layer | Tool | Count |
|---|---|---|
| Backend Services | JUnit 5 + Mockito | 31 tests |
| Frontend E2E | Playwright | 43 tests |
| API | Postman Collection | 26 requests |

---

## 9. Live URLs

| Service | URL |
|---|---|
| Frontend | https://vtu-intern-2026-team15-java-fs.vercel.app |
| Backend | https://edutrack-backend-o1ym.onrender.com |
| GitHub | https://github.com/NaveenPR123/VTU_INTERN_2026_Team15_JavaFS |

---

*EduTrack — VTU Internship 2026, Team 15*
