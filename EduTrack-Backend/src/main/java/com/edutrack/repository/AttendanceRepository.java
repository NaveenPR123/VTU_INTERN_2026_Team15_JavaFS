package com.edutrack.repository;

import com.edutrack.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {
    List<Attendance> findByStudent_StudentId(Integer studentId);
    List<Attendance> findByCourse_CourseId(Integer courseId);
    List<Attendance> findByStudent_StudentIdAndCourse_CourseId(Integer studentId, Integer courseId);
    List<Attendance> findByCourse_CourseIdAndAttendanceDate(Integer courseId, LocalDate date);
    Optional<Attendance> findByStudent_StudentIdAndCourse_CourseIdAndAttendanceDate(Integer studentId, Integer courseId, LocalDate date);

    @org.springframework.transaction.annotation.Transactional
    void deleteByCourse_CourseId(Integer courseId);
    void deleteByStudent_StudentId(Integer studentId);
}
