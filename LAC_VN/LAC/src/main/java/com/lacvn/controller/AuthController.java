package com.lacvn.controller;

import com.lacvn.common.ApiResponse;
import com.lacvn.common.ApiResponses;
import com.lacvn.dto.request.*;
import com.lacvn.dto.response.AuthResponse;
import com.lacvn.dto.response.UserResponse;
import com.lacvn.service.AuthService;
import com.lacvn.service.OtpService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Các API liên quan đến xác thực và quản lý tài khoản")
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request, HttpServletRequest req) {
        AuthResponse authResponse = authService.register(request);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Registration successful", authResponse, req));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request, HttpServletRequest req) {
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Login successful", authResponse, req));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@RequestBody RefreshTokenRequest request, HttpServletRequest req) {
        AuthResponse authResponse = authService.refresh(request);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Token refreshed successfully", authResponse, req));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Object>> sendOtp(
            @Valid @RequestBody SendOtpRequest request,
            HttpServletRequest req
    ) {
        otpService.sendOtp(request.getEmail());
        return ResponseEntity.ok(
                ApiResponses.success(HttpStatus.OK, "OTP sent successfully", null, req)
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Object>> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request,
            HttpServletRequest req
    ) {
        boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp());

        if (!isValid) {
            throw new IllegalArgumentException("Invalid or expired OTP");
        }

        return ResponseEntity.ok(
                ApiResponses.success(HttpStatus.OK, "OTP verified successfully", null, req)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> me(HttpServletRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserResponse userResponse = authService.me(auth.getName());
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "User information retrieved successfully", userResponse, req));
    }
}