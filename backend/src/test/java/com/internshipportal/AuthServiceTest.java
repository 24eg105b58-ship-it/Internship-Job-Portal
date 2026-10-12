package com.internshipportal;

import com.internshipportal.dto.request.LoginRequest;
import com.internshipportal.dto.request.RegisterRequest;
import com.internshipportal.dto.response.AuthResponse;
import com.internshipportal.entity.Role;
import com.internshipportal.entity.User;
import com.internshipportal.exception.DuplicateResourceException;
import com.internshipportal.exception.ValidationException;
import com.internshipportal.repository.RecruiterRepository;
import com.internshipportal.repository.StudentRepository;
import com.internshipportal.repository.UserRepository;
import com.internshipportal.security.JwtTokenProvider;
import com.internshipportal.security.UserPrincipal;
import com.internshipportal.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private RecruiterRepository recruiterRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .email("student@test.com")
                .password("encoded_pass")
                .fullName("Test Student")
                .role(Role.STUDENT)
                .active(true)
                .build();
    }

    @Test
    void testRegisterStudent_Success() {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("Test Student")
                .email("student@test.com")
                .password("password123")
                .confirmPassword("password123")
                .role(Role.STUDENT)
                .university("Test University")
                .build();

        when(userRepository.existsByEmail("student@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(tokenProvider.generateAccessToken(any(UserPrincipal.class))).thenReturn("access_token");
        when(tokenProvider.generateRefreshToken(any(UserPrincipal.class))).thenReturn("refresh_token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("access_token", response.getAccessToken());
        assertEquals("student@test.com", response.getUser().getEmail());
        verify(studentRepository, times(1)).save(any());
    }

    @Test
    void testRegister_PasswordMismatch_ThrowsValidationException() {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("Test User")
                .email("user@test.com")
                .password("password123")
                .confirmPassword("different_password")
                .role(Role.STUDENT)
                .build();

        assertThrows(ValidationException.class, () -> authService.register(request));
    }

    @Test
    void testRegister_DuplicateEmail_ThrowsDuplicateResourceException() {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("Duplicate User")
                .email("existing@test.com")
                .password("password123")
                .confirmPassword("password123")
                .role(Role.STUDENT)
                .build();

        when(userRepository.existsByEmail("existing@test.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(request));
    }

    @Test
    void testRegisterAdmin_Forbidden_ThrowsValidationException() {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("Admin Try")
                .email("admin@test.com")
                .password("password123")
                .confirmPassword("password123")
                .role(Role.ADMIN)
                .build();

        assertThrows(ValidationException.class, () -> authService.register(request));
    }

    @Test
    void testLogin_Success() {
        LoginRequest request = LoginRequest.builder()
                .email("student@test.com")
                .password("password123")
                .build();

        UserPrincipal principal = UserPrincipal.create(sampleUser);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(tokenProvider.generateAccessToken(auth)).thenReturn("jwt_token");
        when(tokenProvider.generateRefreshToken(principal)).thenReturn("refresh_token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt_token", response.getAccessToken());
        assertEquals("student@test.com", response.getUser().getEmail());
    }
}
