package com.internshipportal.controller;

import com.internshipportal.dto.request.JobCreateRequest;
import com.internshipportal.dto.request.JobUpdateRequest;
import com.internshipportal.dto.response.ApiResponse;
import com.internshipportal.dto.response.ApplicationDto;
import com.internshipportal.dto.response.JobDto;
import com.internshipportal.dto.response.PagedResponse;
import com.internshipportal.entity.JobStatus;
import com.internshipportal.entity.JobType;
import com.internshipportal.service.ApplicationService;
import com.internshipportal.service.JobService;
import com.internshipportal.service.SavedJobService;
import com.internshipportal.util.AppConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@Tag(name = "Jobs", description = "Endpoints for job postings, browsing, searching, filtering, and management")
public class JobController {

    private final JobService jobService;
    private final ApplicationService applicationService;
    private final SavedJobService savedJobService;

    @GetMapping
    @Operation(summary = "Browse, search, and filter job postings with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<JobDto>>> searchJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String company,
            @RequestParam(required = false) JobType jobType,
            @RequestParam(required = false) JobStatus status,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        // If not admin/recruiter, default to APPROVED jobs
        JobStatus effectiveStatus = status;
        if (effectiveStatus == null) {
            effectiveStatus = JobStatus.APPROVED;
        }

        String userEmail = userDetails != null ? userDetails.getUsername() : null;
        PagedResponse<JobDto> result = jobService.searchJobs(search, location, company, jobType, effectiveStatus, pageable, userEmail);

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single job details by ID")
    public ResponseEntity<ApiResponse<JobDto>> getJobById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userEmail = userDetails != null ? userDetails.getUsername() : null;
        JobDto jobDto = jobService.getJobById(id, userEmail);
        return ResponseEntity.ok(ApiResponse.success(jobDto));
    }

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Post a new job or internship (Recruiter only)")
    public ResponseEntity<ApiResponse<JobDto>> createJob(
            @Valid @RequestBody JobCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        JobDto created = jobService.createJob(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Job posting created and submitted for approval", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Update an existing job posting")
    public ResponseEntity<ApiResponse<JobDto>> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        JobDto updated = jobService.updateJob(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Job updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Delete a job posting")
    public ResponseEntity<ApiResponse<Void>> deleteJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        jobService.deleteJob(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Job deleted successfully", null));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Approve a job posting (Admin only)")
    public ResponseEntity<ApiResponse<JobDto>> approveJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        JobDto approved = jobService.approveJob(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Job posting approved successfully", approved));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Reject a job posting (Admin only)")
    public ResponseEntity<ApiResponse<JobDto>> rejectJob(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String reason = body != null ? body.get("reason") : null;
        JobDto rejected = jobService.rejectJob(id, reason, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Job posting rejected", rejected));
    }

    @GetMapping("/{id}/applicants")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Get applicants for a specific job posting")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationDto>>> getJobApplicants(
            @PathVariable Long id,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt"));
        PagedResponse<ApplicationDto> applicants = applicationService.getJobApplications(id, userDetails.getUsername(), pageable);
        return ResponseEntity.ok(ApiResponse.success(applicants));
    }

    @PostMapping("/{id}/save")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Save a job for later (Student only)")
    public ResponseEntity<ApiResponse<Void>> saveJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        savedJobService.saveJob(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Job saved successfully", null));
    }

    @DeleteMapping("/{id}/save")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Remove a job from saved jobs (Student only)")
    public ResponseEntity<ApiResponse<Void>> unsaveJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        savedJobService.unsaveJob(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Job removed from saved list", null));
    }

    @GetMapping("/saved")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get current student's saved jobs")
    public ResponseEntity<ApiResponse<PagedResponse<JobDto>>> getSavedJobs(
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Pageable pageable = PageRequest.of(page, size);
        PagedResponse<JobDto> savedJobs = savedJobService.getMySavedJobs(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(ApiResponse.success(savedJobs));
    }
}
