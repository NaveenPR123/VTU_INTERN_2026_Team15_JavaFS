# EduTrack — Software Requirements Specification (SRS)

**Project:** EduTrack Academic Management Platform  
**Team:** VTU Internship 2026 — Team 15  
**Version:** 1.0  
**Date:** April 2026

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document describes the functional and non-functional requirements for the EduTrack Academic Management Platform. It is intended to guide the development team and serve as a reference for testing and validation.

### 1.2 Scope
EduTrack is a web-based academic management platform that provides role-based access for three types of users — Admin, Teacher, and Student. The system manages attendance, marks, assignments, course materials, and platform settings through a centralized interface.

### 1.3 Definitions

| Term | Definition |
|---|---|
| Admin | System administrator who manages the platform |
| Teacher | Faculty member who manages courses and students |
| Student | Learner who accesses academic data |
| OTP | One-Time Password used for password reset |
| BCrypt | Password hashing algorithm used for secure storage |
| JWT | JSON Web Token (not used — custom auth implemented) |
| CRUD | Create, Read, Update, Delete operations |
| CSV | Comma-Separated Values file format for bulk import |
| SPA | Single Page Application |

### 1.4 References
- Spring Boot 3.2.3 Documentation
- React 19 Documentation
- MySQL 8.0 Reference Manual
- IEEE SRS Standard 830-1998

---

## 2. Overall Description

### 2.1 Product Perspective
EduTrack is a standalone web application consisting of three tiers:
- **Presentation Layer:** React 19 frontend
- **Business Logic Layer:** Spring Boot 3 REST API
- **Data Layer:** MySQL 8 database

### 2.2 Product Functions
- Role-based authentication and authorization
- Student and teacher management by admin
- Course creation and management by teachers
- Attendance marking and tracking
- Marks entry with automatic grade calculation
- Assignment creation and submission
- Course material upload and download
- OTP-based password reset via email
- Bulk data import via CSV
- Platform-wide system settings management

### 2.3 User Classes

| User Class | Description | Access Level |
|---|---|---|
| Admin | Manages the entire platform | Full access to all management features |
| Teacher | Manages courses and students | Access to their own courses and students |
| Student | Views academic data | Read-only access to their own data |

### 2.4 Operating Environment
- **Client:** Any modern web browser (Chrome, Firefox, Safari, Edge)
- **Server:** Java 21, Spring Boot 3.2.3
- **Database:** MySQL 8.0
- **OS:** Any OS supporting Java 21

### 2.5 Assumptions and Dependencies
- Users have a stable internet connection
- Gmail SMTP is available for OTP delivery
- MySQL 8+ is installed and running
- Java 21 is installed on the server

---

## 3. Functional Requirements

### 3.1 Authentication Module

**FR-AUTH-01:** The system shall allow Admin to log in using email and password.  
**FR-AUTH-02:** The system shall allow Teacher to log in using email and password.  
**FR-AUTH-03:** The system shall allow Student to log in using email and password.  
**FR-AUTH-04:** The system shall display an error message for invalid credentials.  
**FR-AUTH-05:** The system shall block Student and Teacher login when maintenance mode is enabled.  
**FR-AUTH-06:** The system shall allow all users to log out.  
**FR-AUTH-07:** The system shall allow Student self-registration when registration is open.  
**FR-AUTH-08:** The system shall hash all passwords using BCrypt before storing.  
**FR-AUTH-09:** The system shall redirect users to their role-specific portal after login.  
**FR-AUTH-10:** The system shall clear credentials when switching roles on the login page.

---

### 3.2 OTP Password Reset Module

**FR-OTP-01:** The system shall allow users to request a password reset via email.  
**FR-OTP-02:** The system shall validate that the email exists for the selected role before sending OTP.  
**FR-OTP-03:** The system shall generate a 6-digit OTP using a secure random generator.  
**FR-OTP-04:** The system shall send the OTP to the user's registered email via Gmail SMTP.  
**FR-OTP-05:** The OTP shall expire after 10 minutes.  
**FR-OTP-06:** The OTP shall be single-use — invalidated after successful verification.  
**FR-OTP-07:** The system shall delete old OTPs before generating a new one for the same email.  
**FR-OTP-08:** The system shall allow password reset after successful OTP verification.

