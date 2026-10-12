package com.internshipportal.service;

import com.internshipportal.dto.response.NotificationDto;
import com.internshipportal.dto.response.PagedResponse;
import com.internshipportal.entity.NotificationType;
import com.internshipportal.entity.User;
import org.springframework.data.domain.Pageable;

public interface NotificationService {

    void sendNotification(User user, String title, String message, NotificationType type, String actionUrl);

    PagedResponse<NotificationDto> getUserNotifications(String email, Pageable pageable);

    long getUnreadCount(String email);

    void markAsRead(Long notificationId, String email);

    void markAllAsRead(String email);
}
