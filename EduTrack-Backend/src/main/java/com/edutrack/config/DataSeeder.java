package com.edutrack.config;

import com.edutrack.entity.*;
import com.edutrack.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * Seeds sample teachers, students, courses, assignments, marks, and attendance
 * on first run. Skips if data already exists.
 * All sample passwords: Test@123
 */
@Component
@Order(2)  // runs after AdminSeeder (Order 1 by default)
public class DataSeeder implements ApplicationRunner {

    @Autowired private TeacherRepository    teacherRepo;
    @Autowired private StudentRepository    studentRepo;
    @Autowired private CourseRepository     courseRepo;
    @Autowired private AssignmentRepository assignmentRepo;
    @Autowired private MarksRepository      marksRepo;
    @Autowired private AttendanceRepository attendanceRepo;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private static final String PWD = "Test@123";

    @Override
    public void run(ApplicationArguments args) {
        if (teacherRepo.count() > 0) {
            System.out.println("[SEEDER] Sample data already exists, skipping.");
            return;
        }

        // ── Teachers ──────────────────────────────────────────
        Teacher t1 = save(new Teacher(null, "Prof. R. Sharma",  "sharma@college.edu",   encoder.encode(PWD), "Computer Science"));
        Teacher t2 = save(new Teacher(null, "Prof. K. Menon",   "menon@college.edu",    encoder.encode(PWD), "Computer Science"));
        Teacher t3 = save(new Teacher(null, "Prof. A. Iyer",    "iyer@college.edu",     encoder.encode(PWD), "Mathematics"));
        Teacher t4 = save(new Teacher(null, "Dr. S. Nair",      "nair@college.edu",     encoder.encode(PWD), "Computer Science"));
        Teacher t5 = save(new Teacher(null, "Prof. P. Reddy",   "reddy@college.edu",    encoder.encode(PWD), "Computer Science"));
        Teacher t6 = save(new Teacher(null, "Dr. M. Krishnan",  "krishnan@college.edu", encoder.encode(PWD), "Computer Science"));
        System.out.println("[SEEDER] 6 teachers created.");

        // ── Courses ───────────────────────────────────────────
        Course c1 = courseRepo.save(new Course(null, "Data Structures",       4, t1));
        Course c2 = courseRepo.save(new Course(null, "Operating Systems",     3, t2));
        Course c3 = courseRepo.save(new Course(null, "Discrete Mathematics",  4, t3));
        Course c4 = courseRepo.save(new Course(null, "Computer Networks",     3, t4));
        Course c5 = courseRepo.save(new Course(null, "Database Systems",      3, t5));
        Course c6 = courseRepo.save(new Course(null, "Software Engineering",  2, t6));
        System.out.println("[SEEDER] 6 courses created.");

        // ── Students ──────────────────────────────────────────
        Student s1 = studentRepo.save(new Student(null, "Arjun Kumar",  "arjun@college.edu",  encoder.encode(PWD), "9876543210", "Computer Science", "3rd Year", null));
        Student s2 = studentRepo.save(new Student(null, "Priya Sharma", "priya@college.edu",  encoder.encode(PWD), "9876543211", "Computer Science", "3rd Year", null));
        Student s3 = studentRepo.save(new Student(null, "Ravi Teja",    "ravi@college.edu",   encoder.encode(PWD), "9876543212", "Computer Science", "3rd Year", null));
        Student s4 = studentRepo.save(new Student(null, "Sneha Reddy",  "sneha@college.edu",  encoder.encode(PWD), "9876543213", "Computer Science", "3rd Year", null));
        Student s5 = studentRepo.save(new Student(null, "Kiran Menon",  "kiran@college.edu",  encoder.encode(PWD), "9876543214", "Computer Science", "3rd Year", null));
        Student s6 = studentRepo.save(new Student(null, "Divya Iyer",   "divya@college.edu",  encoder.encode(PWD), "9876543215", "Computer Science", "3rd Year", null));
        System.out.println("[SEEDER] 6 students created.");

        // ── Assignments ───────────────────────────────────────
        assignmentRepo.saveAll(List.of(
            new Assignment(null, c1, "Linked List Implementation",        "Implement singly and doubly linked lists",          LocalDate.of(2026,3,13)),
            new Assignment(null, c1, "Binary Search Tree Coding",         "Implement BST with insert, delete, search",         LocalDate.of(2026,3,9)),
            new Assignment(null, c2, "Process Scheduling Report",         "Compare FCFS, SJF and Round Robin algorithms",      LocalDate.of(2026,3,18)),
            new Assignment(null, c3, "Graph Theory Problem Set",          "Solve 10 problems on graph traversal",              LocalDate.of(2026,3,21)),
            new Assignment(null, c4, "OSI Model Presentation",            "Create slides explaining all 7 OSI layers",         LocalDate.of(2026,3,13)),
            new Assignment(null, c5, "ER Diagram for Library System",     "Design complete ER diagram",                        LocalDate.of(2026,3,2)),
            new Assignment(null, c6, "Software Requirement Specification","Write SRS document for a hospital system",          LocalDate.of(2026,3,23))
        ));
        System.out.println("[SEEDER] 7 assignments created.");

        // ── Marks (Student 1 — all 6 courses) ────────────────
        marksRepo.saveAll(List.of(
            new Marks(null, s1, c1, 91, "O"),
            new Marks(null, s1, c2, 84, "A+"),
            new Marks(null, s1, c3, 76, "A"),
            new Marks(null, s1, c4, 88, "A+"),
            new Marks(null, s1, c5, 79, "A"),
            new Marks(null, s1, c6, 92, "O"),
            new Marks(null, s2, c1, 88, "A+"),
            new Marks(null, s2, c2, 74, "A"),
            new Marks(null, s3, c1, 65, "B+"),
            new Marks(null, s3, c3, 92, "O")
        ));
        System.out.println("[SEEDER] Marks created.");

        // ── Attendance (Student 1 — Course 1, 23/25 present) ─
        seedAttendance(s1, c1, 25, 23);
        seedAttendance(s1, c2, 25, 21);
        seedAttendance(s1, c3, 25, 20);
        seedAttendance(s1, c4, 24, 18);
        seedAttendance(s1, c5, 25, 22);
        seedAttendance(s1, c6, 25, 24);
        seedAttendance(s2, c1, 25, 24);
        seedAttendance(s3, c1, 25, 18); // below 75% — triggers warning
        System.out.println("[SEEDER] Attendance records created.");

        System.out.println("[SEEDER] ✅ All sample data seeded successfully.");
        System.out.println("[SEEDER] Login: arjun@college.edu / Test@123 (student)");
        System.out.println("[SEEDER] Login: sharma@college.edu / Test@123 (teacher)");
    }

    /** Seeds `total` attendance records for a student+course, with `present` marked Present */
    private void seedAttendance(Student student, Course course, int total, int present) {
        LocalDate date = LocalDate.of(2026, 1, 5);
        int presentCount = 0;
        for (int i = 0; i < total; i++) {
            String status = (presentCount < present && (total - i) > (present - presentCount - 1))
                    ? "Present" : "Absent";
            if (status.equals("Present")) presentCount++;
            // alternate absent slots to make it realistic
            if (i % 6 == 5 && presentCount < present - 1) status = "Absent";
            attendanceRepo.save(new Attendance(null, student, course, date, status));
            date = date.plusDays(2);
        }
    }

    private Teacher save(Teacher t) { return teacherRepo.save(t); }
}
