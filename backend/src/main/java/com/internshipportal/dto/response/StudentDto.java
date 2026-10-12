package com.internshipportal.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDto {

    private Long id;
    private Long userId;
    private String fullName;
    private String email;
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
    private boolean active;
    private LocalDateTime createdAt;
}
