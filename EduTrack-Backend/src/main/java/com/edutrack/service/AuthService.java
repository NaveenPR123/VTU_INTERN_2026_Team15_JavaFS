package com.edutrack.service;

import com.edutrack.entity.Student;
import com.edutrack.entity.Teacher;
import com.edutrack.repository.StudentRepository;
import com.edutrack.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired private OtpService otpService;
    @Autowired private StudentRepository studentRepo;
    @Autowired private TeacherRepository teacherRepo;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public Map<String, Object> registerStudent(Student student) {
        Map<String, Object> response = new HashMap<>();
        if (studentRepo.existsByEmail(student.getEmail())) {
            response.put("success", false);
            response.put("message", "Email already registered");
            return response;
        }
        student.setPassword(encoder.encode(student.getPassword()));
        Student saved = studentRepo.save(student);
        response.put("success", true);
        response.put("message", "Student registered successfully");
        response.put("studentId", saved.getStudentId());
        response.put("name", saved.getName());
        response.put("email", saved.getEmail());
        response.put("department", saved.getDepartment());
        response.put("year", saved.getYear());
        response.put("role", "student");
        return response;
    }

    public Map<String, Object> registerTeacher(Teacher teacher) {
        Map<String, Object> response = new HashMap<>();
        if (teacherRepo.existsByEmail(teacher.getEmail())) {
            response.put("success", false);
            response.put("message", "Email already registered");
            return response;
        }
        teacher.setPassword(encoder.encode(teacher.getPassword()));
        Teacher saved = teacherRepo.save(teacher);
        response.put("success", true);
        response.put("message", "Teacher registered successfully");
        response.put("teacherId", saved.getTeacherId());
        response.put("name", saved.getName());
        response.put("email", saved.getEmail());
        response.put("department", saved.getDepartment());
        response.put("role", "teacher");
        return response;
    }

    public Map<String, Object> loginStudent(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        Optional<Student> opt = studentRepo.findByEmail(email);
        if (opt.isEmpty() || !encoder.matches(password, opt.get().getPassword())) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return response;
        }
        Student s = opt.get();
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("studentId", s.getStudentId());
        response.put("name", s.getName());
        response.put("email", s.getEmail());
        response.put("department", s.getDepartment());
        response.put("year", s.getYear());
        response.put("role", "student");
        return response;
    }

    public Map<String, Object> loginTeacher(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        Optional<Teacher> opt = teacherRepo.findByEmail(email);
        if (opt.isEmpty() || !encoder.matches(password, opt.get().getPassword())) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return response;
        }
        Teacher t = opt.get();
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("teacherId", t.getTeacherId());
        response.put("name", t.getName());
        response.put("email", t.getEmail());
        response.put("department", t.getDepartment());
        response.put("role", "teacher");
        return response;
    }

    @Transactional
    public Map<String, Object> changeStudentPassword(Integer studentId, String currentPassword, String newPassword) {
        Map<String, Object> response = new HashMap<>();
        Optional<Student> opt = studentRepo.findById(studentId);
        if (opt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Student not found");
            return response;
        }
        Student student = opt.get();
        if (!encoder.matches(currentPassword, student.getPassword())) {
            response.put("success", false);
            response.put("message", "Current password is incorrect");
            return response;
        }
        student.setPassword(encoder.encode(newPassword));
        studentRepo.save(student);
        response.put("success", true);
        response.put("message", "Password changed successfully");
        return response;
    }

    @Transactional
    public Map<String, Object> changeTeacherPassword(Integer teacherId, String currentPassword, String newPassword) {
        Map<String, Object> response = new HashMap<>();
        Optional<Teacher> opt = teacherRepo.findById(teacherId);
        if (opt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Teacher not found");
            return response;
        }
        Teacher teacher = opt.get();
        if (!encoder.matches(currentPassword, teacher.getPassword())) {
            response.put("success", false);
            response.put("message", "Current password is incorrect");
            return response;
        }
        teacher.setPassword(encoder.encode(newPassword));
        teacherRepo.save(teacher);
        response.put("success", true);
        response.put("message", "Password changed successfully");
        return response;
    }

    @Transactional
    public boolean resetStudentPassword(String email, String otp, String newPassword) {
        System.out.println("[AUTH] resetStudentPassword called for email: " + email);
        Optional<Student> opt = studentRepo.findByEmail(email);
        if (opt.isEmpty()) {
            System.out.println("[AUTH] Student not found for email: " + email);
            return false;
        }
        if (!otpService.validateOtp(email, otp)) return false;
        Student student = opt.get();
        student.setPassword(encoder.encode(newPassword));
        studentRepo.save(student);
        System.out.println("[AUTH] Student password reset successfully for: " + email);
        return true;
    }

    @Transactional
    public boolean resetTeacherPassword(String email, String otp, String newPassword) {
        System.out.println("[AUTH] resetTeacherPassword called for email: " + email);
        Optional<Teacher> opt = teacherRepo.findByEmail(email);
        if (opt.isEmpty()) {
            System.out.println("[AUTH] Teacher not found for email: " + email);
            return false;
        }
        if (!otpService.validateOtp(email, otp)) return false;
        Teacher teacher = opt.get();
        teacher.setPassword(encoder.encode(newPassword));
        teacherRepo.save(teacher);
        System.out.println("[AUTH] Teacher password reset successfully for: " + email);
        return true;
    }
}
