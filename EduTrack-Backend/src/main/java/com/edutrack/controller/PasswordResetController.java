package com.edutrack.controller;

import com.edutrack.service.AuthService;
import com.edutrack.service.OtpService;
import com.edutrack.repository.StudentRepository;
import com.edutrack.repository.TeacherRepository;
import com.edutrack.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class PasswordResetController {

    @Autowired private AuthService authService;
    @Autowired private OtpService otpService;
    @Autowired private StudentRepository studentRepo;
    @Autowired private TeacherRepository teacherRepo;
    @Autowired private AdminRepository adminRepo;

    @PostMapping("/reset-password/student")
    public ResponseEntity<Map<String, Object>> resetStudentPassword(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String otp = body.get("otp");
            String newPassword = body.get("newPassword");

            if (email == null || otp == null || newPassword == null) {
                return ResponseEntity.ok(Map.of("success", false, "message", "Email, OTP, and new password are required"));
            }
            // Check email exists first
            if (!studentRepo.existsByEmail(email)) {
                return ResponseEntity.ok(Map.of("success", false, "message", "No student account found with this email"));
            }
            // Validate OTP
            if (!otpService.validateOtp(email, otp)) {
                return ResponseEntity.ok(Map.of("success", false, "message", "Invalid or expired OTP"));
            }
            // Reset password
            boolean success = authService.resetStudentPassword(email, otp, newPassword);
            return ResponseEntity.ok(Map.of("success", success, "message", success ? "Password reset successfully" : "Failed to reset password"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(Map.of("success", false, "message", "Error: " + e.getMessage()));
        }
    }

    @PostMapping("/reset-password/teacher")
    public ResponseEntity<Map<String, Object>> resetTeacherPassword(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String otp = body.get("otp");
            String newPassword = body.get("newPassword");

            if (email == null || otp == null || newPassword == null) {
                return ResponseEntity.ok(Map.of("success", false, "message", "Email, OTP, and new password are required"));
            }
            if (!teacherRepo.existsByEmail(email)) {
                return ResponseEntity.ok(Map.of("success", false, "message", "No teacher account found with this email"));
            }
            if (!otpService.validateOtp(email, otp)) {
                return ResponseEntity.ok(Map.of("success", false, "message", "Invalid or expired OTP"));
            }
            boolean success = authService.resetTeacherPassword(email, otp, newPassword);
            return ResponseEntity.ok(Map.of("success", success, "message", success ? "Password reset successfully" : "Failed to reset password"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(Map.of("success", false, "message", "Error: " + e.getMessage()));
        }
    }

    @PostMapping("/reset-password/admin")
    public ResponseEntity<Map<String, Object>> resetAdminPassword(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String otp = body.get("otp");
            String newPassword = body.get("newPassword");

            if (email == null || otp == null || newPassword == null) {
                return ResponseEntity.ok(Map.of("success", false, "message", "Email, OTP, and new password are required"));
            }
            if (!adminRepo.existsByEmail(email)) {
                return ResponseEntity.ok(Map.of("success", false, "message", "No admin account found with this email"));
            }
            if (!otpService.validateOtp(email, otp)) {
                return ResponseEntity.ok(Map.of("success", false, "message", "Invalid or expired OTP"));
            }
            boolean success = authService.resetAdminPassword(email, otp, newPassword);
            return ResponseEntity.ok(Map.of("success", success, "message", success ? "Password reset successfully" : "Failed to reset password"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(Map.of("success", false, "message", "Error: " + e.getMessage()));
        }
    }
}
