package com.internshipportal.repository;

import com.internshipportal.entity.Recruiter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecruiterRepository extends JpaRepository<Recruiter, Long> {

    Optional<Recruiter> findByUserId(Long userId);

    Optional<Recruiter> findByUserEmail(String email);

    @Query("SELECT r FROM Recruiter r JOIN r.user u WHERE " +
           "(:search IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(r.companyName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Recruiter> searchRecruiters(@Param("search") String search, Pageable pageable);
}
