package com.edutrack.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

// SDD DB: student_id, name, email, password, phone, department, year, course_id

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer studentId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    private String phone;

    @Column(unique = true)
    private String usn;  // e.g. 1VT22CS001

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String year;   // e.g. "3rd Year"

    private String semester; // e.g. "Sem 5"

    @Column(nullable = false)
    private String status = "Active"; // "Active", "Suspended", "Graduated"


    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;
}
