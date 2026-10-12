package com.internshipportal.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecruiterDashboardStatsDto {

    private long totalJobs;
    private long activeJobs;
    private long pendingJobs;
    private long totalApplicants;
    private long shortlistedCandidates;
    private long selectedCandidates;
    private long pendingReviewApplicants;

    private List<ApplicationDto> recentApplicants;
    private List<JobDto> recentJobs;
}
