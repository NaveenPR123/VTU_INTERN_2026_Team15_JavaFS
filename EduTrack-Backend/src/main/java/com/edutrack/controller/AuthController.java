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
  POST /api/auth/register/student  → Register new student
  POST /api/auth/register/teacher  → Register new teacher
  POST /api/auth/login/student     → Student login
  POST /api/auth/login/teacher     → Teacher login
*/

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired private AuthService authService;

    // ── Register Student ──────────────────────────────────────
    // POST /api/auth/register/student
    // Body: { name, email, password, phone, department, year }
    @PostMapping("/register/student")
    public ResponseEntity<Map<String, Object>> registerStudent(@RequestBody Student student) {
        Map<String, Object> response = authService.registerStudent(student);
        return ResponseEntity.ok(response);
    }

    // ── Register Teacher ──────────────────────────────────────
    // POST /api/auth/register/teacher
    // Body: { name, email, password, department }
    @PostMapping("/register/teacher")
    public ResponseEntity<Map<String, Object>> registerTeacher(@RequestBody Teacher teacher) {
        Map<String, Object> response = authService.registerTeacher(teacher);
        return ResponseEntity.ok(response);
    }

    // ── Student Login ─────────────────────────────────────────
    // POST /api/auth/login/student
    // Body: { email, password }
    @PostMapping("/login/student")
    public ResponseEntity<Map<String, Object>> loginStudent(@RequestBody Map<String, String> body) {
        Map<String, Object> response = authService.loginStudent(
                body.get("email"),
                body.get("password")
        );
        return ResponseEntity.ok(response);
    }

    // ── Teacher Login ─────────────────────────────────────────
    // POST /api/auth/login/teacher
    // Body: { email, password }
    @PostMapping("/login/teacher")
    public ResponseEntity<Map<String, Object>> loginTeacher(@RequestBody Map<String, String> body) {
        Map<String, Object> response = authService.loginTeacher(
                body.get("email"),
                body.get("password")
        );
        return ResponseEntity.ok(response);
    }
}
