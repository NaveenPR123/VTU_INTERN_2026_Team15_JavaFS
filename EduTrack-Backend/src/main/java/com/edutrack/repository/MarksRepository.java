package com.edutrack.repository;

import com.edutrack.entity.Marks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MarksRepository extends JpaRepository<Marks, Integer> {
    List<Marks> findByStudent_StudentId(Integer studentId);
    List<Marks> findByCourse_CourseId(Integer courseId);
}
