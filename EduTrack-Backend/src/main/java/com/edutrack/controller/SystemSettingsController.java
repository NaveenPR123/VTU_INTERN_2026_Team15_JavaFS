package com.edutrack.controller;

import com.edutrack.entity.SystemSettings;
import com.edutrack.repository.SystemSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/*
  SYSTEM SETTINGS APIS
  GET  /api/system/settings        → Get current settings
  PUT  /api/system/settings        → Update settings (admin only)
*/
@RestController
@RequestMapping("/api/system")
@CrossOrigin(origins = "*")
public class SystemSettingsController {

    @Autowired private SystemSettingsRepository settingsRepo;

    private SystemSettings getOrCreate() {
        return settingsRepo.findById(1).orElseGet(() -> {
            SystemSettings s = new SystemSettings();
            s.setId(1);
            s.setActiveYear("2025-26");
            s.setActiveSemester("Even");
            s.setMaintenanceMode(false);
            s.setRegistrationOpen(true);
            return settingsRepo.save(s);
        });
    }

    @GetMapping("/settings")
    public ResponseEntity<SystemSettings> getSettings() {
        return ResponseEntity.ok(getOrCreate());
    }

    @PutMapping("/settings")
    public ResponseEntity<SystemSettings> updateSettings(@RequestBody Map<String, Object> body) {
        SystemSettings s = getOrCreate();
        if (body.containsKey("activeYear"))       s.setActiveYear(body.get("activeYear").toString());
        if (body.containsKey("activeSemester"))   s.setActiveSemester(body.get("activeSemester").toString());
        if (body.containsKey("maintenanceMode"))  s.setMaintenanceMode(Boolean.parseBoolean(body.get("maintenanceMode").toString()));
        if (body.containsKey("registrationOpen")) s.setRegistrationOpen(Boolean.parseBoolean(body.get("registrationOpen").toString()));
        return ResponseEntity.ok(settingsRepo.save(s));
    }
}
