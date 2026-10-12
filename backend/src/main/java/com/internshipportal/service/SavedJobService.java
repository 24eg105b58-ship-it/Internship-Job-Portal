package com.internshipportal.service;

import com.internshipportal.dto.response.JobDto;
import com.internshipportal.dto.response.PagedResponse;
import org.springframework.data.domain.Pageable;

public interface SavedJobService {

    void saveJob(Long jobId, String studentEmail);

    void unsaveJob(Long jobId, String studentEmail);

    PagedResponse<JobDto> getMySavedJobs(String studentEmail, Pageable pageable);

    boolean isJobSaved(Long jobId, String studentEmail);
}
