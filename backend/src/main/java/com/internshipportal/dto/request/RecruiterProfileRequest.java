package com.internshipportal.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecruiterProfileRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phoneNumber;
    private String profileSummary;

    @NotBlank(message = "Company name is required")
    private String companyName;

    private String companyWebsite;
    private String companyDescription;
    private String designation;
    private String companyLogo;
    private String location;
}
