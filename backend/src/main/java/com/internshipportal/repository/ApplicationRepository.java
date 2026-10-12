package com.internshipportal.repository;

import com.internshipportal.entity.Application;
import com.internshipportal.entity.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Page<Application> findByStudentId(Long studentId, Pageable pageable);

    Page<Application> findByStudentUserEmail(String email, Pageable pageable);

    Page<Application> findByJobId(Long jobId, Pageable pageable);

    Page<Application> findByJobRecruiterId(Long recruiterId, Pageable pageable);

    Page<Application> findByJobRecruiterUserEmail(String email, Pageable pageable);

    Page<Application> findByJobIdAndStatus(Long jobId, ApplicationStatus status, Pageable pageable);

    boolean existsByStudentIdAndJobId(Long studentId, Long jobId);

    Optional<Application> findByStudentIdAndJobId(Long studentId, Long jobId);

    long countByStatus(ApplicationStatus status);

    long countByJobRecruiterId(Long recruiterId);

    long countByJobRecruiterIdAndStatus(Long recruiterId, ApplicationStatus status);

    long countByStudentId(Long studentId);

    long countByStudentIdAndStatus(Long studentId, ApplicationStatus status);

    @Query("SELECT a.status, COUNT(a) FROM Application a GROUP BY a.status")
    List<Object[]> countApplicationsByStatus();

    @Query("SELECT a.job.title, a.job.companyName, COUNT(a) FROM Application a GROUP BY a.job.id, a.job.title, a.job.companyName ORDER BY COUNT(a) DESC")
    List<Object[]> findMostAppliedJobs(Pageable pageable);

    @Query("SELECT a FROM Application a WHERE " +
           "(:recruiterId IS NULL OR a.job.recruiter.id = :recruiterId) AND " +
           "(:jobId IS NULL OR a.job.id = :jobId) AND " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:search IS NULL OR LOWER(a.student.user.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.student.user.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.job.title) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Application> searchRecruiterApplications(
            @Param("recruiterId") Long recruiterId,
            @Param("jobId") Long jobId,
            @Param("status") ApplicationStatus status,
            @Param("search") String search,
            Pageable pageable
    );
}
