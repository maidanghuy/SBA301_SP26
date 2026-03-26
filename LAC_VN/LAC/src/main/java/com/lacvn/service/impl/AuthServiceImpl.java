package com.lacvn.service.impl;

import com.lacvn.dto.request.LoginRequest;
import com.lacvn.dto.request.RefreshTokenRequest;
import com.lacvn.dto.request.RegisterRequest;
import com.lacvn.dto.response.AuthResponse;
import com.lacvn.dto.response.UserResponse;
import com.lacvn.entity.User;
import com.lacvn.repository.UserRepository;
import com.lacvn.service.AuthService;
import com.lacvn.utils.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RedisServiceImpl redisServiceImpl;

    @Override
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (!redisServiceImpl.isOtpVerified(email)) {
            throw new IllegalArgumentException("Email OTP has not been verified");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = User.builder()
                .id(UUID.randomUUID().toString())  // Generate a random UUID for the user
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())  // Use fullName directly
                .role("user")  // Default role is 'user'
                .status("ACTIVE")  // Default status is 'ACTIVE'
                .build();

        User savedUser = userRepository.save(user);

        // Remove OTP verification key after successful registration
        redisServiceImpl.deleteVerifiedOtp(email);

        String accessToken = jwtUtil.generateAccessToken(savedUser.getEmail(), savedUser.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(savedUser.getEmail(), savedUser.getRole());

        UserResponse userResponse = UserResponse.builder()
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtUtil.getAccessExpiresInSeconds())
                .user(userResponse)
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim() : null;

        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("Email must be provided");
        }

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail(), user.getRole());

        UserResponse userResponse = UserResponse.builder()
                .email(user.getEmail())
                .role(user.getRole())
                .build();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtUtil.getAccessExpiresInSeconds())
                .user(userResponse)
                .build();
    }

    @Override
    public UserResponse me(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return UserResponse.builder()
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Override
    public AuthResponse refresh(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        try {
            if (!"refresh".equals(jwtUtil.getType(refreshToken))) {
                throw new IllegalArgumentException("Invalid refresh token");
            }

            String email = jwtUtil.getEmail(refreshToken);
            String roleStr = jwtUtil.getRole(refreshToken);

            if (email == null || roleStr == null) {
                throw new IllegalArgumentException("Invalid refresh token");
            }

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            String newAccessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getRole());
            String newRefreshToken = jwtUtil.generateRefreshToken(user.getEmail(), user.getRole());

            UserResponse userResponse = UserResponse.builder()
                    .email(user.getEmail())
                    .role(user.getRole())
                    .build();

            return AuthResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .expiresIn(jwtUtil.getAccessExpiresInSeconds())
                    .user(userResponse)
                    .build();

        } catch (ExpiredJwtException ex) {
            throw new IllegalArgumentException("Refresh token expired");
        } catch (JwtException | IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
    }
}
