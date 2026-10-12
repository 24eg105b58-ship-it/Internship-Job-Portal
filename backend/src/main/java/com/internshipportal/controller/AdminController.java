package com.internshipportal.controller;

import com.internshipportal.dto.response.*;
import com.internshipportal.entity.ApplicationStatus;
import com.internshipportal.entity.JobStatus;
import com.internshipportal.entity.JobType;
import com.internshipportal.service.AdminService;
import com.internshipportal.service.JobService;
import com.internshipportal.util.AppConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Administrator", description = "Endpoints for platform administration, user management, job moderation, and analytics reports")
public class AdminController {

    private final AdminService adminService;
    private final JobService jobService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard statistics, metrics, and recent activity")
    public ResponseEntity<ApiResponse<AdminDashboardStatsDto>> getDashboardStats() {
        AdminDashboardStatsDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/reports")
    @Operation(summary = "Get platform analytical reports and trend distributions")
    public ResponseEntity<ApiResponse<AdminReportDto>> getReports() {
        AdminReportDto reports = adminService.getReports();
        return ResponseEntity.ok(ApiResponse.success(reports));
    }

    @GetMapping("/students")
    @Operation(summary = "List and search students with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<StudentDto>>> getAllStudents(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        PagedResponse<StudentDto> students = adminService.getAllStudents(search, pageable);
        return ResponseEntity.ok(ApiResponse.success(students));
    }

    @GetMapping("/recruiters")
    @Operation(summary = "List and search recruiters with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<RecruiterDto>>> getAllRecruiters(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        PagedResponse<RecruiterDto> recruiters = adminService.getAllRecruiters(search, pageable);
        return ResponseEntity.ok(ApiResponse.success(recruiters));
    }

    @GetMapping("/jobs")
    @Operation(summary = "List all jobs with filters and pagination for moderation")
    public ResponseEntity<ApiResponse<PagedResponse<JobDto>>> getAllJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String company,
            @RequestParam(required = false) JobType jobType,
            @RequestParam(required = false) JobStatus status,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        PagedResponse<JobDto> jobs = jobService.searchJobs(search, location, company, jobType, status, pageable, null);
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }

    @GetMapping("/applications")
    @Operation(summary = "List all platform applications with filters and pagination")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationDto>>> getAllApplications(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt"));
        PagedResponse<ApplicationDto> applications = adminService.getAllApplications(search, status, pageable);
        return ResponseEntity.ok(ApiResponse.success(applications));
    }

    @PutMapping("/users/{id}/status")
    @Operation(summary = "Activate or deactivate a user account")
    public ResponseEntity<ApiResponse<UserDto>> toggleUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body
    ) {
        boolean active = body.getOrDefault("active", true);
        UserDto userDto = adminService.toggleUserStatus(id, active);
        String action = active ? "activated" : "deactivated";
        return ResponseEntity.ok(ApiResponse.success("User account " + action + " successfully", userDto));
    }

    @PostMapping("/jobs/{id}/approve")
    @Operation(summary = "Approve a job posting")
    public ResponseEntity<ApiResponse<JobDto>> approveJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        JobDto approved = adminService.approveJob(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Job approved successfully", approved));
    }

    @PostMapping("/jobs/{id}/reject")
    @Operation(summary = "Reject a job posting")
    public ResponseEntity<ApiResponse<JobDto>> rejectJob(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String reason = body != null ? body.get("reason") : null;
        JobDto rejected = adminService.rejectJob(id, reason, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Job rejected", rejected));
    }
}
