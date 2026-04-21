package com.edutrack.controller;

import com.edutrack.entity.*;
import com.edutrack.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "*")
public class SubmissionController {

    @Autowired private SubmissionRepository submissionRepo;
    @Autowired private AssignmentRepository assignmentRepo;
    @Autowired private StudentRepository    studentRepo;

    private static final String UPLOAD_DIR = System.getProperty("user.home") + "/edutrack-uploads/";

    // POST /api/submissions/upload
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> upload(
            @RequestParam("assignmentId") Integer assignmentId,
            @RequestParam("studentId")    Integer studentId,
            @RequestParam("file")         MultipartFile file) {

        Map<String, Object> res = new HashMap<>();
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));

            String fileName = studentId + "_" + assignmentId + "_" + file.getOriginalFilename();
            String filePath = UPLOAD_DIR + fileName;
            file.transferTo(new File(filePath));

            Optional<Submission> existing = submissionRepo
                .findByAssignment_AssignmentIdAndStudent_StudentId(assignmentId, studentId);

            Submission submission = existing.orElse(new Submission());
            submission.setAssignment(assignmentRepo.findById(assignmentId).orElseThrow());
            submission.setStudent(studentRepo.findById(studentId).orElseThrow());
            submission.setFileName(file.getOriginalFilename());
            submission.setFilePath(filePath);
            submission.setSubmittedAt(LocalDateTime.now());
            submissionRepo.save(submission);

            res.put("success", true);
            res.put("message", "Assignment submitted successfully");
            res.put("fileName", file.getOriginalFilename());
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", "Upload failed: " + e.getMessage());
        }
        return ResponseEntity.ok(res);
    }

    // GET /api/submissions/assignment/{id}
    @GetMapping("/assignment/{assignmentId}")
    public List<Submission> getByAssignment(@PathVariable Integer assignmentId) {
        return submissionRepo.findByAssignment_AssignmentId(assignmentId);
    }

    // GET /api/submissions/student/{id}
    @GetMapping("/student/{studentId}")
    public List<Submission> getByStudent(@PathVariable Integer studentId) {
        return submissionRepo.findByStudent_StudentId(studentId);
    }

    // GET /api/submissions/check?assignmentId=1&studentId=1
    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> check(
            @RequestParam Integer assignmentId,
            @RequestParam Integer studentId) {
        Map<String, Object> res = new HashMap<>();
        Optional<Submission> sub = submissionRepo
            .findByAssignment_AssignmentIdAndStudent_StudentId(assignmentId, studentId);
        res.put("submitted", sub.isPresent());
        sub.ifPresent(s -> {
            res.put("submissionId", s.getSubmissionId());
            res.put("fileName", s.getFileName());
            res.put("submittedAt", s.getSubmittedAt().toString());
            res.put("grade", s.getGrade());
            res.put("comment", s.getComment());
        });
        return ResponseEntity.ok(res);
    }

    // PUT /api/submissions/{id}/grade
    @PutMapping("/{id}/grade")
    public ResponseEntity<Map<String, Object>> grade(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body) {
        Map<String, Object> res = new HashMap<>();
        return submissionRepo.findById(id).map(s -> {
            if (body.containsKey("grade"))   s.setGrade(body.get("grade"));
            if (body.containsKey("comment")) s.setComment(body.get("comment"));
            submissionRepo.save(s);
            res.put("success", true);
            res.put("message", "Graded successfully");
            return ResponseEntity.ok(res);
        }).orElseGet(() -> {
            res.put("success", false);
            res.put("message", "Submission not found");
            return ResponseEntity.ok(res);
        });
    }

    // GET /api/submissions/download/{submissionId}
    @GetMapping("/download/{submissionId}")
    public ResponseEntity<Resource> download(@PathVariable Integer submissionId) {
        try {
            Optional<Submission> opt = submissionRepo.findById(submissionId);
            if (opt.isEmpty()) return ResponseEntity.notFound().build();

            Submission sub = opt.get();
            Path filePath = Paths.get(sub.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) return ResponseEntity.notFound().build();

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) contentType = "application/octet-stream";

            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + sub.getFileName() + "\"")
                .body(resource);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
// Note: this line intentionally left blank — see patch below