package com.internshipportal.service;

import com.internshipportal.dto.request.ApplicationCreateRequest;
import com.internshipportal.dto.request.ApplicationStatusUpdateRequest;
import com.internshipportal.dto.response.ApplicationDto;
import com.internshipportal.dto.response.PagedResponse;
import com.internshipportal.entity.ApplicationStatus;
import org.springframework.data.domain.Pageable;

public interface ApplicationService {

    ApplicationDto applyForJob(ApplicationCreateRequest request, String studentEmail);

    PagedResponse<ApplicationDto> getMyApplications(String studentEmail, Pageable pageable);

    ApplicationDto getApplicationById(Long id, String currentUserEmail);

    ApplicationDto updateApplicationStatus(Long id, ApplicationStatusUpdateRequest request, String userEmail);

    PagedResponse<ApplicationDto> getJobApplications(Long jobId, String recruiterEmail, Pageable pageable);

    PagedResponse<ApplicationDto> searchRecruiterApplications(
            Long jobId,
            ApplicationStatus status,
            String search,
            String recruiterEmail,
            Pageable pageable
    );

    void withdrawApplication(Long id, String studentEmail);
}
