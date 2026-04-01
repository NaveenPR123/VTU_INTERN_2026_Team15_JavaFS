package com.edutrack.repository;

import com.edutrack.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {
    List<Attendance> findByStudent_StudentId(Integer studentId);
    List<Attendance> findByCourse_CourseId(Integer courseId);
    List<Attendance> findByStudent_StudentIdAndCourse_CourseId(Integer studentId, Integer courseId);
}
