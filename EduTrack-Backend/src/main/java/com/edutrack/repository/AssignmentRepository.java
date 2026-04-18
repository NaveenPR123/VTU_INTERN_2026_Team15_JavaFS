package com.edutrack.repository;

import com.edutrack.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Integer> {
    List<Assignment> findByCourse_CourseId(Integer courseId);

    @Transactional
    void deleteByCourse_CourseId(Integer courseId);
}
