package com.edutrack.controller;

import com.edutrack.entity.Student;
import com.edutrack.entity.Teacher;
import com.edutrack.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/*
  AUTH APIS
  POST /api/auth/register/student          → Register new student
  POST /api/auth/register/teacher          → Register new teacher
  POST /api/auth/login/student             → Student login
  POST /api/auth/login/teacher             → Teacher login
  POST /api/auth/change-password/student   → Change student password
  POST /api/auth/change-password/teacher   → Change teacher password
*/

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:3006","http://localhost:5500"})
public class AuthController {

    @Autowired private AuthService authService;

    // ── Register Student ──────────────────────────────────────
    @PostMapping("/register/student")
    public ResponseEntity<Map<String, Object>> registerStudent(@RequestBody Student student) {
        return ResponseEntity.ok(authService.registerStudent(student));
    }

    // ── Register Teacher ──────────────────────────────────────
    @PostMapping("/register/teacher")
    public ResponseEntity<Map<String, Object>> registerTeacher(@RequestBody Teacher teacher) {
        return ResponseEntity.ok(authService.registerTeacher(teacher));
    }

    // ── Student Login ─────────────────────────────────────────
    @PostMapping("/login/student")
    public ResponseEntity<Map<String, Object>> loginStudent(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(authService.loginStudent(body.get("email"), body.get("password")));
    }

    // ── Teacher Login ─────────────────────────────────────────
    @PostMapping("/login/teacher")
    public ResponseEntity<Map<String, Object>> loginTeacher(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(authService.loginTeacher(body.get("email"), body.get("password")));
    }

    // ── Change Password (Student) ─────────────────────────────
    // Body: { id, currentPassword, newPassword }
    @PostMapping("/change-password/student")
    public ResponseEntity<Map<String, Object>> changeStudentPassword(@RequestBody Map<String, Object> body) {
        try {
            if (body.get("id") == null || body.get("currentPassword") == null || body.get("newPassword") == null) {
                return ResponseEntity.ok(Map.of("success", false, "message", "id, currentPassword and newPassword are required"));
            }
            Integer id = Integer.valueOf(body.get("id").toString());
            return ResponseEntity.ok(authService.changeStudentPassword(id,
                    body.get("currentPassword").toString(),
                    body.get("newPassword").toString()));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "message", "Error: " + e.getMessage()));
        }
    }

    // ── Change Password (Teacher) ─────────────────────────────
    // Body: { id, currentPassword, newPassword }
    @PostMapping("/change-password/teacher")
    public ResponseEntity<Map<String, Object>> changeTeacherPassword(@RequestBody Map<String, Object> body) {
        try {
            if (body.get("id") == null || body.get("currentPassword") == null || body.get("newPassword") == null) {
                return ResponseEntity.ok(Map.of("success", false, "message", "id, currentPassword and newPassword are required"));
            }
            Integer id = Integer.valueOf(body.get("id").toString());
            return ResponseEntity.ok(authService.changeTeacherPassword(id,
                    body.get("currentPassword").toString(),
                    body.get("newPassword").toString()));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "message", "Error: " + e.getMessage()));
        }
    }
}
