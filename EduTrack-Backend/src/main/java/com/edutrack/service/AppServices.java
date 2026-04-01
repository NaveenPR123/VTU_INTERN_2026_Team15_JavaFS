package com.edutrack.service;

import com.edutrack.entity.*;
import com.edutrack.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

// ── CourseService ─────────────────────────────────────────────
@Service
class CourseService {
    @Autowired private CourseRepository courseRepo;

    public List<Course> getAllCourses()                          { return courseRepo.findAll(); }
    public List<Course> getCoursesByTeacher(Integer teacherId)  { return courseRepo.findByTeacher_TeacherId(teacherId); }
    public Course       saveCourse(Course course)               { return courseRepo.save(course); }
    public void         deleteCourse(Integer id)                { courseRepo.deleteById(id); }
    public Course       getCourseById(Integer id)               { return courseRepo.findById(id).orElse(null); }
}

// ── AttendanceService ─────────────────────────────────────────
@Service
class AttendanceService {
    @Autowired private AttendanceRepository attendanceRepo;

    public List<Attendance> getByStudent(Integer studentId)                            { return attendanceRepo.findByStudent_StudentId(studentId); }
    public List<Attendance> getByCourse(Integer courseId)                              { return attendanceRepo.findByCourse_CourseId(courseId); }
    public List<Attendance> getByStudentAndCourse(Integer studentId, Integer courseId) { return attendanceRepo.findByStudent_StudentIdAndCourse_CourseId(studentId, courseId); }
    public Attendance       save(Attendance attendance)                                { return attendanceRepo.save(attendance); }
    public void             delete(Integer id)                                         { attendanceRepo.deleteById(id); }
}

// ── AssignmentService ─────────────────────────────────────────
@Service
class AssignmentService {
    @Autowired private AssignmentRepository assignmentRepo;

    public List<Assignment> getAll()                          { return assignmentRepo.findAll(); }
    public List<Assignment> getByCourse(Integer courseId)     { return assignmentRepo.findByCourse_CourseId(courseId); }
    public Assignment       save(Assignment assignment)       { return assignmentRepo.save(assignment); }
    public void             delete(Integer id)                { assignmentRepo.deleteById(id); }
    public Assignment       getById(Integer id)               { return assignmentRepo.findById(id).orElse(null); }
}

// ── MarksService ──────────────────────────────────────────────
@Service
class MarksService {
    @Autowired private MarksRepository marksRepo;

    public List<Marks> getByStudent(Integer studentId)  { return marksRepo.findByStudent_StudentId(studentId); }
    public List<Marks> getByCourse(Integer courseId)    { return marksRepo.findByCourse_CourseId(courseId); }
    public Marks       save(Marks marks)                { return marksRepo.save(marks); }
    public void        delete(Integer id)               { marksRepo.deleteById(id); }

    // Auto-calculate grade from marks
    public String calculateGrade(Integer marks) {
        if (marks >= 90) return "O";
        if (marks >= 80) return "A+";
        if (marks >= 70) return "A";
        if (marks >= 60) return "B+";
        return "B";
    }
}
