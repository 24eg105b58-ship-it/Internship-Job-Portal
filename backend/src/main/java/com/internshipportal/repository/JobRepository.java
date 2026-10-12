package com.internshipportal.repository;

import com.internshipportal.entity.Job;
import com.internshipportal.entity.JobStatus;
import com.internshipportal.entity.JobType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {

    Page<Job> findByRecruiterId(Long recruiterId, Pageable pageable);

    Page<Job> findByRecruiterUserEmail(String email, Pageable pageable);

    Page<Job> findByStatus(JobStatus status, Pageable pageable);

    long countByStatus(JobStatus status);

    long countByRecruiterId(Long recruiterId);

    long countByRecruiterIdAndStatus(Long recruiterId, JobStatus status);

    @Query("SELECT j FROM Job j WHERE " +
           "(:status IS NULL OR j.status = :status) AND " +
           "(:jobType IS NULL OR j.jobType = :jobType) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:company IS NULL OR LOWER(j.companyName) LIKE LOWER(CONCAT('%', :company, '%'))) AND " +
           "(:search IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(j.companyName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(j.skills) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(j.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Job> searchJobs(
            @Param("search") String search,
            @Param("location") String location,
            @Param("company") String company,
            @Param("jobType") JobType jobType,
            @Param("status") JobStatus status,
            Pageable pageable
    );

    @Query("SELECT j.jobType, COUNT(j) FROM Job j GROUP BY j.jobType")
    List<Object[]> countJobsByJobType();

    @Query("SELECT j.companyName, COUNT(j) FROM Job j GROUP BY j.companyName ORDER BY COUNT(j) DESC")
    List<Object[]> findTopRecruitersByJobs(Pageable pageable);
}
