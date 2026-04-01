package com.edutrack.controller;

import com.edutrack.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/otp")
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:3006","http://localhost:5500"})
public class OtpController {

    @Autowired private OtpService otpService;

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> sendOtp(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            otpService.generateAndSendOtp(email);
            return ResponseEntity.ok(Map.of("success", true, "message", "OTP sent to " + email));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "message", "Failed to send OTP: " + e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp   = body.get("otp");
        boolean valid = otpService.validateOtp(email, otp);
        return ResponseEntity.ok(Map.of("success", valid, "message", valid ? "OTP verified successfully" : "Invalid or expired OTP"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            otpService.sendPasswordResetOtp(email);
            return ResponseEntity.ok(Map.of("success", true, "message", "Password reset OTP sent to " + email));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "message", "Failed to send OTP: " + e.getMessage()));
        }
    }
}
