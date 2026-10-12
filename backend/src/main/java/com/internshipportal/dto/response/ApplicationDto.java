package com.internshipportal.dto.response;

import com.internshipportal.entity.ApplicationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationDto {

    private Long id;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentPhone;
    private String studentUniversity;
    private String studentDegree;
    private String studentSkills;
    private Double studentCgpa;

    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String jobLocation;
    private String jobType;
    private String jobSalary;

    private Long resumeId;
    private String resumeFileName;
    private String resumeOriginalName;

    private ApplicationStatus status;
    private String coverNote;
    private String notes;

    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}
