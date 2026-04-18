package com.edutrack.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "course_materials")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer materialId;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    // FILE or LINK
    @Column(nullable = false)
    private String type;

    // for FILE: stored path; for LINK: the URL
    @Column(columnDefinition = "TEXT")
    private String url;

    private String fileName;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;
}
