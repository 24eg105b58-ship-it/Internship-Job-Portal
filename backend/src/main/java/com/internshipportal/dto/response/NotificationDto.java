package com.internshipportal.dto.response;

import com.internshipportal.entity.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDto {

    private Long id;
    private Long userId;
    private String title;
    private String message;
    private NotificationType type;
    private boolean read;
    private String actionUrl;
    private LocalDateTime createdAt;
}
