package com.internshipportal.dto.response;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardStatsDto {

    private long totalStudents;
    private long totalRecruiters;
    private long totalJobs;
    private long pendingJobs;
    private long approvedJobs;
    private long totalApplications;
    private long shortlistedCandidates;

    private Map<String, Long> applicationsByStatus;
    private Map<String, Long> jobsByType;
    private List<ApplicationDto> recentApplications;
    private List<JobDto> recentJobs;
    private List<UserDto> recentUsers;
}
