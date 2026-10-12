package com.internshipportal.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecruiterDto {

    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String profileSummary;
    private String companyName;
    private String companyWebsite;
    private String companyDescription;
    private String designation;
    private String companyLogo;
    private String location;
    private boolean verified;
    private boolean active;
    private LocalDateTime createdAt;
}
