package com.internshipportal.dto.response;

import com.internshipportal.entity.JobStatus;
import com.internshipportal.entity.JobType;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDto {

    private Long id;
    private String title;
    private String companyName;
    private String description;
    private String responsibilities;
    private String requirements;
    private String location;
    private JobType jobType;
    private String salary;
    private String experience;
    private String skills;
    private LocalDate deadline;
    private Integer openings;
    private JobStatus status;

    private Long recruiterId;
    private String recruiterName;
    private String recruiterEmail;
    private String companyWebsite;
    private String companyLogo;

    private Long applicantCount;
    private Boolean isApplied;
    private Boolean isSaved;
    private String applicationStatus;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
