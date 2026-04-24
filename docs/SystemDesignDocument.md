# EduTrack — System Design Document

**Version:** 1.0  
**Team:** VTU Internship 2026 — Team 15  
**Date:** April 2026

---

## 1. Overview

EduTrack is a full-stack academic management platform that connects students, teachers, and administrators. It provides real-time management of attendance, assignments, marks, course materials, and system settings through a role-based web application.

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│              React 19 (Vercel CDN)                      │
│         https://vtu-intern-2026-team15-java-fs.vercel.app│
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS REST API calls
                      │
┌─────────────────────▼───────────────────────────────────┐
│                      BACKEND                            │
│           Spring Boot 3 (Render - Docker)               │
│         https://edutrack-backend-o1ym.onrender.com      │
└─────────────────────┬───────────────────────────────────┘
                      │ JDBC (MySQL Connector)
                      │
┌─────────────────────▼───────────────────────────────────┐
│                     DATABASE                            │
│              MySQL 9.4 (Railway Cloud)                  │
│           hopper.proxy.rlwy.net:12491                   │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Deployment Architecture

| Layer | Technology | Platform | URL |
|---|---|---|---|
| Frontend | React 19 | Vercel | vtu-intern-2026-team15-java-fs.vercel.app |
| Backend | Spring Boot 3 / Docker | Render | edutrack-backend-o1ym.onrender.com |
| Database | MySQL 9.4 | Railway | hopper.proxy.rlwy.net:12491 |

---

## 3. Technology Stack

### 3.1 Frontend
| Component | Technology |
|---|---|
| Framework | React 19 |
| Routing | Hash-based routing (window.history) |
| Styling | Inline CSS with dynamic theming |
| HTTP Client | Fetch API |
| Testing | Playwright (E2E) — 43 tests |
| Build Tool | Create React App |
| Deployment | Vercel |

### 3.2 Backend
| Component | Technology |
|---|---|
| Framework | Spring Boot 3.2.3 |
| Language | Java 21 |
| ORM | Spring Data JPA / Hibernate |
| Security | Spring Security (BCrypt password hashing) |
| Email | Spring Mail (Gmail SMTP) |
| Build Tool | Maven |
| Containerization | Docker |
| Deployment | Render |
| Testing | JUnit 5, Mockito — 31 tests |

### 3.3 Database
| Component | Technology |
|---|---|
| RDBMS | MySQL 9.4 |
| ORM Dialect | MySQLDialect (Hibernate) |
| Schema Management | Hibernate DDL auto-update |
| Hosting | Railway Cloud |

---

## 4. Database Design

### 4.1 Entity Relationship Overview

```
admins ──────────────────────────────────────────────────┐
                                                          │
teachers ──────────────── courses ──────────────────┐    │
                              │                      │    │
                         assignments            attendance│
                              │                      │    │
students ─────────────────────┼──────────────────────┘    │
    │                         │                           │
    └── submissions ──────────┘                           │
    │                                                     │
    └── marks                                             │
                                                          │
otp_verification                                          │
system_settings ──────────────────────────────────────────┘
course_materials
```

### 4.2 Tables

#### admins
| Column | Type | Constraints |
|---|---|---|
| admin_id | INT | PK, AUTO_INCREMENT |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(100) | NOT NULL, UNIQUE |
| password | VARCHAR(255) | NOT NULL (BCrypt) |

#### teachers
| Column | Type | Constraints |
|---|---|---|
| teacher_id | INT | PK, AUTO_INCREMENT |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(100) | NOT NULL, UNIQUE |
| password | VARCHAR(255) | NOT NULL (BCrypt) |
| phone | VARCHAR(15) | |
| department | VARCHAR(100) | NOT NULL |
| employee_id | VARCHAR(50) | UNIQUE |
| status | VARCHAR(20) | DEFAULT 'Active' |

#### students
| Column | Type | Constraints |
|---|---|---|
| student_id | INT | PK, AUTO_INCREMENT |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(100) | NOT NULL, UNIQUE |
| password | VARCHAR(255) | NOT NULL (BCrypt) |
| phone | VARCHAR(15) | |
| usn | VARCHAR(50) | UNIQUE |
| department | VARCHAR(100) | NOT NULL |
| year | VARCHAR(20) | NOT NULL |
| semester | VARCHAR(20) | |
| status | VARCHAR(20) | DEFAULT 'Active' |
| course_id | INT | FK → courses |

#### courses
| Column | Type | Constraints |
|---|---|---|
| course_id | INT | PK, AUTO_INCREMENT |
| course_name | VARCHAR(150) | NOT NULL |
| credits | INT | DEFAULT 3 |
| teacher_id | INT | FK → teachers (CASCADE) |

