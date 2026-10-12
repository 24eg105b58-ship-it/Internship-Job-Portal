package com.internshipportal.repository;

import com.internshipportal.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {

    List<Resume> findByStudentIdOrderByUploadedAtDesc(Long studentId);

    List<Resume> findByStudentUserEmailOrderByUploadedAtDesc(String email);

    Optional<Resume> findByStudentIdAndIsDefaultTrue(Long studentId);

    long countByStudentId(Long studentId);
}
