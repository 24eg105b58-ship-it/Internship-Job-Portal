package com.internshipportal.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationCreateRequest {

    @NotNull(message = "Job ID is required")
    private Long jobId;

    private Long resumeId;

    private String coverNote;
}