#### attendance
| Column | Type | Constraints |
|---|---|---|
| attendance_id | INT | PK, AUTO_INCREMENT |
| student_id | INT | FK → students (CASCADE) |
| course_id | INT | FK → courses (CASCADE) |
| attendance_date | DATE | NOT NULL |
| status | VARCHAR(10) | DEFAULT 'Present' |

#### assignments
| Column | Type | Constraints |
|---|---|---|
| assignment_id | INT | PK, AUTO_INCREMENT |
| course_id | INT | FK → courses (CASCADE) |
| title | VARCHAR(200) | NOT NULL |
| description | TEXT | |
| due_date | DATE | NOT NULL |

#### submissions
| Column | Type | Constraints |
|---|---|---|
| submission_id | INT | PK, AUTO_INCREMENT |
| assignment_id | INT | FK → assignments (CASCADE) |
| student_id | INT | FK → students (CASCADE) |
| submitted_at | DATETIME | NOT NULL |
| file_url | VARCHAR(500) | |
| status | VARCHAR(20) | DEFAULT 'Submitted' |
| grade | VARCHAR(10) | |
| feedback | TEXT | |

#### marks
| Column | Type | Constraints |
|---|---|---|
| mark_id | INT | PK, AUTO_INCREMENT |
| student_id | INT | FK → students (CASCADE) |
| course_id | INT | FK → courses (CASCADE) |
| marks | INT | DEFAULT 0 |
| grade | VARCHAR(5) | DEFAULT 'N/A' |

#### course_materials
| Column | Type | Constraints |
|---|---|---|
| material_id | INT | PK, AUTO_INCREMENT |
| course_id | INT | FK → courses (CASCADE) |
| title | VARCHAR(200) | NOT NULL |
| material_url | VARCHAR(500) | NOT NULL |
| uploaded_at | DATETIME | NOT NULL |

#### otp_verification
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT |
| email | VARCHAR(100) | NOT NULL |
| otp | VARCHAR(6) | NOT NULL |
| expiry_time | DATETIME | NOT NULL |
| used | BOOLEAN | DEFAULT FALSE |

#### system_settings
| Column | Type | Constraints |
|---|---|---|
| id | INT | PK |
| active_year | VARCHAR(20) | DEFAULT '2025-26' |
| active_semester | VARCHAR(20) | DEFAULT 'Even' |
| maintenance_mode | BOOLEAN | DEFAULT FALSE |
| registration_open | BOOLEAN | DEFAULT TRUE |

---

## 5. API Design

### 5.1 Authentication APIs
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/login/admin | Admin login |
| POST | /api/auth/login/student | Student login |
| POST | /api/auth/login/teacher | Teacher login |
| POST | /api/auth/register/student | Student self-registration |
| POST | /api/auth/register/teacher | Teacher self-registration |
| POST | /api/auth/admin/add-student | Admin adds student (bypasses registration gate) |
| POST | /api/auth/admin/add-teacher | Admin adds teacher |
| POST | /api/auth/change-password/admin | Change admin password |
| POST | /api/auth/change-password/student | Change student password |
| POST | /api/auth/change-password/teacher | Change teacher password |

### 5.2 OTP APIs
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/otp/forgot-password | Send OTP (validates role + email) |
| POST | /api/otp/verify | Verify OTP |
| POST | /api/auth/reset-password/student | Reset student password after OTP |
| POST | /api/auth/reset-password/teacher | Reset teacher password after OTP |
| POST | /api/auth/reset-password/admin | Reset admin password after OTP |

### 5.3 Student APIs
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/students | List all students |
| GET | /api/students/{id} | Get student by ID |
| PUT | /api/students/{id} | Update student profile |
| DELETE | /api/students/{id} | Delete student |
| PATCH | /api/students/{id}/status | Update student status |
| POST | /api/students/{id}/reset-password | Admin force reset password |

### 5.4 Teacher APIs
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/teachers | List all teachers |
| GET | /api/teachers/{id} | Get teacher by ID |
| PUT | /api/teachers/{id} | Update teacher profile |
| DELETE | /api/teachers/{id} | Delete teacher (cascades courses) |
| PATCH | /api/teachers/{id}/status | Update teacher status |
| POST | /api/teachers/{id}/reset-password | Admin force reset password |

### 5.5 Course APIs
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/courses | List all courses |
| GET | /api/courses/{id} | Get course by ID |
| GET | /api/courses/teacher/{id} | Courses by teacher |
| GET | /api/courses/department/{dept} | Courses by department |
| POST | /api/courses | Create course |
| PUT | /api/courses/{id} | Update course |
| DELETE | /api/courses/{id} | Delete course (cascades all data) |