---

### 3.3 Admin Module

**FR-ADMIN-01:** The system shall allow Admin to view all registered students.  
**FR-ADMIN-02:** The system shall allow Admin to add a new student.  
**FR-ADMIN-03:** The system shall allow Admin to edit a student's name and phone number.  
**FR-ADMIN-04:** The system shall allow Admin to delete a student and all their related data.  
**FR-ADMIN-05:** The system shall allow Admin to search students by name, email, or department.  
**FR-ADMIN-06:** The system shall allow Admin to update a student's status (Active/Suspended/Graduated).  
**FR-ADMIN-07:** The system shall allow Admin to force reset a student's password.  
**FR-ADMIN-08:** The system shall allow Admin to bulk import students via CSV.  
**FR-ADMIN-09:** The system shall allow Admin to view all registered teachers.  
**FR-ADMIN-10:** The system shall allow Admin to add a new teacher.  
**FR-ADMIN-11:** The system shall allow Admin to edit a teacher's name, phone, and employee ID.  
**FR-ADMIN-12:** The system shall allow Admin to delete a teacher and all their related data.  
**FR-ADMIN-13:** The system shall allow Admin to update a teacher's status (Active/Suspended).  
**FR-ADMIN-14:** The system shall allow Admin to force reset a teacher's password.  
**FR-ADMIN-15:** The system shall allow Admin to bulk import teachers via CSV.  
**FR-ADMIN-16:** The system shall allow Admin to enable or disable maintenance mode.  
**FR-ADMIN-17:** The system shall allow Admin to open or close student self-registration.  
**FR-ADMIN-18:** The system shall allow Admin to set the active academic year and semester.  
**FR-ADMIN-19:** The system shall not allow Admin to change a student's department, year, or semester after registration.

---

### 3.4 Teacher Module

**FR-TEACHER-01:** The system shall allow Teacher to view all courses assigned to them.  
**FR-TEACHER-02:** The system shall allow Teacher to create a new course.  
**FR-TEACHER-03:** The system shall allow Teacher to update course details.  
**FR-TEACHER-04:** The system shall allow Teacher to delete a course and all its related data.  
**FR-TEACHER-05:** The system shall allow Teacher to mark attendance for students per course per date.  
**FR-TEACHER-06:** The system shall update existing attendance if the same student+course+date record exists (upsert).  
**FR-TEACHER-07:** The system shall allow Teacher to view attendance by course and by date.  
**FR-TEACHER-08:** The system shall allow Teacher to view attendance statistics per student.  
**FR-TEACHER-09:** The system shall allow Teacher to enter marks for students per course.  
**FR-TEACHER-10:** The system shall auto-calculate grades based on marks entered.  
**FR-TEACHER-11:** The system shall allow Teacher to update and delete marks.  
**FR-TEACHER-12:** The system shall allow Teacher to create assignments with title, description, and due date.  
**FR-TEACHER-13:** The system shall allow Teacher to update and delete assignments.  
**FR-TEACHER-14:** The system shall allow Teacher to view student submissions per assignment.  
**FR-TEACHER-15:** The system shall allow Teacher to grade submissions and add feedback.  
**FR-TEACHER-16:** The system shall allow Teacher to upload course materials as files.  
**FR-TEACHER-17:** The system shall allow Teacher to add external links as course materials.  
**FR-TEACHER-18:** The system shall allow Teacher to delete course materials.  
**FR-TEACHER-19:** The system shall allow Teacher to bulk import attendance via CSV.  
**FR-TEACHER-20:** The system shall allow Teacher to bulk import marks via CSV.  
**FR-TEACHER-21:** The system shall allow Teacher to update their name and phone number.  
**FR-TEACHER-22:** The system shall allow Teacher to change their password.

---

### 3.5 Student Module

