# EduTrack — Deployment Guide

**Project:** EduTrack Academic Management Platform  
**Team:** VTU Internship 2026 — Team 15  
**Date:** April 2026

---

## Overview

EduTrack is deployed across three cloud platforms:

| Component | Platform | URL |
|---|---|---|
| Frontend (React) | Vercel | https://vtu-intern-2026-team15-java-fs.vercel.app |
| Backend (Spring Boot) | Render | https://edutrack-backend-o1ym.onrender.com |
| Database (MySQL) | Railway | hopper.proxy.rlwy.net:12491 |

---

## Prerequisites

- GitHub account with the repository pushed
- Railway account (https://railway.app) — sign up with GitHub
- Render account (https://render.com) — sign up with GitHub
- Vercel account (https://vercel.com) — sign up with GitHub
- Gmail account with App Password configured

---

## Part 1 — Database Deployment (Railway)

### Step 1 — Create Railway Project

1. Go to https://railway.app
2. Click **New Project**
3. Select **Database** → **MySQL**
4. Railway creates a MySQL 9.4 instance automatically
5. Wait for status to show **Online**

### Step 2 — Get Connection Details

1. Click the MySQL service → **Variables** tab
2. Note down:
   - `MYSQL_PUBLIC_URL` — full connection string
   - `MYSQLHOST` — internal hostname
   - `MYSQLPASSWORD` — root password
   - `MYSQLPORT` — public port

### Step 3 — Import Schema

1. Open **MySQL Workbench**
2. Create new connection:
   - Hostname: value from `MYSQL_PUBLIC_URL` (after `@`, before `:`)
   - Port: port number from `MYSQL_PUBLIC_URL`
   - Username: `root`
   - Password: `MYSQLPASSWORD` value
3. Click **Continue Anyway** if version warning appears
4. File → **Open SQL Script** → select `EduTrack-Database/Schema.sql`
5. Click the **lightning bolt** ⚡ to execute
6. All 11 tables are created

---

## Part 2 — Backend Deployment (Render)

### Step 1 — Create Dockerfile

The `Dockerfile` is already in `EduTrack-Backend/`:

```dockerfile
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/edutrack-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Step 2 — Create Web Service on Render

1. Go to https://render.com → **New +** → **Web Service**
2. Connect GitHub → select `VTU_INTERN_2026_Team15_JavaFS`
3. Configure:
   - **Name**: `edutrack-backend`
   - **Language**: `Docker`
   - **Root Directory**: `EduTrack-Backend`
   - **Dockerfile Path**: `./Dockerfile`
   - **Instance Type**: `Free`

### Step 3 — Add Environment Variables

In Render → **Environment** tab, add:

| Key | Value |
|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://hopper.proxy.rlwy.net:12491/railway?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true` |
| `SPRING_DATASOURCE_USERNAME` | `root` |
| `SPRING_DATASOURCE_PASSWORD` | Railway MySQL password |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` |
| `SPRING_MAIL_HOST` | `smtp.gmail.com` |
| `SPRING_MAIL_PORT` | `587` |
| `SPRING_MAIL_USERNAME` | your Gmail address |
| `SPRING_MAIL_PASSWORD` | Gmail App Password (16 chars) |
| `SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH` | `true` |
| `SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE` | `true` |

### Step 4 — Deploy

1. Click **Create Web Service**
2. Render builds the Docker image (takes 5-10 minutes)
3. Watch logs for: `Started EduTrackApplication`
4. Backend URL: `https://edutrack-backend-o1ym.onrender.com`

### Step 5 — Verify

Open in browser:
```
https://edutrack-backend-o1ym.onrender.com/api/system/settings
```
Should return:
```json
{"id":1,"activeYear":"2025-26","activeSemester":"Even","maintenanceMode":false,"registrationOpen":true}
```

> **Note:** Render free tier sleeps after 15 minutes of inactivity. First request after sleep takes ~50 seconds. Always wake up the backend before a demo by opening the above URL.

---

## Part 3 — Frontend Deployment (Vercel)

### Step 1 — Create Project on Vercel

1. Go to https://vercel.com → **Add New** → **Project**
2. Import `VTU_INTERN_2026_Team15_JavaFS` from GitHub
3. Configure:
   - **Root Directory**: `EduTrack-Frontend`
   - **Framework Preset**: `Create React App` (auto-detected)

### Step 2 — Add Environment Variables

Before clicking Deploy, add:

| Key | Value |
|---|---|
| `REACT_APP_API_URL` | `https://edutrack-backend-o1ym.onrender.com` |
| `DISABLE_ESLINT_PLUGIN` | `true` |

### Step 3 — Deploy

1. Click **Deploy**
2. Vercel builds the React app (takes ~2 minutes)
3. Frontend URL: `https://vtu-intern-2026-team15-java-fs.vercel.app`

### Step 4 — Verify

Open the frontend URL in browser and try logging in:
- Email: `admin@edutrack.com`
- Password: `Admin@123`

---

## Part 4 — Gmail App Password Setup

Required for OTP email delivery:

1. Go to https://myaccount.google.com
2. Click **Security**
3. Enable **2-Step Verification** (must be ON)
4. Search **App Passwords**
5. Select app: **Mail**, device: **Other** → type "EduTrack"
6. Click **Generate**
7. Copy the **16-character password**
8. Use this as `SPRING_MAIL_PASSWORD` in Render environment variables

---

## Part 5 — Auto-Deploy on Code Push

Both Render and Vercel are connected to GitHub and auto-deploy on every push to `main`:

```
git add .
git commit -m "your changes"
git push
```

- Vercel rebuilds the frontend automatically (~2 min)
- Render rebuilds the Docker image automatically (~5-10 min)

---

## Part 6 — CORS Configuration

The backend allows requests from any origin for production:

```java
// SecurityConfig.java
config.setAllowedOriginPatterns(List.of("*"));
```

All controllers use:
```java
@CrossOrigin(origins = "*")
```

This ensures the Vercel frontend can communicate with the Render backend.

---

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| "Cannot connect to server" | Backend is sleeping | Open backend URL and wait 50 seconds |
| "Access denied for user root" | Wrong DB password | Check `SPRING_DATASOURCE_PASSWORD` in Render |
| Build failed on Render | Java version mismatch | Ensure Dockerfile uses `eclipse-temurin:21` |
| ESLint errors on Vercel | CI treats warnings as errors | Add `DISABLE_ESLINT_PLUGIN=true` in Vercel env vars |
| CORS error in browser | Origin not allowed | Check `@CrossOrigin(origins = "*")` on all controllers |
| OTP email not received | Wrong Gmail App Password | Regenerate App Password and update Render env var |

---

## Live URLs

| Service | URL |
|---|---|
| Frontend | https://vtu-intern-2026-team15-java-fs.vercel.app |
| Backend | https://edutrack-backend-o1ym.onrender.com |
| Backend Health | https://edutrack-backend-o1ym.onrender.com/api/health/db |
| GitHub | https://github.com/NaveenPR123/VTU_INTERN_2026_Team15_JavaFS |

---

*EduTrack — VTU Internship 2026, Team 15*
