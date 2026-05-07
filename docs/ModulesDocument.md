# EduTrack — Modules Document

**Project:** EduTrack Academic Management Platform  
**Team:** VTU Internship 2026 — Team 15  
**Date:** April 2026

---

## Modules Overview

EduTrack is divided into the following major modules:

1. Login and Authentication
2. Admin Management
3. Student Portal
4. Teacher Portal
5. Attendance Management
6. Marks and Grading
7. Assignment and Submission
8. Course Materials
9. OTP-Based Password Reset
10. System Settings
11. Bulk Import

---

## 1. Login and Authentication

This module handles user authentication for all three roles — Admin, Teacher, and Student.

**Features:**
- Role selector on login page (Student / Teacher / Admin)
- Email and password-based login
- BCrypt password hashing for secure storage
- Maintenance mode check — blocks student and teacher login when enabled
- Role-based portal redirection after login
- Logout functionality
- Switching roles clears previously entered credentials

**Key Files:**
- `Login.jsx` — Frontend login page
- `AuthController.java` — Login endpoints
- `AuthService.java` — Login business logic
- `SecurityConfig.java` — Spring Security configuration

---

## 2. Admin Management

This module allows the admin to manage students, teachers, and platform settings.

**Features:**
- View, add, edit, and delete students
- View, add, edit, and delete teachers
- Search students and teachers by name, email, or department
- Update student status (Active / Suspended / Graduated)
- Update teacher status (Active / Suspended)
- Force reset passwords for students and teachers
- Bulk import students and teachers via CSV

**Key Files:**
- `AdminStudents` component — Student management UI
- `AdminTeachers` component — Teacher management UI
- `AppControllers.java` — Student and Teacher CRUD endpoints
- `BulkImportController.java` — CSV import endpoints

---

## 3. Student Portal

This module provides students with access to their academic information.

**Features:**
- Student dashboard with summary of attendance, marks, and assignments
- View all courses available in their department
- View personal profile (name, USN, department, year, semester)
- Update name and phone number
- Change password

**Key Files:**
- `StudentDashboard` component
- `StudentCourses` component
- `Settings` component

---

## 4. Teacher Portal

This module provides teachers with tools to manage their courses and students.

**Features:**
- Teacher dashboard with course and student overview
- View all courses assigned to the teacher
- Create, update, and delete courses
- Manage assignments and view submissions
- Upload and manage course materials
- Update personal profile
- Change password

**Key Files:**
- `TeacherDashboard` component
- `TeacherCourses` component
- `CourseController` in `AppControllers.java`

---

## 5. Attendance Management

This module handles recording and viewing student attendance.

**Features:**
- Teachers mark attendance per course per date (Present / Absent)
- Upsert logic — updates existing record if same student+course+date exists
- View attendance by course, by student, or by date
- Attendance statistics — percentage per student per course
- Students view their own attendance with percentage
- Bulk attendance import via CSV (usn, status)

**Key Files:**
- `TeacherAttendance` component
- `StudentAttendance` component
- `AttendanceController` in `AppControllers.java`
- `BulkImportController.java` — `/api/bulk/attendance`

---

## 6. Marks and Grading

This module handles entering, updating, and viewing student marks with auto-grading.

**Features:**
- Teachers enter marks per student per course
- Grades auto-calculated based on marks:
  - O (90–100), A+ (80–89), A (70–79), B+ (60–69), B (below 60)
- Update and delete marks
- Students view marks and grades per course
- CGPA calculation displayed on student dashboard
- Bulk marks import via CSV (usn, marks)

**Key Files:**
- `TeacherMarks` component
- `StudentMarks` component
- `MarksController` in `AppControllers.java`
- `BulkImportController.java` — `/api/bulk/marks`

---

## 7. Assignment and Submission

This module manages assignment creation by teachers and submission by students.

**Features:**
- Teachers create assignments with title, description, and due date
- Teachers update and delete assignments
- Students view assignments with due dates
- Students submit assignments as file uploads
- Teachers view all submissions per assignment
- Teachers grade submissions and add feedback
- Students check their submission status and grade
- Download submitted files

**Key Files:**
- `TeacherAssignments` component
- `StudentAssignments` component
- `AssignmentController` in `AppControllers.java`
- `SubmissionController.java`

---

## 8. Course Materials

This module allows teachers to upload study materials for students.

**Features:**
- Teachers upload files (PDF, PPT, DOC, etc.) as course materials
- Teachers add external links as course materials
- Students view and download materials per course
- Teachers delete materials
- Materials stored on server with timestamp

**Key Files:**
- `TeacherMaterials` component
- `StudentMaterials` component
- `CourseMaterialController.java`

---

## 9. OTP-Based Password Reset

This module provides secure password recovery for all users via email OTP.

**Features:**
- 3-step flow: Enter Email → Verify OTP → Reset Password
- Role-based validation — email checked against correct user table before sending OTP
- 6-digit OTP generated using SecureRandom
- OTP expires in 10 minutes
- Single-use OTP — marked as used after successful verification
- Old OTPs deleted before generating new ones
- OTP sent via Gmail SMTP

**Key Files:**
- `ForgotPassword.jsx` — 3-step frontend flow
- `OtpController.java` — Send and verify OTP endpoints
- `OtpService.java` — OTP generation and validation logic
- `PasswordResetController.java` — Password reset endpoints
- `EmailService.java` — Gmail SMTP email sending

---

## 10. System Settings

This module allows the admin to configure platform-wide settings.

**Features:**
- Enable / disable maintenance mode (blocks student and teacher login)
- Open / close student self-registration
- Set active academic year (e.g. 2025-26)
- Set active semester (e.g. Even / Odd)
- Settings auto-created with defaults on first startup

**Key Files:**
- `Settings` component (System tab — admin only)
- `SystemSettingsController.java`
- `SystemSettings.java` entity

---

## 11. Bulk Import

This module allows admin and teachers to import multiple records at once using CSV files.

**Features:**
- Admin can bulk import students from CSV
- Admin can bulk import teachers from CSV
- Admin and Teacher can bulk import attendance from CSV (per course per date)
- Admin and Teacher can bulk import marks from CSV (per course)
- Validation — skips duplicate emails, invalid departments, invalid marks
- Returns count of imported records and list of errors

**CSV Formats:**

Students:
```
name,email,password,department,year,semester,phone,usn
```

Teachers:
```
name,email,password,department,phone,employeeId
```

Attendance:
```
usn,status
```

Marks:
```
usn,marks
```

**Key Files:**
- Bulk Import UI in `AdminStudents` and `AdminTeachers` components
- `BulkImportController.java`

---

## Module Summary

| # | Module | Users |
|---|---|---|
| 1 | Login and Authentication | Admin, Teacher, Student |
| 2 | Admin Management | Admin |
| 3 | Student Portal | Student |
| 4 | Teacher Portal | Teacher |
| 5 | Attendance Management | Teacher, Student |
| 6 | Marks and Grading | Teacher, Student |
| 7 | Assignment and Submission | Teacher, Student |
| 8 | Course Materials | Teacher, Student |
| 9 | OTP-Based Password Reset | Admin, Teacher, Student |
| 10 | System Settings | Admin |
| 11 | Bulk Import | Admin, Teacher |

---

*EduTrack — VTU Internship 2026, Team 15*
