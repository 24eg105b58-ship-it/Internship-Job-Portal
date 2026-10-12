package com.internshipportal.service.impl;

import com.internshipportal.dto.response.PagedResponse;
import com.internshipportal.dto.response.UserDto;
import com.internshipportal.entity.Role;
import com.internshipportal.entity.User;
import com.internshipportal.exception.ResourceNotFoundException;
import com.internshipportal.repository.UserRepository;
import com.internshipportal.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToDto(user);
    }

    @Override
    @Transactional
    public UserDto updateUserStatus(Long id, boolean active) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setActive(active);
        user = userRepository.save(user);
        return mapToDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<UserDto> searchUsers(Role role, String search, Pageable pageable) {
        String cleanSearch = StringUtils.hasText(search) ? search.trim() : null;
        Page<User> page = userRepository.searchUsers(role, cleanSearch, pageable);
        List<UserDto> dtos = page.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return PagedResponse.of(page, dtos);
    }

    private UserDto mapToDto(User u) {
        return UserDto.builder()
                .id(u.getId())
                .name(u.getFullName())
                .email(u.getEmail())
                .role(u.getRole())
                .active(u.isActive())
                .phoneNumber(u.getPhoneNumber())
                .profileSummary(u.getProfileSummary())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
