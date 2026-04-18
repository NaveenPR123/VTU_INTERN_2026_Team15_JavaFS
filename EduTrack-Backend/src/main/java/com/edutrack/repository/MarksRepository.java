package com.edutrack.repository;

import com.edutrack.entity.Marks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MarksRepository extends JpaRepository<Marks, Integer> {
    List<Marks> findByStudent_StudentId(Integer studentId);
    List<Marks> findByCourse_CourseId(Integer courseId);
    Optional<Marks> findByStudent_StudentIdAndCourse_CourseId(Integer studentId, Integer courseId);

    @org.springframework.transaction.annotation.Transactional
    void deleteByCourse_CourseId(Integer courseId);
    void deleteByStudent_StudentId(Integer studentId);
}
