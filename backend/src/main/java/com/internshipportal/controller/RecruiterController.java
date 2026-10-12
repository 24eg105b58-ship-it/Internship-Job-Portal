package com.internshipportal.controller;

import com.internshipportal.dto.request.RecruiterProfileRequest;
import com.internshipportal.dto.response.*;
import com.internshipportal.entity.ApplicationStatus;
import com.internshipportal.service.ApplicationService;
import com.internshipportal.service.JobService;
import com.internshipportal.service.RecruiterService;
import com.internshipportal.util.AppConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recruiters")
@RequiredArgsConstructor
@Tag(name = "Recruiters", description = "Endpoints for recruiter profile, dashboard, posted jobs, and applicant tracking")
public class RecruiterController {

    private final RecruiterService recruiterService;
    private final JobService jobService;
    private final ApplicationService applicationService;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Get current recruiter's profile and company details")
    public ResponseEntity<ApiResponse<RecruiterDto>> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        RecruiterDto profile = recruiterService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Update current recruiter's profile and company information")
    public ResponseEntity<ApiResponse<RecruiterDto>> updateProfile(
            @Valid @RequestBody RecruiterProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        RecruiterDto updated = recruiterService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Get recruiter dashboard statistics and recent activity")
    public ResponseEntity<ApiResponse<RecruiterDashboardStatsDto>> getDashboardStats(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        RecruiterDashboardStatsDto stats = recruiterService.getRecruiterDashboard(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/jobs")
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Get all jobs posted by the logged-in recruiter")
    public ResponseEntity<ApiResponse<PagedResponse<JobDto>>> getMyJobs(
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        PagedResponse<JobDto> jobs = jobService.getRecruiterJobs(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }

    @GetMapping("/applications")
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Search and filter applicants for recruiter's job postings")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationDto>>> getApplicants(
            @RequestParam(required = false) Long jobId,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt"));
        PagedResponse<ApplicationDto> applicants = applicationService.searchRecruiterApplications(
                jobId, status, search, userDetails.getUsername(), pageable
        );
        return ResponseEntity.ok(ApiResponse.success(applicants));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get recruiter public profile by ID")
    public ResponseEntity<ApiResponse<RecruiterDto>> getRecruiterById(@PathVariable Long id) {
        RecruiterDto dto = recruiterService.getRecruiterById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }
}
