package com.edutrack.controller;

import com.edutrack.entity.*;
import com.edutrack.repository.*;
import com.edutrack.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/bulk")
@CrossOrigin(origins = "*")
public class BulkImportController {

    @Autowired private StudentRepository    studentRepo;
    @Autowired private TeacherRepository    teacherRepo;
    @Autowired private CourseRepository     courseRepo;
    @Autowired private AttendanceRepository attendanceRepo;
    @Autowired private MarksRepository      marksRepo;
    @Autowired private AuthService          authService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    private static final java.util.Set<String> VALID_DEPARTMENTS = new java.util.HashSet<>(java.util.Arrays.asList(
        "Computer Science and Engineering",
        "Artificial Intelligence and Machine Learning"
    ));

    // ── POST /api/bulk/attendance?courseId=1&date=2026-04-11 ──────────────
    // CSV: usn,status
    @PostMapping("/attendance")
    public ResponseEntity<Map<String, Object>> bulkAttendance(
            @RequestParam("file")     MultipartFile file,
            @RequestParam("courseId") Integer courseId,
            @RequestParam("date")     String date) {

        Map<String, Object> res = new HashMap<>();
        List<String> errors = new ArrayList<>();
        int imported = 0;

        try {
            Course course = courseRepo.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
            LocalDate attendanceDate = LocalDate.parse(date);
            BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
            String line; boolean first = true;

            while ((line = reader.readLine()) != null) {
                if (first) { first = false; continue; } // skip header
                if (line.trim().isEmpty()) continue; // skip blank lines
                // Skip if line contains "usn" (header repeated or BOM issue)
                String trimmed = line.trim().replaceAll("^\"|\"$","").toLowerCase();
                if (trimmed.startsWith("usn") || trimmed.startsWith("name,")) continue;
                // Strip outer quotes if entire row is quoted: "usn,status"
                String cleanLine = line.trim().replaceAll("^\"|\"$", "");
                String[] parts = cleanLine.split(",");
                if (parts.length < 2) { errors.add("Invalid row: " + line); continue; }
                String usn    = parts[0].trim().replaceAll("^\"|\"$", "");
                String status = parts[1].trim().replaceAll("^\"|\"$", "");

                Optional<Student> student = studentRepo.findByUsn(usn);
                if (student.isEmpty()) student = studentRepo.findByEmail(usn);
                if (student.isEmpty()) { errors.add("Student not found: " + usn); continue; }

                // Validate status value
                String cleanStatus = status.isEmpty() ? "Present" : status;
                if (!cleanStatus.equals("Present") && !cleanStatus.equals("Absent")) {
                    cleanStatus = "Present"; // default to Present if invalid
                }
                // Upsert: update existing record if same student+course+date exists
                Optional<Attendance> existing = attendanceRepo
                    .findByStudent_StudentIdAndCourse_CourseIdAndAttendanceDate(
                        student.get().getStudentId(), courseId, attendanceDate);
                Attendance att = existing.orElse(new Attendance());
                att.setStudent(student.get());
                att.setCourse(course);
                att.setAttendanceDate(attendanceDate);
                att.setStatus(cleanStatus);
                attendanceRepo.save(att);
                imported++;
            }

            res.put("success", true);
            res.put("imported", imported);
            res.put("errors", errors);
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", e.getMessage());
        }
        return ResponseEntity.ok(res);
    }

    // ── POST /api/bulk/marks?courseId=1 ───────────────────────────────────
    // CSV: usn,marks
    @PostMapping("/marks")
    public ResponseEntity<Map<String, Object>> bulkMarks(
            @RequestParam("file")     MultipartFile file,
            @RequestParam("courseId") Integer courseId) {

        Map<String, Object> res = new HashMap<>();
        List<String> errors = new ArrayList<>();
        int imported = 0;

        try {
            Course course = courseRepo.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
            BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
            String line; boolean first = true;

            while ((line = reader.readLine()) != null) {
                if (first) { first = false; continue; }
                if (line.trim().isEmpty()) continue;
                String trimmed = line.trim().replaceAll("^\"|\"$","").toLowerCase();
                if (trimmed.startsWith("usn") || trimmed.startsWith("name,")) continue;
                
                String cleanLine = line.trim().replaceAll("^\"|\"$", "");
                String[] parts = cleanLine.split(",");
                if (parts.length < 2) { errors.add("Invalid row: " + line); continue; }
                String usn = parts[0].trim().replaceAll("^\"|\"$", "");
                int score;
                try { score = Integer.parseInt(parts[1].trim().replaceAll("^\"|\"$", "")); }
                catch (NumberFormatException e) { errors.add("Invalid marks for " + usn); continue; }

                Optional<Student> student = studentRepo.findByUsn(usn);
                if (student.isEmpty()) student = studentRepo.findByEmail(usn);
                if (student.isEmpty()) { errors.add("Student not found: " + usn); continue; }

                String grade = score>=90?"O":score>=80?"A+":score>=70?"A":score>=60?"B+":"B";

                // update if exists, else create
                Optional<Marks> existing = marksRepo.findByStudent_StudentIdAndCourse_CourseId(
                    student.get().getStudentId(), courseId);
                Marks m = existing.orElse(new Marks());
                m.setStudent(student.get());
                m.setCourse(course);
                m.setMarks(score);
                m.setGrade(grade);
                marksRepo.save(m);
                imported++;
            }

            res.put("success", true);
            res.put("imported", imported);
            res.put("errors", errors);
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", e.getMessage());
        }
        return ResponseEntity.ok(res);
    }

