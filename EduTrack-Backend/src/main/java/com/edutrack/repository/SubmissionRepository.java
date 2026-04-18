package com.edutrack.repository;

import com.edutrack.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Integer> {
    List<Submission> findByAssignment_AssignmentId(Integer assignmentId);
    List<Submission> findByStudent_StudentId(Integer studentId);
    Optional<Submission> findByAssignment_AssignmentIdAndStudent_StudentId(Integer assignmentId, Integer studentId);

    @Transactional
    void deleteByAssignment_AssignmentId(Integer assignmentId);
    void deleteByStudent_StudentId(Integer studentId);
}
