package com.edutrack.controller;

import com.edutrack.entity.*;
import com.edutrack.repository.*;
import com.edutrack.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

record AttendanceStatsDTO(Integer studentId, String name, double attendancePercentage) {}

// ══════════════════════════════════════════════════════════════
//  COURSE CONTROLLER
//  GET    /api/courses              → All courses
//  GET    /api/courses/{id}         → Course by ID
//  GET    /api/courses/teacher/{id} → Courses by teacher
//  POST   /api/courses              → Add course (Teacher)
//  PUT    /api/courses/{id}         → Update course (Teacher)
//  DELETE /api/courses/{id}         → Delete course (Teacher)
// ══════════════════════════════════════════════════════════════
@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
class CourseController {

    @Autowired private CourseRepository     courseRepo;
    @Autowired private AssignmentRepository assignmentRepoC;
    @Autowired private AttendanceRepository attendanceRepoC;
    @Autowired private MarksRepository      marksRepoC;
    @Autowired private SubmissionRepository submissionRepoC;

    @GetMapping
    public List<Course> getAllCourses() { return courseRepo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Integer id) {
        return courseRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/teacher/{teacherId}")
    public List<Course> getCoursesByTeacher(@PathVariable Integer teacherId) {
        return courseRepo.findByTeacher_TeacherId(teacherId);
    }

    @GetMapping("/department/{department}")
    public List<Course> getCoursesByDepartment(@PathVariable String department) {
        return courseRepo.findByTeacher_DepartmentIgnoreCase(department);
    }

    @PostMapping
    public ResponseEntity<Course> addCourse(@RequestBody Course course) {
        return ResponseEntity.ok(courseRepo.save(course));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Integer id, @RequestBody Course updated) {
        return courseRepo.findById(id).map(c -> {
            c.setCourseName(updated.getCourseName());
            c.setCredits(updated.getCredits());
            return ResponseEntity.ok(courseRepo.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable Integer id) {
        // cascade delete all related data first
        List<Assignment> assignments = assignmentRepoC.findByCourse_CourseId(id);
        assignments.forEach(a -> submissionRepoC.deleteByAssignment_AssignmentId(a.getAssignmentId()));
        assignmentRepoC.deleteByCourse_CourseId(id);
        attendanceRepoC.deleteByCourse_CourseId(id);
        marksRepoC.deleteByCourse_CourseId(id);
        courseRepo.deleteById(id);
        return ResponseEntity.ok("Course deleted");
    }
}

// ══════════════════════════════════════════════════════════════
//  ATTENDANCE CONTROLLER
//  GET    /api/attendance/student/{id}               → By student
//  GET    /api/attendance/course/{id}                → By course
//  GET    /api/attendance/student/{sId}/course/{cId} → Student + Course
//  POST   /api/attendance                            → Mark attendance
//  DELETE /api/attendance/{id}                       → Delete record
// ══════════════════════════════════════════════════════════════
@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
class AttendanceController {

    @Autowired private AttendanceRepository attendanceRepo;

    @GetMapping("/student/{studentId}")
    public List<Attendance> getByStudent(@PathVariable Integer studentId) {
        return attendanceRepo.findByStudent_StudentId(studentId);
    }

    @GetMapping("/course/{courseId}")
    public List<Attendance> getByCourse(@PathVariable Integer courseId) {
        return attendanceRepo.findByCourse_CourseId(courseId);
    }

    @GetMapping("/student/{studentId}/course/{courseId}")
    public List<Attendance> getByStudentAndCourse(
            @PathVariable Integer studentId, @PathVariable Integer courseId) {
        return attendanceRepo.findByStudent_StudentIdAndCourse_CourseId(studentId, courseId);
    }

    @PostMapping
    public ResponseEntity<?> markAttendance(@RequestBody Attendance attendance) {
        String status = attendance.getStatus();
        if (status == null || (!status.equals("Present") && !status.equals("Absent"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status. Must be Present or Absent."));
        }
        // Upsert: update if record exists for same student+course+date
        if (attendance.getStudent() != null && attendance.getCourse() != null && attendance.getAttendanceDate() != null) {
            java.util.Optional<com.edutrack.entity.Attendance> existing = attendanceRepo
                .findByStudent_StudentIdAndCourse_CourseIdAndAttendanceDate(
                    attendance.getStudent().getStudentId(),
                    attendance.getCourse().getCourseId(),
                    attendance.getAttendanceDate());
            if (existing.isPresent()) {
                existing.get().setStatus(status);
                return ResponseEntity.ok(attendanceRepo.save(existing.get()));
            }
        }
        return ResponseEntity.ok(attendanceRepo.save(attendance));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAttendance(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || (!status.equals("Present") && !status.equals("Absent"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status. Must be Present or Absent."));
        }
        return attendanceRepo.findById(id).map(a -> {
            a.setStatus(status);
            return ResponseEntity.ok(attendanceRepo.save(a));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        attendanceRepo.deleteById(id);
        return ResponseEntity.ok("Attendance record deleted");
    }

    @GetMapping("/course/{courseId}/stats")
    public List<AttendanceStatsDTO> getStatsByCourse(@PathVariable Integer courseId) {
        List<Attendance> records = attendanceRepo.findByCourse_CourseId(courseId);
        return records.stream()
            .collect(Collectors.groupingBy(a -> a.getStudent().getStudentId()))
            .entrySet().stream()
            .map(e -> {
                List<Attendance> studentRecords = e.getValue();
                long total = studentRecords.size();
                long presentOrLate = studentRecords.stream()
                    .filter(a -> "Present".equals(a.getStatus()))
                    .count();
                double pct = total > 0 ? Math.round((presentOrLate * 1000.0 / total)) / 10.0 : 0.0;
                String name = studentRecords.get(0).getStudent().getName();
                return new AttendanceStatsDTO(e.getKey(), name, pct);
            })
            .collect(Collectors.toList());
    }

    @GetMapping("/course/{courseId}/date/{date}")
    public List<Attendance> getByCoursAndDate(
            @PathVariable Integer courseId,
            @PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        return attendanceRepo.findByCourse_CourseIdAndAttendanceDate(courseId, localDate);
    }
}

// ══════════════════════════════════════════════════════════════
//  ASSIGNMENT CONTROLLER
//  GET    /api/assignments              → All assignments
//  GET    /api/assignments/{id}         → By ID
//  GET    /api/assignments/course/{id}  → By course
//  POST   /api/assignments              → Create (Teacher)
//  PUT    /api/assignments/{id}         → Update (Teacher)
//  DELETE /api/assignments/{id}         → Delete (Teacher)
// ══════════════════════════════════════════════════════════════
@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "*")
class AssignmentController {

    @Autowired private AssignmentRepository assignmentRepo;
    @Autowired private SubmissionRepository submissionRepo;

    @GetMapping
    public List<Assignment> getAll() { return assignmentRepo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Assignment> getById(@PathVariable Integer id) {
        return assignmentRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/course/{courseId}")
    public List<Assignment> getByCourse(@PathVariable Integer courseId) {
        return assignmentRepo.findByCourse_CourseId(courseId);
    }

    @PostMapping
    public ResponseEntity<Assignment> create(@RequestBody Assignment assignment) {
        return ResponseEntity.ok(assignmentRepo.save(assignment));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Assignment> update(@PathVariable Integer id, @RequestBody Assignment updated) {
        return assignmentRepo.findById(id).map(a -> {
            a.setTitle(updated.getTitle());
            a.setDescription(updated.getDescription());
            a.setDueDate(updated.getDueDate());
            return ResponseEntity.ok(assignmentRepo.save(a));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        // delete submissions first to avoid FK constraint
        submissionRepo.deleteByAssignment_AssignmentId(id);
        assignmentRepo.deleteById(id);
        return ResponseEntity.ok("Assignment deleted");
    }
}

// ══════════════════════════════════════════════════════════════
//  MARKS CONTROLLER
//  GET    /api/marks/student/{id} → Marks by student
//  GET    /api/marks/course/{id}  → Marks by course
//  POST   /api/marks              → Enter marks (auto grade)
//  PUT    /api/marks/{id}         → Update marks
//  DELETE /api/marks/{id}         → Delete marks
// ══════════════════════════════════════════════════════════════
@RestController
@RequestMapping("/api/marks")
@CrossOrigin(origins = "*")
class MarksController {

    @Autowired private MarksRepository marksRepo;

    @GetMapping("/student/{studentId}")
    public List<Marks> getByStudent(@PathVariable Integer studentId) {
        return marksRepo.findByStudent_StudentId(studentId);
    }

    @GetMapping("/course/{courseId}")
    public List<Marks> getByCourse(@PathVariable Integer courseId) {
        return marksRepo.findByCourse_CourseId(courseId);
    }

    @PostMapping
    public ResponseEntity<Marks> enterMarks(@RequestBody Marks marks) {
        int score = marks.getMarks();
        marks.setGrade(score>=90?"O" : score>=80?"A+" : score>=70?"A" : score>=60?"B+" : "B");
        return ResponseEntity.ok(marksRepo.save(marks));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Marks> update(@PathVariable Integer id, @RequestBody Marks updated) {
        return marksRepo.findById(id).map(m -> {
            m.setMarks(updated.getMarks());
            int score = updated.getMarks();
            m.setGrade(score>=90?"O" : score>=80?"A+" : score>=70?"A" : score>=60?"B+" : "B");
            return ResponseEntity.ok(marksRepo.save(m));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        marksRepo.deleteById(id);
        return ResponseEntity.ok("Mark deleted");
    }
}

// ══════════════════════════════════════════════════════════════
//  STUDENT CONTROLLER
//  GET    /api/students              → All students
//  GET    /api/students/{id}         → Student by ID
//  PUT    /api/students/{id}         → Update student profile
//  DELETE /api/students/{id}         → Delete student (Admin)
//  POST   /api/students/{id}/change-password → Change password
// ══════════════════════════════════════════════════════════════
@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
class StudentController {

    @Autowired private StudentRepository studentRepo;
    @Autowired private AttendanceRepository attendanceRepo;
    @Autowired private MarksRepository      marksRepo;
    @Autowired private SubmissionRepository  submissionRepo;
    @Autowired private AuthService authService;

    @GetMapping
    public List<Student> getAll() { return studentRepo.findAll(); }

    @GetMapping("/department/{department}")
    public List<Student> getByDepartment(@PathVariable String department) {
        return studentRepo.findByDepartmentIgnoreCase(department);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getById(@PathVariable Integer id) {
        return studentRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        return studentRepo.findById(id).map(s -> {
            if (body.containsKey("name")       && body.get("name")       != null) s.setName(body.get("name"));
            if (body.containsKey("email")      && body.get("email")      != null) s.setEmail(body.get("email"));
            if (body.containsKey("phone")      && body.get("phone")      != null) s.setPhone(body.get("phone"));
            if (body.containsKey("department") && body.get("department") != null) s.setDepartment(body.get("department"));
            if (body.containsKey("year")       && body.get("year")       != null) s.setYear(body.get("year"));
            if (body.containsKey("semester")   && body.get("semester")   != null) s.setSemester(body.get("semester"));
            if (body.containsKey("usn")        && body.get("usn")        != null) s.setUsn(body.get("usn"));
            try {
                studentRepo.save(s);
            } catch (Exception e) {
                String msg = e.getMessage() != null && (e.getMessage().contains("email") || e.getMessage().contains("usn"))
                    ? "Email or USN already in use by another account."
                    : "Failed to save. Please check for duplicate values.";
                return ResponseEntity.ok(Map.<String, Object>of("success", false, "message", msg));
            }
            return ResponseEntity.ok(Map.<String, Object>of("success", true, "message", "Student updated"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        if (!studentRepo.existsById(id)) return ResponseEntity.notFound().build();
        attendanceRepo.deleteByStudent_StudentId(id);
        marksRepo.deleteByStudent_StudentId(id);
        submissionRepo.deleteByStudent_StudentId(id);
        studentRepo.deleteById(id);
        return ResponseEntity.ok("Student deleted");
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStudentStatus(
            @PathVariable Integer id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        Map<String, Object> res = new HashMap<>();
        if (status == null || (!status.equals("Active") && !status.equals("Suspended") && !status.equals("Graduated"))) {
            res.put("success", false); res.put("message", "Invalid status");
            return ResponseEntity.ok(res);
        }
        Optional<Student> opt = studentRepo.findById(id);
        if (opt.isEmpty()) { res.put("success", false); res.put("message", "Not found"); return ResponseEntity.ok(res); }
        opt.get().setStatus(status);
        studentRepo.save(opt.get());
        res.put("success", true); res.put("status", status);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/{id}/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(
            @PathVariable Integer id, @RequestBody Map<String, String> body) {
        if (body.get("currentPassword") == null || body.get("newPassword") == null)
            return ResponseEntity.ok(Map.of("success", false, "message", "currentPassword and newPassword are required"));
        return ResponseEntity.ok(authService.changeStudentPassword(id, body.get("currentPassword"), body.get("newPassword")));
    }

    // Admin force-reset (no current password required)
    @PostMapping("/{id}/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(
            @PathVariable Integer id, @RequestBody Map<String, String> body) {
        String newPassword = body.get("newPassword");
        if (newPassword == null || newPassword.isBlank())
            return ResponseEntity.ok(Map.of("success", false, "message", "newPassword is required"));
        return ResponseEntity.ok(authService.forceResetStudentPassword(id, newPassword));
    }
}

// ══════════════════════════════════════════════════════════════
//  TEACHER CONTROLLER
//  GET    /api/teachers              → All teachers
//  GET    /api/teachers/{id}         → Teacher by ID
//  PUT    /api/teachers/{id}         → Update teacher profile
//  DELETE /api/teachers/{id}         → Delete teacher (Admin)
//  POST   /api/teachers/{id}/change-password → Change password
// ══════════════════════════════════════════════════════════════
@RestController
@RequestMapping("/api/teachers")
@CrossOrigin(origins = "*")
class TeacherController {

    @Autowired private TeacherRepository       teacherRepo;
    @Autowired private CourseRepository        courseRepo;
    @Autowired private AttendanceRepository    attendanceRepo;
    @Autowired private AssignmentRepository    assignmentRepo;
    @Autowired private MarksRepository         marksRepo;
    @Autowired private CourseMaterialRepository materialRepo;
    @Autowired private SubmissionRepository     submissionRepo;
    @Autowired private AuthService authService;

    @GetMapping
    public List<Teacher> getAll() { return teacherRepo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Teacher> getById(@PathVariable Integer id) {
        return teacherRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        return teacherRepo.findById(id).map(t -> {
            if (body.containsKey("name")       && body.get("name")       != null) t.setName(body.get("name"));
            if (body.containsKey("email")      && body.get("email")      != null) t.setEmail(body.get("email"));
            if (body.containsKey("department") && body.get("department") != null) t.setDepartment(body.get("department"));
            if (body.containsKey("phone")      && body.get("phone")      != null) t.setPhone(body.get("phone"));
            if (body.containsKey("employeeId")) {
                String eid = body.get("employeeId");
                t.setEmployeeId((eid == null || eid.isBlank()) ? null : eid);
            }
            try {
                teacherRepo.save(t);
            } catch (Exception e) {
                String msg = e.getMessage() != null && e.getMessage().contains("email")
                    ? "Email already in use by another account."
                    : "Failed to save. Please check for duplicate values.";
                return ResponseEntity.ok(Map.<String, Object>of("success", false, "message", msg));
            }
            return ResponseEntity.ok(Map.<String, Object>of("success", true, "message", "Teacher updated"));
        }).orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        if (!teacherRepo.existsById(id)) return ResponseEntity.notFound().build();
        java.util.List<com.edutrack.entity.Course> courses = courseRepo.findByTeacher_TeacherId(id);
        for (com.edutrack.entity.Course c : courses) {
            attendanceRepo.deleteByCourse_CourseId(c.getCourseId());
            marksRepo.deleteByCourse_CourseId(c.getCourseId());
            // delete submissions for assignments in this course
            java.util.List<com.edutrack.entity.Assignment> asns = assignmentRepo.findByCourse_CourseId(c.getCourseId());
            for (com.edutrack.entity.Assignment a : asns) {
                submissionRepo.deleteByAssignment_AssignmentId(a.getAssignmentId());
            }
            assignmentRepo.deleteByCourse_CourseId(c.getCourseId());
            materialRepo.deleteByCourse_CourseId(c.getCourseId());
        }
        courseRepo.deleteAll(courses);
        teacherRepo.deleteById(id);
        return ResponseEntity.ok("Teacher deleted");
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateTeacherStatus(
            @PathVariable Integer id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        Map<String, Object> res = new HashMap<>();
        if (status == null || (!status.equals("Active") && !status.equals("Suspended"))) {
            res.put("success", false); res.put("message", "Invalid status");
            return ResponseEntity.ok(res);
        }
        Optional<Teacher> opt = teacherRepo.findById(id);
        if (opt.isEmpty()) { res.put("success", false); res.put("message", "Not found"); return ResponseEntity.ok(res); }
        opt.get().setStatus(status);
        teacherRepo.save(opt.get());
        res.put("success", true); res.put("status", status);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/{id}/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(
            @PathVariable Integer id, @RequestBody Map<String, String> body) {
        if (body.get("currentPassword") == null || body.get("newPassword") == null)
            return ResponseEntity.ok(Map.of("success", false, "message", "currentPassword and newPassword are required"));
        return ResponseEntity.ok(authService.changeTeacherPassword(id, body.get("currentPassword"), body.get("newPassword")));
    }

    // Admin force-reset (no current password required)
    @PostMapping("/{id}/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(
            @PathVariable Integer id, @RequestBody Map<String, String> body) {
        String newPassword = body.get("newPassword");
        if (newPassword == null || newPassword.isBlank())
            return ResponseEntity.ok(Map.of("success", false, "message", "newPassword is required"));
        return ResponseEntity.ok(authService.forceResetTeacherPassword(id, newPassword));
    }
}
