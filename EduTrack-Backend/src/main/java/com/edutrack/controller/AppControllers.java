package com.edutrack.controller;

import com.edutrack.entity.*;
import com.edutrack.repository.*;
import com.edutrack.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
@CrossOrigin(origins = "http://localhost:3000")
class CourseController {

    @Autowired private CourseRepository courseRepo;
    @Autowired private TeacherRepository teacherRepo;

    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Integer id) {
        return courseRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/teacher/{teacherId}")
    public List<Course> getCoursesByTeacher(@PathVariable Integer teacherId) {
        return courseRepo.findByTeacher_TeacherId(teacherId);
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
        courseRepo.deleteById(id);
        return ResponseEntity.ok("Course deleted");
    }
}

// ══════════════════════════════════════════════════════════════
//  ATTENDANCE CONTROLLER
//  GET  /api/attendance/student/{id}              → By student
//  GET  /api/attendance/course/{id}               → By course
//  GET  /api/attendance/student/{sId}/course/{cId}→ Student + Course
//  POST /api/attendance                           → Mark attendance (Teacher)
//  DELETE /api/attendance/{id}                    → Delete record
// ══════════════════════════════════════════════════════════════
@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:3000")
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
            @PathVariable Integer studentId,
            @PathVariable Integer courseId) {
        return attendanceRepo.findByStudent_StudentIdAndCourse_CourseId(studentId, courseId);
    }

    @PostMapping
    public ResponseEntity<Attendance> markAttendance(@RequestBody Attendance attendance) {
        return ResponseEntity.ok(attendanceRepo.save(attendance));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        attendanceRepo.deleteById(id);
        return ResponseEntity.ok("Attendance record deleted");
    }
}

// ══════════════════════════════════════════════════════════════
//  ASSIGNMENT CONTROLLER
//  GET    /api/assignments             → All assignments
//  GET    /api/assignments/{id}        → By ID
//  GET    /api/assignments/course/{id} → By course
//  POST   /api/assignments             → Create (Teacher)
//  PUT    /api/assignments/{id}        → Update (Teacher)
//  DELETE /api/assignments/{id}        → Delete (Teacher)
// ══════════════════════════════════════════════════════════════
@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "http://localhost:3000")
class AssignmentController {

    @Autowired private AssignmentRepository assignmentRepo;

    @GetMapping
    public List<Assignment> getAll() {
        return assignmentRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Assignment> getById(@PathVariable Integer id) {
        return assignmentRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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
        assignmentRepo.deleteById(id);
        return ResponseEntity.ok("Assignment deleted");
    }
}

// ══════════════════════════════════════════════════════════════
//  MARKS CONTROLLER
//  GET  /api/marks/student/{id} → Marks by student
//  GET  /api/marks/course/{id}  → Marks by course
//  POST /api/marks              → Enter marks (Teacher)
//  PUT  /api/marks/{id}         → Update marks (Teacher)
//  DELETE /api/marks/{id}       → Delete marks
// ══════════════════════════════════════════════════════════════
@RestController
@RequestMapping("/api/marks")
@CrossOrigin(origins = "http://localhost:3000")
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
        // Auto calculate grade
        int score = marks.getMarks();
        String grade = score>=90?"O" : score>=80?"A+" : score>=70?"A" : score>=60?"B+" : "B";
        marks.setGrade(grade);
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
//  GET /api/students        → All students
//  GET /api/students/{id}   → Student by ID
// ══════════════════════════════════════════════════════════════
@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3000")
class StudentController {

    @Autowired private StudentRepository studentRepo;

    @GetMapping
    public List<Student> getAll() {
        return studentRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getById(@PathVariable Integer id) {
        return studentRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

// ══════════════════════════════════════════════════════════════
//  TEACHER CONTROLLER
//  GET /api/teachers        → All teachers
//  GET /api/teachers/{id}   → Teacher by ID
// ══════════════════════════════════════════════════════════════
@RestController
@RequestMapping("/api/teachers")
@CrossOrigin(origins = "http://localhost:3000")
class TeacherController {

    @Autowired private TeacherRepository teacherRepo;

    @GetMapping
    public List<Teacher> getAll() {
        return teacherRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Teacher> getById(@PathVariable Integer id) {
        return teacherRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
