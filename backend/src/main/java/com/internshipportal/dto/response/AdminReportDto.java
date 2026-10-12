package com.internshipportal.dto.response;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminReportDto {

    private long totalUsers;
    private long totalStudents;
    private long totalRecruiters;
    private long totalJobs;
    private long totalApplications;

    private Map<String, Long> applicationStatusDistribution;
    private Map<String, Long> jobTypeDistribution;
    private List<Map<String, Object>> topRecruiters;
    private List<Map<String, Object>> mostAppliedJobs;
    private List<Map<String, Object>> monthlyApplicationTrends;
}
