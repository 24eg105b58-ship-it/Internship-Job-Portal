package com.internshipportal.repository;

import com.internshipportal.entity.SavedJob;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {

    Page<SavedJob> findByStudentIdOrderBySavedAtDesc(Long studentId, Pageable pageable);

    Page<SavedJob> findByStudentUserEmailOrderBySavedAtDesc(String email, Pageable pageable);

    boolean existsByStudentIdAndJobId(Long studentId, Long jobId);

    boolean existsByStudentUserEmailAndJobId(String email, Long jobId);

    Optional<SavedJob> findByStudentIdAndJobId(Long studentId, Long jobId);

    Optional<SavedJob> findByStudentUserEmailAndJobId(String email, Long jobId);

    void deleteByStudentIdAndJobId(Long studentId, Long jobId);

    void deleteByStudentUserEmailAndJobId(String email, Long jobId);
}
