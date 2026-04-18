# EduTrack — Academic Management Platform

> A full-stack web application built during the Java Full Stack Internship (2026) by Team 15.

EduTrack is a centralized academic platform connecting students, teachers, and administrators — managing attendance, assignments, marks, course materials, and more in real time.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, CSS |
| Backend | Spring Boot 3, Java 17 |
| Database | MySQL 8 |
| Testing | Playwright (E2E) |
| Auth | BCrypt password hashing, OTP via Gmail SMTP |

---

## Features

- **Admin Portal** — manage students, teachers, courses, system settings
- **Teacher Portal** — mark attendance, enter marks, manage assignments & materials
- **Student Portal** — view courses, attendance, marks, assignments
- **Forgot Password** — OTP-based reset via email (role-validated)
- **Maintenance Mode** — admin can lock the platform
- **Bulk Import** — CSV upload for students and teachers
- **43 Playwright E2E tests** covering all major flows

---

## Project Structure

```
EduTrack/
├── EduTrack-Backend/        # Spring Boot REST API (port 8080)
├── EduTrack-Frontend/       # React app (port 3000)
│   └── tests/e2e/           # Playwright test suite
├── EduTrack-Database/       # MySQL schema
└── docs/                    # Screenshots & design documents
```

---

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8+

---

### 1. Database Setup

```sql
CREATE DATABASE edutrack;
```

Then import the schema:
```bash
mysql -u root -p edutrack < EduTrack-Database/Schema.sql
```

---

### 2. Backend Setup

```bash
cd EduTrack-Backend/src/main/resources
cp application.properties.template application.properties
```

Edit `application.properties` and fill in:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.mail.username=YOUR_GMAIL@gmail.com
spring.mail.password=YOUR_GMAIL_APP_PASSWORD
```

> Gmail App Password: Google Account → Security → 2-Step Verification → App Passwords

```bash
cd EduTrack-Backend
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`

**Default admin credentials (auto-created on first run):**
- Email: `admin@edutrack.com`
- Password: `Admin@123`

---

### 3. Frontend Setup

```bash
cd EduTrack-Frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`

---

### 4. Running Tests

Ensure both backend and frontend are running, then:

```bash
cd EduTrack-Frontend
npx playwright install chromium   # first time only
npx playwright test               # run all 43 tests
npx playwright show-report        # view HTML report
```

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login/admin` | Admin login |
| POST | `/api/auth/login/student` | Student login |
| POST | `/api/auth/login/teacher` | Teacher login |
| POST | `/api/otp/forgot-password` | Send OTP (role-validated) |
| GET | `/api/students` | List all students |
| GET | `/api/teachers` | List all teachers |
| GET | `/api/courses` | List all courses |
| GET | `/api/system/settings` | System settings |

---

## Team

**VTU Internship 2026 — Team 15**  
Java Full Stack Track

---

## License

MIT
