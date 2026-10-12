package com.internshipportal.service;

import com.internshipportal.dto.request.ChangePasswordRequest;
import com.internshipportal.dto.request.LoginRequest;
import com.internshipportal.dto.request.RefreshTokenRequest;
import com.internshipportal.dto.request.RegisterRequest;
import com.internshipportal.dto.response.AuthResponse;
import com.internshipportal.dto.response.UserDto;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    void changePassword(String userEmail, ChangePasswordRequest request);

    UserDto getCurrentUser(String email);
}
