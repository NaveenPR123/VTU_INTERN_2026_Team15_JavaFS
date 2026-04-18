# EduTrack — Academic Management Platform

A full-stack academic platform for students, teachers, and admins.

**Stack:** React (frontend) · Spring Boot (backend) · MySQL (database)

---

## Prerequisites

Make sure you have these installed:
- Java 17+
- Maven
- Node.js 18+
- MySQL 8+

---

## Setup — Backend

**1. Clone the repo**
```bash
git clone https://github.com/NaveenPR123/VTU_INTERN_2026_Team15_JavaFS.git
cd VTU_INTERN_2026_Team15_JavaFS
```

**2. Create the database**
```sql
CREATE DATABASE edutrack;
```

**3. Configure application.properties**
```bash
cd EduTrack-Backend/src/main/resources
cp application.properties.template application.properties
```
Open `application.properties` and fill in:
- `spring.datasource.password` → your MySQL root password
- `spring.mail.username` → your Gmail address
- `spring.mail.password` → your Gmail App Password (not your Gmail login password)

> To get a Gmail App Password: Google Account → Security → 2-Step Verification → App Passwords

**4. Run the backend**
```bash
cd EduTrack-Backend
mvn spring-boot:run
```
Backend runs on `http://localhost:8080`

Default admin account is created automatically:
- Email: `admin@edutrack.com`
- Password: `Admin@123`

---

## Setup — Frontend

**1. Install dependencies**
```bash
cd EduTrack-Frontend
npm install
```

**2. Start the frontend**
```bash
npm start
```
Frontend runs on `http://localhost:3000`

---

## Running Tests (Playwright)

Make sure both backend and frontend are running, then:

```bash
cd EduTrack-Frontend

# First time only — install browser
npx playwright install chromium

# Run all tests
npx playwright test

# View HTML report
npx playwright show-report
```

---

## Project Structure

```
EduTrack/
├── EduTrack-Backend/     # Spring Boot REST API
├── EduTrack-Frontend/    # React app
│   └── tests/e2e/        # Playwright tests
└── EduTrack-Database/    # SQL schema
```
