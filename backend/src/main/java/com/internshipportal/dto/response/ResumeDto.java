package com.internshipportal.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeDto {

    private Long id;
    private Long studentId;
    private String fileName;
    private String originalFileName;
    private String fileType;
    private Long fileSize;
    private boolean isDefault;
    private LocalDateTime uploadedAt;
}
