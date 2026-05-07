# EduTrack — Project Proposal / Synopsis

**Project Title:** EduTrack — Academic Management Platform  
**Team:** VTU Internship 2026 — Team 15  
**Track:** Java Full Stack  
**Date:** April 2026

---

## 1. Introduction

In today's educational institutions, managing academic activities such as attendance, assignments, marks, and course materials is often done manually or through disconnected systems. This leads to inefficiencies, data inconsistencies, and poor communication between students, teachers, and administrators.

EduTrack is a web-based academic management platform designed to digitize and centralize all academic operations. It provides a unified platform where students can track their academic progress, teachers can manage their courses and students, and administrators can oversee the entire institution — all in real time through a secure, role-based web application.

---

## 2. Problem Statement

Educational institutions face several challenges in managing academic data:

- Attendance is marked manually on paper, making it difficult to track and analyze
- Marks and grades are maintained in spreadsheets with no centralized access
- Students have no real-time visibility into their academic performance
- Assignment deadlines and submissions are managed informally
- Administrators have no centralized tool to manage students, teachers, and platform settings
- Password recovery is insecure or non-existent in most systems
- Bulk data entry (adding multiple students or teachers) is time-consuming

EduTrack addresses all of these problems through a single integrated platform.

---

## 3. Objectives

- Build a full-stack web application for academic management
- Provide role-based access for Admin, Teacher, and Student
- Enable real-time attendance tracking with percentage calculation
- Allow teachers to enter marks with automatic grade calculation
- Support assignment creation, submission, and grading
- Enable course material upload and download
- Implement secure OTP-based password reset via email
- Allow bulk import of students, teachers, attendance, and marks via CSV
- Provide admin control over platform settings including maintenance mode
- Deploy the application on cloud platforms for public access

---

## 4. Proposed System

EduTrack is a three-tier web application consisting of:

### Frontend
A React 19 Single Page Application (SPA) that provides separate portals for Admin, Teacher, and Student. The frontend communicates with the backend through REST APIs and supports dark/light theme switching.

### Backend
A Spring Boot 3 REST API built with Java 21. It handles authentication, business logic, OTP generation and validation, email sending, file uploads, and CSV bulk imports. Passwords are secured using BCrypt hashing.

### Database
A MySQL 8 relational database with 11 tables storing all academic data. Hibernate ORM manages the mapping between Java entities and database tables.

---

## 5. System Architecture

```
User (Browser)
      ↓
React Frontend (Vercel)
      ↓  REST API calls
Spring Boot Backend (Render)
      ↓  JDBC
MySQL Database (Railway)
```

---

## 6. Key Features

### Admin Module
- Manage students and teachers (add, edit, delete, search)
- Bulk import via CSV
- Enable maintenance mode
- Control student registration
- Set active academic year and semester

### Teacher Module
- Create and manage courses
- Mark and view attendance
- Enter and update student marks
- Create assignments and view submissions
- Upload course materials

### Student Module
- View attendance with percentage
- View marks and grades
- View and submit assignments
- Download course materials
- Track academic progress on dashboard

### Security
- BCrypt password hashing
- OTP-based password reset via Gmail SMTP
- Role-based access control
- Maintenance mode to block logins

---

## 7. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, JavaScript |
| Backend | Spring Boot 3.2.3, Java 21 |
| Database | MySQL 8.0 |
| ORM | Hibernate (Spring Data JPA) |
| Security | Spring Security, BCrypt |
| Email | Gmail SMTP (Spring Mail) |
| Testing | Playwright (E2E), JUnit 5, Mockito |
| Deployment | Vercel, Render, Railway |
| Version Control | Git, GitHub |

---

## 8. Database Design

The database consists of 11 tables:

| Table | Purpose |
|---|---|
| admins | Admin accounts |
| teachers | Teacher accounts |
| students | Student accounts |
| courses | Course information |
| attendance | Daily attendance records |
| assignments | Course assignments |
| submissions | Student submissions |
| marks | Student marks and grades |
| course_materials | Study materials |
| otp_verification | OTP for password reset |
| system_settings | Platform configuration |

---

## 9. Testing

| Type | Tool | Count |
|---|---|---|
| End-to-End Tests | Playwright | 43 tests |
| Unit Tests | JUnit 5 + Mockito | 31 tests |
| API Tests | Postman | 26 requests |

---

## 10. Deployment

| Component | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://vtu-intern-2026-team15-java-fs.vercel.app |
| Backend | Render (Docker) | https://edutrack-backend-o1ym.onrender.com |
| Database | Railway (MySQL) | Cloud hosted |

---

## 11. Expected Outcomes

- A fully functional academic management platform accessible via public URL
- Secure role-based access for Admin, Teacher, and Student
- Real-time attendance and marks tracking
- OTP-based password recovery for all users
- Automated grading system
- Bulk data import capability
- Comprehensive test suite with 100 tests across all layers
- Complete documentation including SDD, API docs, WBS, and user stories

---

## 12. Team

| Name | Role |
|---|---|
| Naveen P R | Team Leader & Core Developer |
| Rashmi S P | Developer |
| Sneha H S | Developer |
| Soujanya M | Developer |
| Deepa G R | Developer |
| Kavana N | Developer |
| Vanashree R | Developer |
| Deeksha D R | Developer |
| Saud Shaik | Developer |

---

## 13. Conclusion

EduTrack provides a comprehensive solution to the challenges faced by educational institutions in managing academic data. By centralizing attendance, marks, assignments, and course materials in a single platform with role-based access, EduTrack improves efficiency, transparency, and communication between all stakeholders. The platform is built using industry-standard technologies, follows best practices in security and testing, and is deployed on cloud infrastructure for public access.

---

*EduTrack — VTU Internship 2026, Team 15*
