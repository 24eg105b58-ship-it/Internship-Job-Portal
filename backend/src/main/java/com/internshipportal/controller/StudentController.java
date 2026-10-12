package com.internshipportal.controller;

import com.internshipportal.dto.request.StudentProfileRequest;
import com.internshipportal.dto.response.ApiResponse;
import com.internshipportal.dto.response.StudentDashboardStatsDto;
import com.internshipportal.dto.response.StudentDto;
import com.internshipportal.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@Tag(name = "Students", description = "Endpoints for student profile management and student dashboard")
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get current student's full profile")
    public ResponseEntity<ApiResponse<StudentDto>> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        StudentDto profile = studentService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Update current student's profile details")
    public ResponseEntity<ApiResponse<StudentDto>> updateProfile(
            @Valid @RequestBody StudentProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        StudentDto updated = studentService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get student dashboard statistics and recent activities")
    public ResponseEntity<ApiResponse<StudentDashboardStatsDto>> getDashboardStats(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        StudentDashboardStatsDto stats = studentService.getStudentDashboard(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Get student profile details by ID (Recruiter or Admin)")
    public ResponseEntity<ApiResponse<StudentDto>> getStudentById(@PathVariable Long id) {
        StudentDto studentDto = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success(studentDto));
    }
}
