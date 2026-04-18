// ── StudentRepository.java ───────────────────────────────────
package com.edutrack.repository;

import com.edutrack.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<Student> findByUsn(String usn);
    List<Student> findByDepartmentIgnoreCase(String department);
}

