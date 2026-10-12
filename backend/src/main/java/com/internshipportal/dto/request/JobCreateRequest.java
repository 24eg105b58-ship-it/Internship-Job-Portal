package com.internshipportal.dto.request;

import com.internshipportal.entity.JobType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobCreateRequest {

    @NotBlank(message = "Job title is required")
    private String title;

    private String companyName;

    @NotBlank(message = "Job description is required")
    private String description;

    private String responsibilities;

    private String requirements;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Job type is required")
    private JobType jobType;

    private String salary;

    private String experience;

    private String skills;

    private LocalDate deadline;

    @NotNull(message = "Number of openings is required")
    @Min(value = 1, message = "Openings must be at least 1")
    @Builder.Default
    private Integer openings = 1;
}
