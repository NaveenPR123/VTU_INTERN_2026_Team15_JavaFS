# EduTrack — Academic Management Platform

> A full-stack web application built during the Java Full Stack Internship (2026) by Team 15.

EduTrack is a centralized academic platform connecting students, teachers, and administrators — managing attendance, assignments, marks, course materials, and more in real time.

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | https://vtu-intern-2026-team15-java-fs.vercel.app |
| Backend API | https://edutrack-backend-o1ym.onrender.com |

> The backend sleeps after 15 minutes of inactivity on the free tier. Before opening the app, visit the backend URL first and wait for a response, then open the frontend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 |
| Backend | Spring Boot 3, Java 21 |
| Database | MySQL 8 |
| Testing | Playwright (E2E), JUnit 5, Mockito |
| API Testing | Postman |
| Deployment | Vercel (frontend), Render (backend), Railway (database) |

---

## Features

- **Admin Portal** — manage students, teachers, courses, system settings
- **Teacher Portal** — mark attendance, enter marks, manage assignments & materials
- **Student Portal** — view courses, attendance, marks, assignments
- **Forgot Password** — OTP-based reset via email (role-validated)
- **Maintenance Mode** — admin can lock the platform
- **Bulk Import** — CSV upload for students and teachers
- **43 Playwright E2E tests** covering all major flows
- **31 JUnit tests** covering services and controllers
- **26 Postman requests** covering all API endpoints

---

## Project Structure

```
EduTrack/
├── EduTrack-Backend/        # Spring Boot REST API (port 8080)
│   ├── src/main/java/       # Controllers, Services, Entities
│   ├── src/test/java/       # JUnit tests (31 tests)
│   └── Dockerfile           # Docker config for Render deployment
├── EduTrack-Frontend/       # React app (port 3000)
│   └── tests/e2e/           # Playwright E2E tests (43 tests)
├── EduTrack-Database/       # MySQL schema (Schema.sql)
└── docs/
    ├── EduTrack.postman_collection.json   # Postman collection
    ├── SystemDesignDocument.md            # System design document
    └── WBS.md                             # Work breakdown structure
```

---

## Prerequisites

| Software | Version | Download |
|---|---|---|
| Java | 21 (LTS) | https://adoptium.net |
| Git | Latest | https://git-scm.com/download/win |
| Node.js | 18+ (LTS) | https://nodejs.org |
| MySQL | 8.0 | https://dev.mysql.com/downloads/installer |
| VS Code | Latest | https://code.visualstudio.com |
| Eclipse | Latest | https://www.eclipse.org/downloads |
| Postman | Latest | https://www.postman.com/downloads |

> **Eclipse users:** Install **Spring Tools 4** plugin (Help → Eclipse Marketplace) and **Lombok** (https://projectlombok.org/download) before importing the project.

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/NaveenPR123/VTU_INTERN_2026_Team15_JavaFS.git
cd VTU_INTERN_2026_Team15_JavaFS
```

---

### 2. Database Setup

Open **MySQL Workbench** and run:

```sql
CREATE DATABASE edutrack;
```

Then import the schema:
- File → Open SQL Script → select `EduTrack-Database/Schema.sql` → click the lightning bolt ⚡

---

### 3. Backend Setup (Eclipse)

1. File → Import → Maven → **Existing Maven Projects**
2. Browse → select `EduTrack-Backend` → Finish
3. Wait for dependencies to download
4. Expand `EduTrack-Backend → src/main/resources`
5. Right-click `application.properties.template` → Copy → Paste → rename to `application.properties`
6. Fill in your details:

```properties
spring.datasource.password=YOUR_MYSQL_ROOT_PASSWORD
spring.mail.username=YOUR_GMAIL@gmail.com
spring.mail.password=YOUR_GMAIL_APP_PASSWORD
```

> **Gmail App Password:** myaccount.google.com → Security → 2-Step Verification → App Passwords → create one → copy the 16-character code

7. Right-click `EduTrackApplication.java` → **Run As → Spring Boot App**
8. Wait for `Started EduTrackApplication` in Console
9. Backend running at `http://localhost:8080`

**Default admin account (auto-created on first run):**
- Email: `admin@edutrack.com`
- Password: `Admin@123`

---

### 4. Frontend Setup (VS Code)

1. Open VS Code → File → Open Folder → select `EduTrack-Frontend`
2. Open terminal (Terminal → New Terminal):

```bash
npm install
npm start
```

Browser opens at `http://localhost:3000`

---

## Running Tests

### JUnit (Backend)
In Eclipse → right-click `src/test/java` → **Run As → JUnit Test**

Or via terminal:
```bash
cd EduTrack-Backend
mvn test
```

### Playwright (Frontend E2E)
Make sure both backend and frontend are running:

```bash
cd EduTrack-Frontend
npx playwright install chromium   # first time only
npx playwright test
npx playwright show-report
```

### Postman (API)
1. Open Postman → Import
2. Select `docs/EduTrack.postman_collection.json`
3. Make sure backend is running at `http://localhost:8080`

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login/admin` | Admin login |
| POST | `/api/auth/login/student` | Student login |
| POST | `/api/auth/login/teacher` | Teacher login |
| POST | `/api/auth/register/student` | Student registration |
| POST | `/api/otp/forgot-password` | Send OTP (role-validated) |
| POST | `/api/otp/verify` | Verify OTP |
| GET | `/api/students` | List all students |
| GET | `/api/teachers` | List all teachers |
| GET | `/api/courses` | List all courses |
| GET | `/api/attendance/student/{id}` | Student attendance |
| GET | `/api/marks/student/{id}` | Student marks |
| GET | `/api/system/settings` | System settings |

---

## Summary

| What | Tool | Port |
|---|---|---|
| Database | MySQL Workbench | 3306 |
| Backend | Eclipse | 8080 |
| Frontend | VS Code | 3000 |

**All three must be running at the same time for the app to work.**

---

## Team

**VTU Internship 2026 — Team 15**  
Java Full Stack Track

---

## License

MIT
