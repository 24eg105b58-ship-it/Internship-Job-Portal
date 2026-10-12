package com.internshipportal.service;

import com.internshipportal.dto.request.JobCreateRequest;
import com.internshipportal.dto.request.JobUpdateRequest;
import com.internshipportal.dto.response.JobDto;
import com.internshipportal.dto.response.PagedResponse;
import com.internshipportal.entity.JobStatus;
import com.internshipportal.entity.JobType;
import org.springframework.data.domain.Pageable;

public interface JobService {

    JobDto createJob(JobCreateRequest request, String recruiterEmail);

    JobDto updateJob(Long id, JobUpdateRequest request, String userEmail);

    void deleteJob(Long id, String userEmail);

    JobDto getJobById(Long id, String currentUserEmail);

    PagedResponse<JobDto> searchJobs(
            String search,
            String location,
            String company,
            JobType jobType,
            JobStatus status,
            Pageable pageable,
            String currentUserEmail
    );

    PagedResponse<JobDto> getRecruiterJobs(String recruiterEmail, Pageable pageable);

    JobDto approveJob(Long id, String adminEmail);

    JobDto rejectJob(Long id, String reason, String adminEmail);
}
