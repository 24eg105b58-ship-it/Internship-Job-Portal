package com.internshipportal.controller;

import com.internshipportal.dto.request.ApplicationCreateRequest;
import com.internshipportal.dto.request.ApplicationStatusUpdateRequest;
import com.internshipportal.dto.response.ApiResponse;
import com.internshipportal.dto.response.ApplicationDto;
import com.internshipportal.dto.response.PagedResponse;
import com.internshipportal.service.ApplicationService;
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

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@Tag(name = "Applications", description = "Endpoints for job applications, tracking, status updates, and applicant review")
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Submit a new job application (Student only)")
    public ResponseEntity<ApiResponse<ApplicationDto>> applyForJob(
            @Valid @RequestBody ApplicationCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ApplicationDto application = applicationService.applyForJob(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Application submitted successfully", application));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get current student's applications with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationDto>>> getMyApplications(
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt"));
        PagedResponse<ApplicationDto> applications = applicationService.getMyApplications(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(ApiResponse.success(applications));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get application details by ID")
    public ResponseEntity<ApiResponse<ApplicationDto>> getApplicationById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ApplicationDto application = applicationService.getApplicationById(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(application));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Update applicant status (UNDER_REVIEW, SHORTLISTED, REJECTED, SELECTED)")
    public ResponseEntity<ApiResponse<ApplicationDto>> updateApplicationStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ApplicationDto updated = applicationService.updateApplicationStatus(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Application status updated to " + request.getStatus(), updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Withdraw an active application")
    public ResponseEntity<ApiResponse<Void>> withdrawApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        applicationService.withdrawApplication(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Application withdrawn successfully", null));
    }
}
