-- ============================================================
--  EduTrack Database Schema
--  Run this on a fresh MySQL install
-- ============================================================

CREATE DATABASE IF NOT EXISTS edutrack;
USE edutrack;

-- ── Teachers ─────────────────────────────────────────────────
CREATE TABLE teachers (
    teacher_id  INT          NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    department  VARCHAR(100) NOT NULL,
    PRIMARY KEY (teacher_id)
);

-- ── Courses ──────────────────────────────────────────────────
CREATE TABLE courses (
    course_id   INT          NOT NULL AUTO_INCREMENT,
    course_name VARCHAR(150) NOT NULL,
    credits     INT          NOT NULL DEFAULT 3,
    teacher_id  INT          NOT NULL,
    PRIMARY KEY (course_id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE
);

-- ── Students ─────────────────────────────────────────────────
CREATE TABLE students (
    student_id  INT          NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    phone       VARCHAR(15),
    department  VARCHAR(100) NOT NULL,
    year        VARCHAR(20)  NOT NULL,
    PRIMARY KEY (student_id)
);

-- ── Admins ───────────────────────────────────────────────────
CREATE TABLE admins (
    admin_id  INT          NOT NULL AUTO_INCREMENT,
    name      VARCHAR(100) NOT NULL,
    email     VARCHAR(100) NOT NULL UNIQUE,
    password  VARCHAR(255) NOT NULL,
    PRIMARY KEY (admin_id)
);

-- ── Attendance ───────────────────────────────────────────────
CREATE TABLE attendance (
    attendance_id   INT         NOT NULL AUTO_INCREMENT,
    student_id      INT         NOT NULL,
    course_id       INT         NOT NULL,
    attendance_date DATE        NOT NULL,
    status          VARCHAR(10) NOT NULL DEFAULT 'Present',
    PRIMARY KEY (attendance_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id)  REFERENCES courses(course_id)   ON DELETE CASCADE
);

-- ── Assignments ──────────────────────────────────────────────
CREATE TABLE assignments (
    assignment_id INT          NOT NULL AUTO_INCREMENT,
    course_id     INT          NOT NULL,
    title         VARCHAR(200) NOT NULL,
    description   TEXT,
    due_date      DATE         NOT NULL,
    PRIMARY KEY (assignment_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- ── Marks ────────────────────────────────────────────────────
CREATE TABLE marks (
    mark_id    INT         NOT NULL AUTO_INCREMENT,
    student_id INT         NOT NULL,
    course_id  INT         NOT NULL,
    marks      INT         NOT NULL DEFAULT 0,
    grade      VARCHAR(5)  NOT NULL DEFAULT 'N/A',
    PRIMARY KEY (mark_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id)  REFERENCES courses(course_id)   ON DELETE CASCADE
);

-- ── OTP Verification ─────────────────────────────────────────
CREATE TABLE otp_verification (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    email       VARCHAR(100) NOT NULL,
    otp         VARCHAR(6)   NOT NULL,
    expiry_time DATETIME     NOT NULL,
    used        BOOLEAN      NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id)
);


-- ============================================================
--  Sample Data
--  All passwords are BCrypt hash of: Test@123
--  Admin password is BCrypt hash of: Admin@123
-- ============================================================

-- ── Teachers (password: Test@123) ────────────────────────────
INSERT INTO teachers (name, email, password, department) VALUES
('Prof. R. Sharma',  'sharma@college.edu',   '$2a$10$8K1p/a0dR1xqM2LfU7bvdOWrX9Z1mN3kP5qY7tH2jL4nM6oQ8sV0e', 'Computer Science and Engineering'),
('Prof. K. Menon',   'menon@college.edu',    '$2a$10$8K1p/a0dR1xqM2LfU7bvdOWrX9Z1mN3kP5qY7tH2jL4nM6oQ8sV0e', 'Computer Science and Engineering'),
('Prof. A. Iyer',    'iyer@college.edu',     '$2a$10$8K1p/a0dR1xqM2LfU7bvdOWrX9Z1mN3kP5qY7tH2jL4nM6oQ8sV0e', 'Mathematics'),
('Dr. S. Nair',      'nair@college.edu',     '$2a$10$8K1p/a0dR1xqM2LfU7bvdOWrX9Z1mN3kP5qY7tH2jL4nM6oQ8sV0e', 'Computer Science and Engineering'),
('Prof. P. Reddy',   'reddy@college.edu',    '$2a$10$8K1p/a0dR1xqM2LfU7bvdOWrX9Z1mN3kP5qY7tH2jL4nM6oQ8sV0e', 'Computer Science and Engineering'),
('Dr. M. Krishnan',  'krishnan@college.edu', '$2a$10$8K1p/a0dR1xqM2LfU7bvdOWrX9Z1mN3kP5qY7tH2jL4nM6oQ8sV0e', 'Computer Science and Engineering');

-- ── Courses ──────────────────────────────────────────────────
INSERT INTO courses (course_name, credits, teacher_id) VALUES
('Data Structures',       4, 1),
('Operating Systems',     3, 2),
('Discrete Mathematics',  4, 3),
('Computer Networks',     3, 4),
('Database Systems',      3, 5),
('Software Engineering',  2, 6);

-- ── Students (password: Test@123) ────────────────────────────
INSERT INTO students (name, email, password, phone, department, year) VALUES
('Arjun Kumar',   'arjun@college.edu',  '$2a$10$8K1p/a0dR1xqM2LfU7bvdOWrX9Z1mN3kP5qY7tH2jL4nM6oQ8sV0e', '9876543210', 'Computer Science and Engineering', '3rd Year'),
('Priya Sharma',  'priya@college.edu',  '$2a$10$8K1p/a0dR1xqM2LfU7bvdOWrX9Z1mN3kP5qY7tH2jL4nM6oQ8sV0e', '9876543211', 'Computer Science and Engineering', '3rd Year'),
('Ravi Teja',     'ravi@college.edu',   '$2a$10$8K1p/a0dR1xqM2LfU7bvdOWrX9Z1mN3kP5qY7tH2jL4nM6oQ8sV0e', '9876543212', 'Computer Science and Engineering', '3rd Year'),
('Sneha Reddy',   'sneha@college.edu',  '$2a$10$8K1p/a0dR1xqM2LfU7bvdOWrX9Z1mN3kP5qY7tH2jL4nM6oQ8sV0e', '9876543213', 'Computer Science and Engineering', '3rd Year'),
('Kiran Menon',   'kiran@college.edu',  '$2a$10$8K1p/a0dR1xqM2LfU7bvdOWrX9Z1mN3kP5qY7tH2jL4nM6oQ8sV0e', '9876543214', 'Computer Science and Engineering', '3rd Year'),
('Divya Iyer',    'divya@college.edu',  '$2a$10$8K1p/a0dR1xqM2LfU7bvdOWrX9Z1mN3kP5qY7tH2jL4nM6oQ8sV0e', '9876543215', 'Computer Science and Engineering', '3rd Year'),
('Rahul Verma',   'rahul@college.edu',  '$2a$10$8K1p/a0dR1xqM2LfU7bvdOWrX9Z1mN3kP5qY7tH2jL4nM6oQ8sV0e', '9876543216', 'Information Science','2nd Year'),
('Anjali Singh',  'anjali@college.edu', '$2a$10$8K1p/a0dR1xqM2LfU7bvdOWrX9Z1mN3kP5qY7tH2jL4nM6oQ8sV0e', '9876543217', 'Information Science','2nd Year');

-- ── Admin (password: Admin@123) ───────────────────────────────
INSERT INTO admins (name, email, password) VALUES
('Admin', 'admin@edutrack.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi');

-- ── Attendance (student 1 across all 6 courses, ~25 classes each) ──
INSERT INTO attendance (student_id, course_id, attendance_date, status) VALUES
-- Student 1 (Arjun) - Course 1 (Data Structures) - 23/25 present
(1,1,'2026-01-05','Present'),(1,1,'2026-01-07','Present'),(1,1,'2026-01-09','Present'),
(1,1,'2026-01-12','Present'),(1,1,'2026-01-14','Present'),(1,1,'2026-01-16','Absent'),
(1,1,'2026-01-19','Present'),(1,1,'2026-01-21','Present'),(1,1,'2026-01-23','Present'),
(1,1,'2026-01-26','Present'),(1,1,'2026-01-28','Present'),(1,1,'2026-01-30','Present'),
(1,1,'2026-02-02','Present'),(1,1,'2026-02-04','Present'),(1,1,'2026-02-06','Present'),
(1,1,'2026-02-09','Present'),(1,1,'2026-02-11','Absent'), (1,1,'2026-02-13','Present'),
(1,1,'2026-02-16','Present'),(1,1,'2026-02-18','Present'),(1,1,'2026-02-20','Present'),
(1,1,'2026-02-23','Present'),(1,1,'2026-02-25','Present'),(1,1,'2026-02-27','Present'),
(1,1,'2026-03-02','Present'),
-- Student 1 - Course 2 (Operating Systems) - 21/25 present
(1,2,'2026-01-06','Present'),(1,2,'2026-01-08','Present'),(1,2,'2026-01-10','Absent'),
(1,2,'2026-01-13','Present'),(1,2,'2026-01-15','Present'),(1,2,'2026-01-17','Present'),
(1,2,'2026-01-20','Absent'), (1,2,'2026-01-22','Present'),(1,2,'2026-01-24','Present'),
(1,2,'2026-01-27','Present'),(1,2,'2026-01-29','Present'),(1,2,'2026-01-31','Present'),
(1,2,'2026-02-03','Present'),(1,2,'2026-02-05','Absent'), (1,2,'2026-02-07','Present'),
(1,2,'2026-02-10','Present'),(1,2,'2026-02-12','Present'),(1,2,'2026-02-14','Absent'),
(1,2,'2026-02-17','Present'),(1,2,'2026-02-19','Present'),(1,2,'2026-02-21','Present'),
(1,2,'2026-02-24','Present'),(1,2,'2026-02-26','Present'),(1,2,'2026-02-28','Present'),
(1,2,'2026-03-03','Present'),
-- Student 1 - Course 3 (Discrete Mathematics) - 20/25 present
(1,3,'2026-01-05','Present'),(1,3,'2026-01-08','Absent'), (1,3,'2026-01-12','Present'),
(1,3,'2026-01-15','Present'),(1,3,'2026-01-19','Present'),(1,3,'2026-01-22','Absent'),
(1,3,'2026-01-26','Present'),(1,3,'2026-01-29','Present'),(1,3,'2026-02-02','Present'),
(1,3,'2026-02-05','Present'),(1,3,'2026-02-09','Absent'), (1,3,'2026-02-12','Present'),
(1,3,'2026-02-16','Present'),(1,3,'2026-02-19','Present'),(1,3,'2026-02-23','Absent'),
(1,3,'2026-02-26','Present'),(1,3,'2026-03-02','Present'),(1,3,'2026-03-05','Present'),
(1,3,'2026-03-09','Present'),(1,3,'2026-03-12','Present'),(1,3,'2026-03-16','Absent'),
(1,3,'2026-03-19','Present'),(1,3,'2026-03-23','Present'),(1,3,'2026-03-26','Present'),
(1,3,'2026-03-30','Present'),
-- Student 1 - Course 4 (Computer Networks) - 18/24 present
(1,4,'2026-01-06','Present'),(1,4,'2026-01-09','Absent'), (1,4,'2026-01-13','Present'),
(1,4,'2026-01-16','Absent'), (1,4,'2026-01-20','Present'),(1,4,'2026-01-23','Present'),
(1,4,'2026-01-27','Absent'), (1,4,'2026-01-30','Present'),(1,4,'2026-02-03','Present'),
(1,4,'2026-02-06','Present'),(1,4,'2026-02-10','Absent'), (1,4,'2026-02-13','Present'),
(1,4,'2026-02-17','Present'),(1,4,'2026-02-20','Absent'), (1,4,'2026-02-24','Present'),
(1,4,'2026-02-27','Present'),(1,4,'2026-03-03','Present'),(1,4,'2026-03-06','Absent'),
(1,4,'2026-03-10','Present'),(1,4,'2026-03-13','Present'),(1,4,'2026-03-17','Present'),
(1,4,'2026-03-20','Present'),(1,4,'2026-03-24','Present'),(1,4,'2026-03-27','Present'),
-- Student 1 - Course 5 (Database Systems) - 22/25 present
(1,5,'2026-01-07','Present'),(1,5,'2026-01-10','Present'),(1,5,'2026-01-14','Present'),
(1,5,'2026-01-17','Absent'), (1,5,'2026-01-21','Present'),(1,5,'2026-01-24','Present'),
(1,5,'2026-01-28','Present'),(1,5,'2026-01-31','Present'),(1,5,'2026-02-04','Present'),
(1,5,'2026-02-07','Present'),(1,5,'2026-02-11','Present'),(1,5,'2026-02-14','Present'),
(1,5,'2026-02-18','Present'),(1,5,'2026-02-21','Absent'), (1,5,'2026-02-25','Present'),
(1,5,'2026-02-28','Present'),(1,5,'2026-03-04','Present'),(1,5,'2026-03-07','Present'),
(1,5,'2026-03-11','Present'),(1,5,'2026-03-14','Present'),(1,5,'2026-03-18','Present'),
(1,5,'2026-03-21','Present'),(1,5,'2026-03-25','Absent'), (1,5,'2026-03-28','Present'),
(1,5,'2026-04-01','Present'),
-- Student 1 - Course 6 (Software Engineering) - 24/25 present
(1,6,'2026-01-05','Present'),(1,6,'2026-01-09','Present'),(1,6,'2026-01-13','Present'),
(1,6,'2026-01-17','Present'),(1,6,'2026-01-21','Present'),(1,6,'2026-01-25','Present'),
(1,6,'2026-01-29','Present'),(1,6,'2026-02-02','Present'),(1,6,'2026-02-06','Present'),
(1,6,'2026-02-10','Present'),(1,6,'2026-02-14','Present'),(1,6,'2026-02-18','Present'),
(1,6,'2026-02-22','Present'),(1,6,'2026-02-26','Absent'), (1,6,'2026-03-02','Present'),
(1,6,'2026-03-06','Present'),(1,6,'2026-03-10','Present'),(1,6,'2026-03-14','Present'),
(1,6,'2026-03-18','Present'),(1,6,'2026-03-22','Present'),(1,6,'2026-03-26','Present'),
(1,6,'2026-03-30','Present'),(1,6,'2026-04-03','Present'),(1,6,'2026-04-07','Present'),
(1,6,'2026-04-09','Present'),
-- Student 2 (Priya) - Course 1 - 24/25
(2,1,'2026-01-05','Present'),(2,1,'2026-01-07','Present'),(2,1,'2026-01-09','Present'),
(2,1,'2026-01-12','Present'),(2,1,'2026-01-14','Present'),(2,1,'2026-01-16','Present'),
(2,1,'2026-01-19','Present'),(2,1,'2026-01-21','Present'),(2,1,'2026-01-23','Present'),
(2,1,'2026-01-26','Present'),(2,1,'2026-01-28','Present'),(2,1,'2026-01-30','Present'),
(2,1,'2026-02-02','Present'),(2,1,'2026-02-04','Present'),(2,1,'2026-02-06','Present'),
(2,1,'2026-02-09','Present'),(2,1,'2026-02-11','Present'),(2,1,'2026-02-13','Present'),
(2,1,'2026-02-16','Present'),(2,1,'2026-02-18','Present'),(2,1,'2026-02-20','Present'),
(2,1,'2026-02-23','Present'),(2,1,'2026-02-25','Present'),(2,1,'2026-02-27','Absent'),
(2,1,'2026-03-02','Present'),
-- Student 3 (Ravi) - Course 1 - 18/25 (below 75%, warn)
(3,1,'2026-01-05','Present'),(3,1,'2026-01-07','Absent'), (3,1,'2026-01-09','Absent'),
(3,1,'2026-01-12','Present'),(3,1,'2026-01-14','Absent'), (3,1,'2026-01-16','Present'),
(3,1,'2026-01-19','Present'),(3,1,'2026-01-21','Absent'), (3,1,'2026-01-23','Present'),
(3,1,'2026-01-26','Present'),(3,1,'2026-01-28','Present'),(3,1,'2026-01-30','Absent'),
(3,1,'2026-02-02','Present'),(3,1,'2026-02-04','Present'),(3,1,'2026-02-06','Absent'),
(3,1,'2026-02-09','Present'),(3,1,'2026-02-11','Present'),(3,1,'2026-02-13','Present'),
(3,1,'2026-02-16','Absent'), (3,1,'2026-02-18','Present'),(3,1,'2026-02-20','Present'),
(3,1,'2026-02-23','Present'),(3,1,'2026-02-25','Present'),(3,1,'2026-02-27','Present'),
(3,1,'2026-03-02','Present');

-- ── Assignments ──────────────────────────────────────────────
INSERT INTO assignments (course_id, title, description, due_date) VALUES
(1, 'Linked List Implementation',        'Implement singly and doubly linked lists in Java',       '2026-03-13'),
(1, 'Binary Search Tree Coding',         'Implement BST with insert, delete, search operations',   '2026-03-09'),
(2, 'Process Scheduling Report',         'Compare FCFS, SJF and Round Robin algorithms',           '2026-03-18'),
(3, 'Graph Theory Problem Set',          'Solve 10 problems on graph traversal',                   '2026-03-21'),
(4, 'OSI Model Presentation',            'Create slides explaining all 7 OSI layers',              '2026-03-13'),
(5, 'ER Diagram for Library System',     'Design complete ER diagram for a library system',        '2026-03-02'),
(6, 'Software Requirement Specification','Write SRS document for a hospital management system',    '2026-03-23');

-- ── Marks (student 1 across all 6 courses) ───────────────────
INSERT INTO marks (student_id, course_id, marks, grade) VALUES
(1, 1, 91, 'O'),
(1, 2, 84, 'A+'),
(1, 3, 76, 'A'),
(1, 4, 88, 'A+'),
(1, 5, 79, 'A'),
(1, 6, 92, 'O'),
(2, 1, 88, 'A+'),
(2, 2, 74, 'A'),
(3, 1, 65, 'B+'),
(3, 3, 92, 'O');