### 5.6 Attendance APIs
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/attendance/student/{id} | Attendance by student |
| GET | /api/attendance/course/{id} | Attendance by course |
| GET | /api/attendance/course/{id}/stats | Attendance stats per student |
| GET | /api/attendance/course/{id}/date/{date} | Attendance by course and date |
| POST | /api/attendance | Mark attendance (upsert) |
| PUT | /api/attendance/{id} | Update attendance record |
| DELETE | /api/attendance/{id} | Delete attendance record |

### 5.7 Marks APIs
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/marks/student/{id} | Marks by student |
| GET | /api/marks/course/{id} | Marks by course |
| POST | /api/marks | Enter marks (auto-grades) |
| PUT | /api/marks/{id} | Update marks |
| DELETE | /api/marks/{id} | Delete marks |

### 5.8 System Settings API
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/system/settings | Get system settings |
| PUT | /api/system/settings | Update settings |

---

## 6. Security Design

### 6.1 Authentication
- No JWT tokens — session-less authentication
- Passwords hashed using **BCrypt** (strength 10)
- Login validates email + BCrypt password match
- Role determined by which login endpoint is called

### 6.2 Authorization
- Role-based access enforced on the **frontend** (different portals per role)
- Backend endpoints are open (permitAll) — protected by design separation
- Spring Security CSRF disabled (stateless REST API)

### 6.3 OTP Security
- 6-digit OTP generated using `SecureRandom`
- OTP expires after **10 minutes**
- OTP marked as `used=true` after first successful validation (single-use)
- Old OTPs deleted before generating new ones
- Email existence validated against correct role's table before sending OTP

### 6.4 CORS
- All origins allowed (`*`) for production compatibility
- Configured in both `SecurityConfig` and `@CrossOrigin` annotations

---

## 7. Component Design

### 7.1 Frontend Components

```
App.js
├── LandingPage
├── Login
│   ├── Role selector (Student / Teacher / Admin)
│   └── Forgot Password flow
├── Signup
├── ForgotPassword
│   ├── Step 1: Enter Email (role-validated)
│   ├── Step 2: Verify OTP
│   └── Step 3: Reset Password
└── Dashboard
    ├── AdminDashboard
    │   ├── AdminStudents (CRUD)
    │   ├── AdminTeachers (CRUD)
    │   ├── AdminCourses
    │   └── Settings (System settings, Change password)
    ├── StudentDashboard
    │   ├── StudentCourses
    │   ├── StudentAttendance
    │   ├── StudentAssignments
    │   ├── StudentMarks
    │   ├── StudentMaterials
    │   └── Settings (Profile, Change password)
    └── TeacherDashboard
        ├── TeacherCourses
        ├── TeacherAttendance
        ├── TeacherAssignments
        ├── TeacherMarks
        ├── TeacherMaterials
        └── Settings (Profile, Change password)
```

### 7.2 Backend Layers

```
Controllers (REST endpoints)
    ↓
Services (Business logic)
    ↓
Repositories (Spring Data JPA)
    ↓
Entities (JPA / Hibernate)
    ↓
MySQL Database
```

---

## 8. Key Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Auth mechanism | Custom BCrypt | Simple, no JWT complexity needed |
| OTP delivery | Gmail SMTP | Free, reliable for demo |
| Frontend routing | Hash-based | No server config needed for SPA |
| Password storage | BCrypt | Industry standard, salted hashing |
| DB schema management | Hibernate DDL auto | Simplifies deployment |
| CORS | Allow all origins | Supports any frontend domain |
| Grading | Auto-calculated | O/A+/A/B+/B based on score |

---

## 9. Grading Logic

| Score Range | Grade |
|---|---|
| 90 – 100 | O |
| 80 – 89 | A+ |
| 70 – 79 | A |
| 60 – 69 | B+ |
| Below 60 | B |

---

## 10. Testing Strategy

| Layer | Tool | Count |
|---|---|---|
| Backend Services | JUnit 5 + Mockito | 31 tests |
| Backend Controllers | Spring MockMvc | Included in 31 |
| Frontend E2E | Playwright | 43 tests |
| API | Postman Collection | 26 requests |

---

## 11. Live URLs

| Service | URL |
|---|---|
| Frontend | https://vtu-intern-2026-team15-java-fs.vercel.app |
| Backend | https://edutrack-backend-o1ym.onrender.com |
| GitHub | https://github.com/NaveenPR123/VTU_INTERN_2026_Team15_JavaFS |

---

*EduTrack — VTU Internship 2026, Team 15*
