package com.edutrack.controller;

import com.edutrack.entity.*;
import com.edutrack.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/materials")
@CrossOrigin(origins = "*")
public class CourseMaterialController {

    @Autowired private CourseMaterialRepository materialRepo;
    @Autowired private CourseRepository         courseRepo;
    @Autowired private TeacherRepository        teacherRepo;

    private static final String UPLOAD_DIR = System.getProperty("user.home") + "/edutrack-materials/";

    // GET /api/materials/course/{courseId}
    @GetMapping("/course/{courseId}")
    public List<CourseMaterial> getByCourse(@PathVariable Integer courseId) {
        return materialRepo.findByCourse_CourseIdOrderByUploadedAtDesc(courseId);
    }

    // POST /api/materials/upload  (multipart: courseId, teacherId, title, description, file)
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> upload(
            @RequestParam("courseId")   Integer courseId,
            @RequestParam("teacherId")  Integer teacherId,
            @RequestParam("title")      String title,
            @RequestParam(value="description", required=false, defaultValue="") String description,
            @RequestParam("file")       MultipartFile file) {

        Map<String, Object> res = new HashMap<>();
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String filePath = UPLOAD_DIR + fileName;
            file.transferTo(new File(filePath));

            CourseMaterial m = new CourseMaterial();
            m.setCourse(courseRepo.findById(courseId).orElseThrow());
            m.setTeacher(teacherRepo.findById(teacherId).orElseThrow());
            m.setTitle(title);
            m.setDescription(description);
            m.setType("FILE");
            m.setUrl(filePath);
            m.setFileName(file.getOriginalFilename());
            m.setUploadedAt(LocalDateTime.now());
            materialRepo.save(m);

            res.put("success", true);
            res.put("message", "Material uploaded successfully");
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", "Upload failed: " + e.getMessage());
        }
        return ResponseEntity.ok(res);
    }

    // POST /api/materials/link  (JSON: courseId, teacherId, title, description, url)
    @PostMapping("/link")
    public ResponseEntity<Map<String, Object>> addLink(@RequestBody Map<String, String> body) {
        Map<String, Object> res = new HashMap<>();
        try {
            CourseMaterial m = new CourseMaterial();
            m.setCourse(courseRepo.findById(Integer.parseInt(body.get("courseId"))).orElseThrow());
            m.setTeacher(teacherRepo.findById(Integer.parseInt(body.get("teacherId"))).orElseThrow());
            m.setTitle(body.get("title"));
            m.setDescription(body.getOrDefault("description", ""));
            m.setType("LINK");
            m.setUrl(body.get("url"));
            m.setUploadedAt(LocalDateTime.now());
            materialRepo.save(m);
            res.put("success", true);
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", e.getMessage());
        }
        return ResponseEntity.ok(res);
    }

    // DELETE /api/materials/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Integer id) {
        materialRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true));
    }

    // GET /api/materials/download/{id}
    @GetMapping("/download/{id}")
    public ResponseEntity<org.springframework.core.io.Resource> download(@PathVariable Integer id) {
        try {
            com.edutrack.entity.CourseMaterial m = materialRepo.findById(id).orElse(null);
            if (m == null || m.getFileName() == null) return ResponseEntity.notFound().build();

            // Use full path from url field if available, otherwise construct from UPLOAD_DIR
            String fullPath = (m.getUrl() != null && m.getUrl().startsWith("/")) ? m.getUrl() : UPLOAD_DIR + m.getFileName();
            java.nio.file.Path filePath = java.nio.file.Paths.get(fullPath);
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(filePath.toUri());
            if (!resource.exists()) return ResponseEntity.notFound().build();

            String contentType = java.nio.file.Files.probeContentType(filePath);
            if (contentType == null) contentType = "application/octet-stream";

            return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filePath.getFileName().toString() + "\"")
                .header("Access-Control-Allow-Origin", "*")
                .body(resource);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
