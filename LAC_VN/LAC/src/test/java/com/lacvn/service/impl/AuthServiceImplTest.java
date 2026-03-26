package com.lacvn.service.impl;

import com.lacvn.dto.request.LoginRequest;
import com.lacvn.dto.request.RegisterRequest;
import com.lacvn.dto.response.AuthResponse;
import com.lacvn.entity.User;
import com.lacvn.repository.UserRepository;
import com.lacvn.utils.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private RedisServiceImpl redisServiceImpl;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void register_ShouldReturnAuthResponse_WhenValid() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("password");
        request.setConfirmPassword("password");
        request.setFullName("Test User");

        when(redisServiceImpl.isOtpVerified(anyString())).thenReturn(true);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtUtil.generateAccessToken(anyString(), anyString())).thenReturn("accessToken");
        when(jwtUtil.generateRefreshToken(anyString(), anyString())).thenReturn("refreshToken");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("accessToken", response.getAccessToken());
        verify(userRepository, times(1)).save(any(User.class));
        verify(redisServiceImpl, times(1)).deleteVerifiedOtp(anyString());
    }

    @Test
    void login_ShouldReturnAuthResponse_WhenValid() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("password");

        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("encodedPassword");
        user.setRole("user");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);
        when(jwtUtil.generateAccessToken(anyString(), anyString())).thenReturn("accessToken");
        when(jwtUtil.generateRefreshToken(anyString(), anyString())).thenReturn("refreshToken");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("accessToken", response.getAccessToken());
    }

    @Test
    void login_ShouldThrowException_WhenInvalidPassword() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("wrong");

        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("encodedPassword");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "encodedPassword")).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> authService.login(request));
    }
}
