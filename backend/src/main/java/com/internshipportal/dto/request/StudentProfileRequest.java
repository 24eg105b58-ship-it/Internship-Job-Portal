package com.internshipportal.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfileRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phoneNumber;
    private String profileSummary;
    private String university;
    private String degree;
    private Integer graduationYear;
    private Double cgpa;
    private String skills;
    private Integer experienceYears;
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;
    private String location;
    private Long defaultResumeId;
}