    // ── POST /api/bulk/students ───────────────────────────────────────────
    // CSV: name,email,password,department,year,semester,phone,usn
    @PostMapping("/students")
    public ResponseEntity<Map<String, Object>> bulkStudents(@RequestParam("file") MultipartFile file) {
        Map<String, Object> res = new HashMap<>();
        List<String> errors = new ArrayList<>();
        int imported = 0;

        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
            String line; boolean first = true;

            while ((line = reader.readLine()) != null) {
                if (first) { first = false; continue; }
                if (line.trim().isEmpty()) continue;
                String trimmed = line.trim().replaceAll("^\"|\"$","").toLowerCase();
                if (trimmed.startsWith("name,")) continue;

                String cleanLine = line.trim().replaceAll("^\"|\"$", "");
                String[] p = cleanLine.split(",");
                if (p.length < 4) { errors.add("Invalid row: " + line); continue; }

                String email = p[1].trim();
                if (studentRepo.existsByEmail(email)) { errors.add("Email exists: " + email); continue; }
                String sDept = p.length > 3 ? p[3].trim() : "";
                if (!VALID_DEPARTMENTS.contains(sDept)) { errors.add("Invalid department '" + sDept + "' for: " + email + ". Must be 'Computer Science and Engineering' or 'Artificial Intelligence and Machine Learning'"); continue; }

                Student s = new Student();
                s.setName(p[0].trim());
                s.setEmail(email);
                s.setPassword(encoder.encode(p.length>2 ? p[2].trim() : "Test@123"));
                s.setDepartment(p.length>3 ? p[3].trim() : "");
                s.setYear(p.length>4 ? p[4].trim() : "1st Year");
                s.setSemester(p.length>5 ? p[5].trim() : "");
                s.setPhone(p.length>6 ? p[6].trim() : "");
                s.setUsn(p.length>7 ? p[7].trim() : "");
                s.setStatus("Active");
                studentRepo.save(s);
                imported++;
            }

            res.put("success", true);
            res.put("imported", imported);
            res.put("errors", errors);
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", e.getMessage());
        }
        return ResponseEntity.ok(res);
    }

    // ── POST /api/bulk/teachers ───────────────────────────────────────────
    // CSV: name,email,password,department
    @PostMapping("/teachers")
    public ResponseEntity<Map<String, Object>> bulkTeachers(@RequestParam("file") MultipartFile file) {
        Map<String, Object> res = new HashMap<>();
        List<String> errors = new ArrayList<>();
        int imported = 0;

        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
            String line; boolean first = true;

            while ((line = reader.readLine()) != null) {
                if (first) { first = false; continue; }
                if (line.trim().isEmpty()) continue;
                String trimmed = line.trim().replaceAll("^\"|\"$","").toLowerCase();
                if (trimmed.startsWith("name,")) continue;

                String cleanLine = line.trim().replaceAll("^\"|\"$", "");
                String[] p = cleanLine.split(",");
                if (p.length < 4) { errors.add("Invalid row: " + line); continue; }

                String email = p[1].trim();
                if (teacherRepo.existsByEmail(email)) { errors.add("Email exists: " + email); continue; }
                String tDept = p.length > 3 ? p[3].trim() : "";
                if (!VALID_DEPARTMENTS.contains(tDept)) { errors.add("Invalid department '" + tDept + "' for: " + email + ". Must be 'Computer Science and Engineering' or 'Artificial Intelligence and Machine Learning'"); continue; }

                Teacher t = new Teacher();
                t.setName(p[0].trim());
                t.setEmail(email);
                String tPass = (p.length > 2 && !p[2].trim().isEmpty()) ? p[2].trim() : "Test@123";
                t.setPassword(encoder.encode(tPass));
                t.setDepartment(p.length > 3 ? p[3].trim() : "");
                t.setPhone(p.length > 4 && !p[4].trim().isEmpty() ? p[4].trim() : null);
                String empId = p.length > 5 && !p[5].trim().isEmpty() ? p[5].trim() : null;
                // avoid unique constraint: check if employeeId already exists
                if (empId != null && teacherRepo.existsByEmployeeId(empId)) {
                    errors.add("Employee ID already exists: " + empId + " for " + email);
                    continue;
                }
                t.setEmployeeId(empId);
                t.setStatus("Active");
                teacherRepo.save(t);
                imported++;
            }

            res.put("success", true);
            res.put("imported", imported);
            res.put("errors", errors);
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", e.getMessage());
        }
        return ResponseEntity.ok(res);
    }
}
