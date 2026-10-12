package com.internshipportal.service.impl;

import com.internshipportal.dto.response.NotificationDto;
import com.internshipportal.dto.response.PagedResponse;
import com.internshipportal.entity.Notification;
import com.internshipportal.entity.NotificationType;
import com.internshipportal.entity.User;
import com.internshipportal.exception.ForbiddenException;
import com.internshipportal.exception.ResourceNotFoundException;
import com.internshipportal.repository.NotificationRepository;
import com.internshipportal.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public void sendNotification(User user, String title, String message, NotificationType type, String actionUrl) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type != null ? type : NotificationType.GENERAL)
                .actionUrl(actionUrl)
                .read(false)
                .build();
        notificationRepository.save(notification);
        log.info("Notification created for user {}: {}", user.getEmail(), title);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<NotificationDto> getUserNotifications(String email, Pageable pageable) {
        Page<Notification> page = notificationRepository.findByUserEmailOrderByCreatedAtDesc(email, pageable);
        List<NotificationDto> dtoList = page.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return PagedResponse.of(page, dtoList);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(String email) {
        return notificationRepository.countByUserEmailAndReadFalse(email);
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId, String email) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getEmail().equalsIgnoreCase(email)) {
            throw new ForbiddenException("Cannot access another user's notification");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(String email) {
        notificationRepository.markAllAsReadByUserEmail(email);
    }

    private NotificationDto mapToDto(Notification n) {
        return NotificationDto.builder()
                .id(n.getId())
                .userId(n.getUser().getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .read(n.isRead())
                .actionUrl(n.getActionUrl())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
