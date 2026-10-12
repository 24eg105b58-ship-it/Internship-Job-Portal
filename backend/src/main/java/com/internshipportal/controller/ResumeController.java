package com.internshipportal.controller;

import com.internshipportal.dto.response.ApiResponse;
import com.internshipportal.dto.response.ResumeDto;
import com.internshipportal.service.ResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
@Tag(name = "Resumes", description = "Endpoints for resume upload, retrieval, deletion, and file download")
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Upload a new resume document (PDF, DOC, DOCX up to 10MB)")
    public ResponseEntity<ApiResponse<ResumeDto>> uploadResume(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ResumeDto resumeDto = resumeService.uploadResume(file, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Resume uploaded successfully", resumeDto));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get list of all resumes uploaded by the current student")
    public ResponseEntity<ApiResponse<List<ResumeDto>>> getMyResumes(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<ResumeDto> resumes = resumeService.getMyResumes(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(resumes));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get resume metadata by ID")
    public ResponseEntity<ApiResponse<ResumeDto>> getResumeById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ResumeDto resumeDto = resumeService.getResumeById(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(resumeDto));
    }

    @PutMapping("/{id}/default")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Set a resume as default for applications")
    public ResponseEntity<ApiResponse<ResumeDto>> setDefaultResume(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ResumeDto resumeDto = resumeService.setDefaultResume(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Default resume updated", resumeDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Delete an uploaded resume")
    public ResponseEntity<ApiResponse<Void>> deleteResume(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        resumeService.deleteResume(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Resume deleted successfully", null));
    }

    @GetMapping("/{id}/download")
    @Operation(summary = "Download or stream the resume document file")
    public ResponseEntity<Resource> downloadResume(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ResumeDto resumeDto = resumeService.getResumeById(id, userDetails.getUsername());
        Resource resource = resumeService.downloadResumeFile(id, userDetails.getUsername());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(resumeDto.getFileType() != null ? resumeDto.getFileType() : MediaType.APPLICATION_OCTET_STREAM_VALUE))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resumeDto.getOriginalFileName() + "\"")
                .body(resource);
    }
}
