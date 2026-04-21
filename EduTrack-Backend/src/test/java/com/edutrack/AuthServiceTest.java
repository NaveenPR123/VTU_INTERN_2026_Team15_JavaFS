package com.edutrack;

import com.edutrack.entity.Admin;
import com.edutrack.entity.Student;
import com.edutrack.entity.Teacher;
import com.edutrack.repository.AdminRepository;
import com.edutrack.repository.StudentRepository;
import com.edutrack.repository.SystemSettingsRepository;
import com.edutrack.repository.TeacherRepository;
import com.edutrack.service.AuthService;
import com.edutrack.service.OtpService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private StudentRepository studentRepo;
    @Mock private TeacherRepository teacherRepo;
    @Mock private AdminRepository adminRepo;
    @Mock private SystemSettingsRepository settingsRepo;
    @Mock private OtpService otpService;

    @InjectMocks
    private AuthService authService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    private Student mockStudent;
    private Teacher mockTeacher;
    private Admin mockAdmin;

    @BeforeEach
    void setUp() {
        mockStudent = new Student();
        mockStudent.setStudentId(1);
        mockStudent.setName("Test Student");
        mockStudent.setEmail("student@test.com");
        mockStudent.setPassword(encoder.encode("Test@123"));
        mockStudent.setDepartment("Computer Science and Engineering");
        mockStudent.setYear("3rd Year");

        mockTeacher = new Teacher();
        mockTeacher.setTeacherId(1);
        mockTeacher.setName("Test Teacher");
        mockTeacher.setEmail("teacher@test.com");
        mockTeacher.setPassword(encoder.encode("Test@123"));
        mockTeacher.setDepartment("Computer Science and Engineering");

        mockAdmin = new Admin();
        mockAdmin.setAdminId(1);
        mockAdmin.setName("Admin");
        mockAdmin.setEmail("admin@edutrack.com");
        mockAdmin.setPassword(encoder.encode("Admin@123"));
    }

    // ── Student Login ─────────────────────────────────────────

    @Test
    void studentLogin_validCredentials_returnsSuccess() {
        when(settingsRepo.findById(1)).thenReturn(Optional.empty());
        when(studentRepo.findByEmail("student@test.com")).thenReturn(Optional.of(mockStudent));

        Map<String, Object> result = authService.loginStudent("student@test.com", "Test@123");

        assertTrue((Boolean) result.get("success"));
        assertEquals("student", result.get("role"));
        assertEquals("Test Student", result.get("name"));
    }

    @Test
    void studentLogin_wrongPassword_returnsFailure() {
        when(settingsRepo.findById(1)).thenReturn(Optional.empty());
        when(studentRepo.findByEmail("student@test.com")).thenReturn(Optional.of(mockStudent));

        Map<String, Object> result = authService.loginStudent("student@test.com", "wrongpass");

        assertFalse((Boolean) result.get("success"));
        assertEquals("Invalid email or password", result.get("message"));
    }

    @Test
    void studentLogin_emailNotFound_returnsFailure() {
        when(settingsRepo.findById(1)).thenReturn(Optional.empty());
        when(studentRepo.findByEmail("nobody@test.com")).thenReturn(Optional.empty());

        Map<String, Object> result = authService.loginStudent("nobody@test.com", "Test@123");

        assertFalse((Boolean) result.get("success"));
    }

    // ── Teacher Login ─────────────────────────────────────────

    @Test
    void teacherLogin_validCredentials_returnsSuccess() {
        when(settingsRepo.findById(1)).thenReturn(Optional.empty());
        when(teacherRepo.findByEmail("teacher@test.com")).thenReturn(Optional.of(mockTeacher));

        Map<String, Object> result = authService.loginTeacher("teacher@test.com", "Test@123");

        assertTrue((Boolean) result.get("success"));
        assertEquals("teacher", result.get("role"));
    }

    @Test
    void teacherLogin_wrongPassword_returnsFailure() {
        when(settingsRepo.findById(1)).thenReturn(Optional.empty());
        when(teacherRepo.findByEmail("teacher@test.com")).thenReturn(Optional.of(mockTeacher));

        Map<String, Object> result = authService.loginTeacher("teacher@test.com", "wrongpass");

        assertFalse((Boolean) result.get("success"));
    }

    // ── Admin Login ───────────────────────────────────────────

    @Test
    void adminLogin_validCredentials_returnsSuccess() {
        when(adminRepo.findByEmail("admin@edutrack.com")).thenReturn(Optional.of(mockAdmin));

        Map<String, Object> result = authService.loginAdmin("admin@edutrack.com", "Admin@123");

        assertTrue((Boolean) result.get("success"));
        assertEquals("admin", result.get("role"));
    }

    @Test
    void adminLogin_wrongPassword_returnsFailure() {
        when(adminRepo.findByEmail("admin@edutrack.com")).thenReturn(Optional.of(mockAdmin));

        Map<String, Object> result = authService.loginAdmin("admin@edutrack.com", "wrongpass");

        assertFalse((Boolean) result.get("success"));
        assertEquals("Invalid email or password", result.get("message"));
    }

    @Test
    void adminLogin_emailNotFound_returnsFailure() {
        when(adminRepo.findByEmail("ghost@test.com")).thenReturn(Optional.empty());

        Map<String, Object> result = authService.loginAdmin("ghost@test.com", "Admin@123");

        assertFalse((Boolean) result.get("success"));
    }

    // ── Change Password ───────────────────────────────────────

    @Test
    void changeAdminPassword_correctCurrentPassword_returnsSuccess() {
        when(adminRepo.findById(1)).thenReturn(Optional.of(mockAdmin));
        when(adminRepo.save(any())).thenReturn(mockAdmin);

        Map<String, Object> result = authService.changeAdminPassword(1, "Admin@123", "NewPass@123");

        assertTrue((Boolean) result.get("success"));
        assertEquals("Password changed successfully", result.get("message"));
    }

    @Test
    void changeAdminPassword_wrongCurrentPassword_returnsFailure() {
        when(adminRepo.findById(1)).thenReturn(Optional.of(mockAdmin));

        Map<String, Object> result = authService.changeAdminPassword(1, "wrongpass", "NewPass@123");

        assertFalse((Boolean) result.get("success"));
        assertEquals("Current password is incorrect", result.get("message"));
    }

    @Test
    void changeAdminPassword_adminNotFound_returnsFailure() {
        when(adminRepo.findById(99)).thenReturn(Optional.empty());

        Map<String, Object> result = authService.changeAdminPassword(99, "Admin@123", "NewPass@123");

        assertFalse((Boolean) result.get("success"));
        assertEquals("Admin not found", result.get("message"));
    }

    @Test
    void changeStudentPassword_correctCurrentPassword_returnsSuccess() {
        when(studentRepo.findById(1)).thenReturn(Optional.of(mockStudent));
        when(studentRepo.save(any())).thenReturn(mockStudent);

        Map<String, Object> result = authService.changeStudentPassword(1, "Test@123", "NewPass@123");

        assertTrue((Boolean) result.get("success"));
    }

    @Test
    void changeStudentPassword_wrongCurrentPassword_returnsFailure() {
        when(studentRepo.findById(1)).thenReturn(Optional.of(mockStudent));

        Map<String, Object> result = authService.changeStudentPassword(1, "wrongpass", "NewPass@123");

        assertFalse((Boolean) result.get("success"));
        assertEquals("Current password is incorrect", result.get("message"));
    }

    // ── Registration ──────────────────────────────────────────

    @Test
    void registerStudent_newEmail_returnsSuccess() {
        when(settingsRepo.findById(1)).thenReturn(Optional.empty());
        when(studentRepo.existsByEmail("new@test.com")).thenReturn(false);
        when(studentRepo.save(any())).thenReturn(mockStudent);

        Student s = new Student();
        s.setName("New Student");
        s.setEmail("new@test.com");
        s.setPassword("Test@123");
        s.setDepartment("Computer Science and Engineering");
        s.setYear("1st Year");

        Map<String, Object> result = authService.registerStudent(s);

        assertTrue((Boolean) result.get("success"));
    }

    @Test
    void registerStudent_duplicateEmail_returnsFailure() {
        when(settingsRepo.findById(1)).thenReturn(Optional.empty());
        when(studentRepo.existsByEmail("student@test.com")).thenReturn(true);

        Student s = new Student();
        s.setEmail("student@test.com");
        s.setPassword("Test@123");
        s.setDepartment("CSE");
        s.setYear("1st Year");

        Map<String, Object> result = authService.registerStudent(s);

        assertFalse((Boolean) result.get("success"));
        assertEquals("Email already registered", result.get("message"));
    }
}
