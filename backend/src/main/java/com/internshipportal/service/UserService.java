package com.internshipportal.service;

import com.internshipportal.dto.response.PagedResponse;
import com.internshipportal.dto.response.UserDto;
import com.internshipportal.entity.Role;
import org.springframework.data.domain.Pageable;

public interface UserService {

    UserDto getUserById(Long id);

    UserDto updateUserStatus(Long id, boolean active);

    PagedResponse<UserDto> searchUsers(Role role, String search, Pageable pageable);
}
