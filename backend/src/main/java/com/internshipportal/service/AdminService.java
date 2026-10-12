package com.internshipportal.service;

import com.internshipportal.dto.response.*;
import com.internshipportal.entity.ApplicationStatus;
import org.springframework.data.domain.Pageable;

public interface AdminService {

    AdminDashboardStatsDto getDashboardStats();

    AdminReportDto getReports();

    PagedResponse<StudentDto> getAllStudents(String search, Pageable pageable);

    PagedResponse<RecruiterDto> getAllRecruiters(String search, Pageable pageable);

    PagedResponse<ApplicationDto> getAllApplications(String search, ApplicationStatus status, Pageable pageable);

    JobDto approveJob(Long jobId, String adminEmail);

    JobDto rejectJob(Long jobId, String reason, String adminEmail);

    UserDto toggleUserStatus(Long userId, boolean active);
}
