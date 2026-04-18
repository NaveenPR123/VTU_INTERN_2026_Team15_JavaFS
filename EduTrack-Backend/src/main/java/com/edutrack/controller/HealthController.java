package com.edutrack.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:3006","http://localhost:5500"})
public class HealthController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/db")
    public ResponseEntity<Map<String, Object>> checkDb() {
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return ResponseEntity.ok(Map.of("status", "Connected"));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("status", "Disconnected", "error", e.getMessage()));
        }
    }
}
