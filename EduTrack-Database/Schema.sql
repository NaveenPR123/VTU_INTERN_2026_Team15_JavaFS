-- ============================================================
--  EduTrack Database Schema
--  Run this on a fresh MySQL instance
--  No dummy data — the app seeds the default admin on startup
-- ============================================================

CREATE DATABASE IF NOT EXISTS edutrack;
USE edutrack;

-- ── Admins ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
    admin_id  INT          NOT NULL AUTO_INCREMENT,
    name      VARCHAR(100) NOT NULL,
    email     VARCHAR(100) NOT NULL UNIQUE,
    password  VARCHAR(255) NOT NULL,
    PRIMARY KEY (admin_id)
);

-- ── Teachers ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teachers (
    teacher_id  INT          NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    phone       VARCHAR(15),
    department  VARCHAR(100) NOT NULL,
    employee_id VARCHAR(50)  UNIQUE,
    status      VARCHAR(20)  NOT NULL DEFAULT 'Active',
    PRIMARY KEY (teacher_id)
);

-- ── Students ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
    student_id  INT          NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    phone       VARCHAR(15),
    usn         VARCHAR(50)  UNIQUE,
    department  VARCHAR(100) NOT NULL,
    year        VARCHAR(20)  NOT NULL,
    semester    VARCHAR(20),
    status      VARCHAR(20)  NOT NULL DEFAULT 'Active',
    course_id   INT,
    PRIMARY KEY (student_id)
);

-- ── Courses ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
    course_id   INT          NOT NULL AUTO_INCREMENT,
    course_name VARCHAR(150) NOT NULL,
    credits     INT          NOT NULL DEFAULT 3,
    teacher_id  INT          NOT NULL,
    PRIMARY KEY (course_id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE
);

-- ── Attendance ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attendance (
    attendance_id   INT         NOT NULL AUTO_INCREMENT,
    student_id      INT         NOT NULL,
    course_id       INT         NOT NULL,
    attendance_date DATE        NOT NULL,
    status          VARCHAR(10) NOT NULL DEFAULT 'Present',
    PRIMARY KEY (attendance_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id)  REFERENCES courses(course_id)   ON DELETE CASCADE
);

-- ── Assignments ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assignments (
    assignment_id INT          NOT NULL AUTO_INCREMENT,
    course_id     INT          NOT NULL,
    title         VARCHAR(200) NOT NULL,
    description   TEXT,
    due_date      DATE         NOT NULL,
    PRIMARY KEY (assignment_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- ── Submissions ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS submissions (
    submission_id  INT          NOT NULL AUTO_INCREMENT,
    assignment_id  INT          NOT NULL,
    student_id     INT          NOT NULL,
    submitted_at   DATETIME     NOT NULL,
    file_url       VARCHAR(500),
    status         VARCHAR(20)  NOT NULL DEFAULT 'Submitted',
    grade          VARCHAR(10),
    feedback       TEXT,
    PRIMARY KEY (submission_id),
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id)    REFERENCES students(student_id)       ON DELETE CASCADE
);

-- ── Marks ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS marks (
    mark_id    INT         NOT NULL AUTO_INCREMENT,
    student_id INT         NOT NULL,
    course_id  INT         NOT NULL,
    marks      INT         NOT NULL DEFAULT 0,
    grade      VARCHAR(5)  NOT NULL DEFAULT 'N/A',
    PRIMARY KEY (mark_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id)  REFERENCES courses(course_id)   ON DELETE CASCADE
);

-- ── Course Materials ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS course_materials (
    material_id  INT          NOT NULL AUTO_INCREMENT,
    course_id    INT          NOT NULL,
    title        VARCHAR(200) NOT NULL,
    material_url VARCHAR(500) NOT NULL,
    uploaded_at  DATETIME     NOT NULL,
    PRIMARY KEY (material_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- ── OTP Verification ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS otp_verification (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    email       VARCHAR(100) NOT NULL,
    otp         VARCHAR(6)   NOT NULL,
    expiry_time DATETIME     NOT NULL,
    used        BOOLEAN      NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id)
);

-- ── System Settings ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS system_settings (
    id                INT          NOT NULL,
    active_year       VARCHAR(20)  NOT NULL DEFAULT '2025-26',
    active_semester   VARCHAR(20)  NOT NULL DEFAULT 'Even',
    maintenance_mode  BOOLEAN      NOT NULL DEFAULT FALSE,
    registration_open BOOLEAN      NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id)
);
