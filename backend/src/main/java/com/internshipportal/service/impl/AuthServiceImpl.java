package com.internshipportal.service.impl;

import com.internshipportal.service.AuthService;
import com.internshipportal.dto.request.ChangePasswordRequest;
import com.internshipportal.dto.request.LoginRequest;
import com.internshipportal.dto.request.RefreshTokenRequest;
import com.internshipportal.dto.request.RegisterRequest;
import com.internshipportal.dto.response.AuthResponse;
import com.internshipportal.dto.response.UserDto;
import com.internshipportal.entity.Recruiter;
import com.internshipportal.entity.Role;
import com.internshipportal.entity.Student;
import com.internshipportal.entity.User;
import com.internshipportal.exception.DuplicateResourceException;
import com.internshipportal.exception.InvalidTokenException;
import com.internshipportal.exception.ResourceNotFoundException;
import com.internshipportal.exception.ValidationException;
import com.internshipportal.repository.RecruiterRepository;
import com.internshipportal.repository.StudentRepository;
import com.internshipportal.repository.UserRepository;
import com.internshipportal.security.JwtTokenProvider;
import com.internshipportal.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final RecruiterRepository recruiterRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ValidationException("Passwords do not match");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("An account with email " + request.getEmail() + " already exists");
        }

        if (request.getRole() == Role.ADMIN) {
            throw new ValidationException("Public registration as Administrator is not permitted");
        }

        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .role(request.getRole())
                .active(true)
                .build();

        user = userRepository.save(user);

        if (user.getRole() == Role.STUDENT) {
            Student student = Student.builder()
                    .user(user)
                    .university(request.getUniversity() != null && !request.getUniversity().isBlank()
                            ? request.getUniversity().trim()
                            : "University Student")
                    .degree("B.Tech / B.S.")
                    .graduationYear(java.time.LocalDate.now().getYear() + 2)
                    .cgpa(8.0)
                    .skills("Software Engineering, Web Development")
                    .experienceYears(0)
                    .location("Remote / Flexible")
                    .build();
            studentRepository.save(student);
        } else if (user.getRole() == Role.RECRUITER) {
            Recruiter recruiter = Recruiter.builder()
                    .user(user)
                    .companyName(request.getCompanyName() != null && !request.getCompanyName().isBlank()
                            ? request.getCompanyName().trim()
                            : user.getFullName() + "'s Organization")
                    .verified(true)
                    .build();
            recruiterRepository.save(recruiter);
        }

        UserPrincipal principal = UserPrincipal.create(user);
        String accessToken = tokenProvider.generateAccessToken(principal);
        String refreshToken = tokenProvider.generateRefreshToken(principal);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(mapToUserDto(user))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().trim().toLowerCase(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isActive()) {
            throw new ValidationException("This account has been deactivated. Please contact support.");
        }

        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(principal);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(mapToUserDto(user))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        if (!tokenProvider.validateToken(request.getRefreshToken())) {
            throw new InvalidTokenException("Invalid or expired refresh token");
        }

        String email = tokenProvider.getUsernameFromToken(request.getRefreshToken());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isActive()) {
            throw new ValidationException("User account is inactive");
        }

        UserPrincipal principal = UserPrincipal.create(user);
        String accessToken = tokenProvider.generateAccessToken(principal);
        String newRefreshToken = tokenProvider.generateRefreshToken(principal);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .user(mapToUserDto(user))
                .build();
    }

    @Override
    @Transactional
    public void changePassword(String userEmail, ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new ValidationException("New passwords do not match");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ValidationException("Incorrect current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToUserDto(user);
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .active(user.isActive())
                .phoneNumber(user.getPhoneNumber())
                .profileSummary(user.getProfileSummary())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
