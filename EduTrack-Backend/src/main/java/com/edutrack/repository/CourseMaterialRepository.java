package com.edutrack.repository;

import com.edutrack.entity.CourseMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseMaterialRepository extends JpaRepository<CourseMaterial, Integer> {
    List<CourseMaterial> findByCourse_CourseIdOrderByUploadedAtDesc(Integer courseId);
    void deleteByCourse_CourseId(Integer courseId);
}
