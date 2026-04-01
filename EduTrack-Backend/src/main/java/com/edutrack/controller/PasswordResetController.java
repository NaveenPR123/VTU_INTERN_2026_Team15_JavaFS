package com.edutrack.controller;

import com.edutrack.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:3006","http://localhost:5500"})
public class PasswordResetController {

    @Autowired
    private AuthService authService;

    @PostMapping("/reset-password/student")
    public ResponseEntity<Map<String, Object>> resetStudentPassword(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String otp = body.get("otp");
            String newPassword = body.get("newPassword");
            if (email == null || otp == null || newPassword == null) {
                return ResponseEntity.ok(Map.of("success", false, "message", "Email, OTP, and new password are required"));
            }
            boolean success = authService.resetStudentPassword(email, otp, newPassword);
            return ResponseEntity.ok(Map.of("success", success, "message", success ? "Password reset successfully" : "Invalid OTP or email not found"));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "message", "Failed to reset password: " + e.getMessage()));
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
            boolean success = authService.resetTeacherPassword(email, otp, newPassword);
            return ResponseEntity.ok(Map.of("success", success, "message", success ? "Password reset successfully" : "Invalid OTP or email not found"));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "message", "Failed to reset password: " + e.getMessage()));
        }
    }
}
