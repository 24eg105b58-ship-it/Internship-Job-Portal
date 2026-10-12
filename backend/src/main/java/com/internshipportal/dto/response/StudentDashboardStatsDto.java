package com.internshipportal.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDashboardStatsDto {

    private long totalApplications;
    private long underReviewApplications;
    private long shortlistedApplications;
    private long selectedApplications;
    private long rejectedApplications;
    private long savedJobsCount;

    private List<ApplicationDto> recentApplications;
    private List<JobDto> recommendedJobs;
}
