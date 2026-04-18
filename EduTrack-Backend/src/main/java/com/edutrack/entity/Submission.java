package com.edutrack.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer submissionId;

    @ManyToOne
    @JoinColumn(name = "assignment_id", nullable = false)
    @JsonIgnoreProperties({"submissions", "course"})
    private Assignment assignment;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"password", "course", "submissions"})
    private Student student;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String filePath;

    @Column(nullable = false)
    private LocalDateTime submittedAt;

    private String grade;

    @Column(columnDefinition = "TEXT")
    private String comment;
}
