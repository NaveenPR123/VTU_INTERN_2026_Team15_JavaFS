package com.edutrack.service;

import com.edutrack.entity.Admin;
import com.edutrack.entity.Student;
import com.edutrack.entity.Teacher;
import com.edutrack.repository.AdminRepository;
import com.edutrack.repository.StudentRepository;
import com.edutrack.repository.TeacherRepository;
import com.edutrack.repository.SystemSettingsRepository;
import com.edutrack.entity.SystemSettings;
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
    @Autowired private AdminRepository adminRepo;
    @Autowired private SystemSettingsRepository settingsRepo;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // ── Registration ──────────────────────────────────────────────────────────

    public Map<String, Object> registerStudent(Student student) {
        Map<String, Object> response = new HashMap<>();
        if (!isRegistrationOpen()) {
            response.put("success", false);
            response.put("message", "New registrations are currently disabled.");
            return response;
        }
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
        response.put("phone", saved.getPhone());
        response.put("usn", saved.getUsn());
        response.put("semester", saved.getSemester());
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
        response.put("phone", saved.getPhone());
        response.put("employeeId", saved.getEmployeeId());
        response.put("role", "teacher");
        return response;
    }

    // Admin-bypass registration — skips registrationOpen check
    public Map<String, Object> adminRegisterStudent(Student student) {
        Map<String, Object> response = new HashMap<>();
        if (studentRepo.existsByEmail(student.getEmail())) {
            response.put("success", false);
            response.put("message", "Email already registered");
            return response;
        }
        student.setPassword(encoder.encode(student.getPassword()));
        if (student.getStatus() == null) student.setStatus("Active");
        Student saved = studentRepo.save(student);
        response.put("success", true);
        response.put("message", "Student added successfully");
        response.put("studentId", saved.getStudentId());
        response.put("name", saved.getName());
        response.put("email", saved.getEmail());
        response.put("department", saved.getDepartment());
        response.put("year", saved.getYear());
        response.put("role", "student");
        return response;
    }

    public Map<String, Object> adminRegisterTeacher(Teacher teacher) {
        Map<String, Object> response = new HashMap<>();
        if (teacherRepo.existsByEmail(teacher.getEmail())) {
            response.put("success", false);
            response.put("message", "Email already registered");
            return response;
        }
        teacher.setPassword(encoder.encode(teacher.getPassword()));
        Teacher saved = teacherRepo.save(teacher);
        response.put("success", true);
        response.put("message", "Teacher added successfully");
        response.put("teacherId", saved.getTeacherId());
        response.put("name", saved.getName());
        response.put("email", saved.getEmail());
        response.put("department", saved.getDepartment());
        response.put("role", "teacher");
        return response;
    }

    // ── System settings helpers ───────────────────────────────────────────────

    private boolean isMaintenanceMode() {
        return settingsRepo.findById(1)
            .map(SystemSettings::isMaintenanceMode)
            .orElse(false);
    }

    private boolean isRegistrationOpen() {
        return settingsRepo.findById(1)
            .map(SystemSettings::isRegistrationOpen)
            .orElse(true);
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    public Map<String, Object> loginStudent(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        if (isMaintenanceMode()) {
            response.put("success", false);
            response.put("message", "Platform is under maintenance. Please try again later.");
            return response;
        }
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
        response.put("phone", s.getPhone());
        response.put("usn", s.getUsn());
        response.put("semester", s.getSemester());
        response.put("role", "student");
        return response;
    }

    public Map<String, Object> loginTeacher(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        if (isMaintenanceMode()) {
            response.put("success", false);
            response.put("message", "Platform is under maintenance. Please try again later.");
            return response;
        }
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
        response.put("phone", t.getPhone());
        response.put("employeeId", t.getEmployeeId());
        response.put("role", "teacher");
        return response;
    }

    public Map<String, Object> loginAdmin(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        Optional<Admin> opt = adminRepo.findByEmail(email);
        if (opt.isEmpty() || !encoder.matches(password, opt.get().getPassword())) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return response;
        }
        Admin a = opt.get();
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("adminId", a.getAdminId());
        response.put("name", a.getName());
        response.put("email", a.getEmail());
        response.put("role", "admin");
        return response;
    }

    // ── Change Password ───────────────────────────────────────────────────────

    @Transactional
    public Map<String, Object> changeStudentPassword(Integer studentId, String currentPassword, String newPassword) {
        Map<String, Object> response = new HashMap<>();
        Optional<Student> opt = studentRepo.findById(studentId);
        if (opt.isEmpty()) { response.put("success", false); response.put("message", "Student not found"); return response; }
        Student student = opt.get();
        if (!encoder.matches(currentPassword, student.getPassword())) {
            response.put("success", false); response.put("message", "Current password is incorrect"); return response;
        }
        student.setPassword(encoder.encode(newPassword));
        studentRepo.save(student);
        response.put("success", true); response.put("message", "Password changed successfully");
        return response;
    }

    @Transactional
    public Map<String, Object> changeTeacherPassword(Integer teacherId, String currentPassword, String newPassword) {
        Map<String, Object> response = new HashMap<>();
        Optional<Teacher> opt = teacherRepo.findById(teacherId);
        if (opt.isEmpty()) { response.put("success", false); response.put("message", "Teacher not found"); return response; }
        Teacher teacher = opt.get();
        if (!encoder.matches(currentPassword, teacher.getPassword())) {
            response.put("success", false); response.put("message", "Current password is incorrect"); return response;
        }
        teacher.setPassword(encoder.encode(newPassword));
        teacherRepo.save(teacher);
        response.put("success", true); response.put("message", "Password changed successfully");
        return response;
    }

    @Transactional
    public Map<String, Object> changeAdminPassword(Integer adminId, String currentPassword, String newPassword) {
        Map<String, Object> response = new HashMap<>();
        Optional<Admin> opt = adminRepo.findById(adminId);
        if (opt.isEmpty()) { response.put("success", false); response.put("message", "Admin not found"); return response; }
        Admin admin = opt.get();
        if (!encoder.matches(currentPassword, admin.getPassword())) {
            response.put("success", false); response.put("message", "Current password is incorrect"); return response;
        }
        admin.setPassword(encoder.encode(newPassword));
        adminRepo.save(admin);
        response.put("success", true); response.put("message", "Password changed successfully");
        return response;
    }

    // ── Force Reset (admin-initiated) ─────────────────────────────────────────

    @Transactional
    public Map<String, Object> forceResetStudentPassword(Integer studentId, String newPassword) {
        Map<String, Object> response = new HashMap<>();
        Optional<Student> opt = studentRepo.findById(studentId);
        if (opt.isEmpty()) { response.put("success", false); response.put("message", "Student not found"); return response; }
        Student student = opt.get();
        student.setPassword(encoder.encode(newPassword));
        studentRepo.save(student);
        response.put("success", true); response.put("message", "Password reset successfully");
        return response;
    }

    @Transactional
    public Map<String, Object> forceResetTeacherPassword(Integer teacherId, String newPassword) {
        Map<String, Object> response = new HashMap<>();
        Optional<Teacher> opt = teacherRepo.findById(teacherId);
        if (opt.isEmpty()) { response.put("success", false); response.put("message", "Teacher not found"); return response; }
        Teacher teacher = opt.get();
        teacher.setPassword(encoder.encode(newPassword));
        teacherRepo.save(teacher);
        response.put("success", true); response.put("message", "Password reset successfully");
        return response;
    }

    // ── Forgot Password (OTP already validated by controller) ──────────────

    @Transactional
    public boolean resetStudentPassword(String email, String otp, String newPassword) {
        Optional<Student> opt = studentRepo.findByEmail(email);
        if (opt.isEmpty()) return false;
        Student student = opt.get();
        student.setPassword(encoder.encode(newPassword));
        studentRepo.save(student);
        System.out.println("[AUTH] Student password reset for: " + email);
        return true;
    }

    @Transactional
    public boolean resetTeacherPassword(String email, String otp, String newPassword) {
        Optional<Teacher> opt = teacherRepo.findByEmail(email);
        if (opt.isEmpty()) return false;
        Teacher teacher = opt.get();
        teacher.setPassword(encoder.encode(newPassword));
        teacherRepo.save(teacher);
        System.out.println("[AUTH] Teacher password reset for: " + email);
        return true;
    }

    @Transactional
    public boolean resetAdminPassword(String email, String otp, String newPassword) {
        Optional<Admin> opt = adminRepo.findByEmail(email);
        if (opt.isEmpty()) return false;
        Admin admin = opt.get();
        admin.setPassword(encoder.encode(newPassword));
        adminRepo.save(admin);
        System.out.println("[AUTH] Admin password reset for: " + email);
        return true;
    }
}