cat > EduTrack-Backend/schema.sql << 'EOF'
CREATE DATABASE IF NOT EXISTS edutrack;
USE edutrack;

CREATE TABLE teachers (
    teacher_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    PRIMARY KEY (teacher_id)
);

CREATE TABLE courses (
    course_id INT NOT NULL AUTO_INCREMENT,
    course_name VARCHAR(150) NOT NULL,
    credits INT NOT NULL DEFAULT 3,
    teacher_id INT NOT NULL,
    PRIMARY KEY (course_id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

CREATE TABLE students (
    student_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    department VARCHAR(100) NOT NULL,
    year VARCHAR(20) NOT NULL,
    course_id INT,
    PRIMARY KEY (student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE attendance (
    attendance_id INT NOT NULL AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'Present',
    PRIMARY KEY (attendance_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE assignments (
    assignment_id INT NOT NULL AUTO_INCREMENT,
    course_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    PRIMARY KEY (assignment_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE marks (
    mark_id INT NOT NULL AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    marks INT NOT NULL DEFAULT 0,
    grade VARCHAR(5) NOT NULL DEFAULT 'N/A',
    PRIMARY KEY (mark_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE otp_verification (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    email       VARCHAR(100) NOT NULL,
    otp         VARCHAR(6)   NOT NULL,
    expiry_time DATETIME     NOT NULL,
    used        BOOLEAN      NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id)
);

-- ============================================================
--  Sample Data for Testing
-- ============================================================

-- Teachers
INSERT INTO teachers (name, email, password, department) VALUES
('Prof. R. Sharma',  'sharma@college.edu',   '$2a$10$examplehash1', 'Computer Science'),
('Prof. K. Menon',   'menon@college.edu',    '$2a$10$examplehash2', 'Computer Science'),
('Prof. A. Iyer',    'iyer@college.edu',     '$2a$10$examplehash3', 'Mathematics'),
('Dr. S. Nair',      'nair@college.edu',     '$2a$10$examplehash4', 'Computer Science'),
('Prof. P. Reddy',   'reddy@college.edu',    '$2a$10$examplehash5', 'Computer Science'),
('Dr. M. Krishnan',  'krishnan@college.edu', '$2a$10$examplehash6', 'Computer Science');

-- Courses
INSERT INTO courses (course_name, credits, teacher_id) VALUES
('Data Structures',       4, 1),
('Operating Systems',     3, 2),
('Discrete Mathematics',  4, 3),
('Computer Networks',     3, 4),
('Database Systems',      3, 5),
('Software Engineering',  2, 6);

-- Students
INSERT INTO students (name, email, password, phone, department, year, course_id) VALUES
('Arjun Kumar',  'arjun@college.edu',  '$2a$10$studenthash1', '9876543210', 'Computer Science', '3rd Year', 1),
('Priya Sharma', 'priya@college.edu',  '$2a$10$studenthash2', '9876543211', 'Computer Science', '3rd Year', 1),
('Ravi Teja',    'ravi@college.edu',   '$2a$10$studenthash3', '9876543212', 'Computer Science', '3rd Year', 2),
('Sneha Reddy',  'sneha@college.edu',  '$2a$10$studenthash4', '9876543213', 'Computer Science', '3rd Year', 2),
('Kiran Menon',  'kiran@college.edu',  '$2a$10$studenthash5', '9876543214', 'Computer Science', '3rd Year', 3),
('Divya Iyer',   'divya@college.edu',  '$2a$10$studenthash6', '9876543215', 'Computer Science', '3rd Year', 3);

-- Attendance
INSERT INTO attendance (student_id, course_id, attendance_date, status) VALUES
(1, 1, '2026-03-10', 'Present'),
(1, 1, '2026-03-11', 'Present'),
(1, 1, '2026-03-12', 'Absent'),
(1, 2, '2026-03-10', 'Present'),
(2, 1, '2026-03-10', 'Present'),
(2, 1, '2026-03-11', 'Present');

-- Assignments
INSERT INTO assignments (course_id, title, description, due_date) VALUES
(1, 'Linked List Implementation',       'Implement singly and doubly linked lists in Java', '2026-03-13'),
(2, 'Process Scheduling Report',        'Compare FCFS, SJF and Round Robin algorithms',     '2026-03-18'),
(3, 'Graph Theory Problem Set',         'Solve 10 problems on graph traversal',              '2026-03-21'),
(4, 'OSI Model Presentation',           'Create slides explaining all 7 OSI layers',         '2026-03-13'),
(5, 'ER Diagram for Library System',    'Design complete ER diagram',                        '2026-03-02'),
(6, 'Software Requirement Specification','Write SRS document for a hospital system',         '2026-03-23');

-- Marks
INSERT INTO marks (student_id, course_id, marks, grade) VALUES
(1, 1, 91, 'O'),
(1, 2, 84, 'A+'),
(1, 3, 76, 'A'),
(2, 1, 88, 'A+'),
(2, 2, 79, 'A'),
(3, 3, 92, 'O');

EOF