**FR-STUDENT-01:** The system shall allow Student to register with their details.  
**FR-STUDENT-02:** The system shall allow Student to view all courses in their department.  
**FR-STUDENT-03:** The system shall allow Student to view their attendance per course.  
**FR-STUDENT-04:** The system shall display attendance percentage per course for the student.  
**FR-STUDENT-05:** The system shall allow Student to view their marks per course.  
**FR-STUDENT-06:** The system shall display the auto-calculated grade for each course.  
**FR-STUDENT-07:** The system shall display the student's CGPA on the dashboard.  
**FR-STUDENT-08:** The system shall allow Student to view all assignments for their courses.  
**FR-STUDENT-09:** The system shall allow Student to submit assignments as file uploads.  
**FR-STUDENT-10:** The system shall allow Student to check their submission status and grade.  
**FR-STUDENT-11:** The system shall allow Student to view and download course materials.  
**FR-STUDENT-12:** The system shall allow Student to update their name and phone number.  
**FR-STUDENT-13:** The system shall allow Student to change their password.  
**FR-STUDENT-14:** The system shall not allow Student to change their department, year, or semester.

---

### 3.6 Grading System

**FR-GRADE-01:** The system shall automatically assign grades based on the following scale:

| Marks | Grade |
|---|---|
| 90 – 100 | O |
| 80 – 89 | A+ |
| 70 – 79 | A |
| 60 – 69 | B+ |
| Below 60 | B |

---

## 4. Non-Functional Requirements

### 4.1 Performance
**NFR-PERF-01:** The system shall load the dashboard within 3 seconds on a standard internet connection.  
**NFR-PERF-02:** API responses shall be returned within 2 seconds for standard operations.  
**NFR-PERF-03:** The system shall support at least 50 concurrent users.

### 4.2 Security
**NFR-SEC-01:** All passwords shall be hashed using BCrypt before storage.  
**NFR-SEC-02:** Passwords shall never be returned in API responses.  
**NFR-SEC-03:** OTPs shall expire after 10 minutes and be single-use.  
**NFR-SEC-04:** CSRF protection shall be disabled for stateless REST API.  
**NFR-SEC-05:** CORS shall be configured to allow requests from the frontend domain.

### 4.3 Usability
**NFR-USE-01:** The system shall provide a dark and light theme option.  
**NFR-USE-02:** The system shall display clear error messages for all failed operations.  
**NFR-USE-03:** The system shall work on all modern browsers (Chrome, Firefox, Safari, Edge).  
**NFR-USE-04:** The login page shall clear fields when switching between roles.

### 4.4 Reliability
**NFR-REL-01:** The system shall maintain data integrity through foreign key constraints.  
**NFR-REL-02:** Cascade delete shall ensure no orphan records remain after deletion.  
**NFR-REL-03:** The default admin account shall be auto-created on first startup.

### 4.5 Maintainability
**NFR-MAIN-01:** The codebase shall follow a layered architecture (Controller, Service, Repository, Entity).  
**NFR-MAIN-02:** All sensitive configuration shall be stored in `application.properties` (gitignored).  
**NFR-MAIN-03:** A template file `application.properties.template` shall be provided for setup.

### 4.6 Portability
**NFR-PORT-01:** The backend shall be containerized using Docker for platform-independent deployment.  
**NFR-PORT-02:** The frontend shall be deployable on any static hosting platform.

---

## 5. System Constraints

| Constraint | Description |
|---|---|
| Technology | React, Spring Boot, MySQL only |
| Authentication | Custom BCrypt-based auth (no JWT) |
| Deployment | Free tier hosting |
| Email | Gmail SMTP only |
| Departments | Only CSE and AIML supported |

---

## 6. External Interface Requirements

### 6.1 User Interface
- Web browser-based interface
- Responsive layout
- Dark/Light theme support
- Role-based navigation sidebar

### 6.2 Hardware Interface
- Standard computer or laptop with internet access
- No special hardware required

### 6.3 Software Interface
- MySQL 8.0 database
- Gmail SMTP for email delivery
- Browser supporting ES6+ JavaScript

### 6.4 Communication Interface
- HTTPS for all API communication in production
- REST API with JSON request/response format
- SMTP over TLS (port 587) for email

---

## 7. Appendix

### 7.1 Live URLs

| Service | URL |
|---|---|
| Frontend | https://vtu-intern-2026-team15-java-fs.vercel.app |
| Backend | https://edutrack-backend-o1ym.onrender.com |
| GitHub | https://github.com/NaveenPR123/VTU_INTERN_2026_Team15_JavaFS |

---

*EduTrack — VTU Internship 2026, Team 15*
