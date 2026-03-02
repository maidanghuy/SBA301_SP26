package org.example.asis03.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.asis03.common.ApiResponse;
import org.example.asis03.common.ApiResponses;
import org.example.asis03.dto.request.LoginRequest;
import org.example.asis03.dto.request.RefreshTokenRequest;
import org.example.asis03.dto.request.RegisterRequest;
import org.example.asis03.dto.response.AuthResponse;
import org.example.asis03.dto.response.CustomerResponse;
import org.example.asis03.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<CustomerResponse>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest req
    ) {
        CustomerResponse data = authService.register(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponses.success(HttpStatus.CREATED, "Register successfully", data, req));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest req
    ) {
        AuthResponse data = authService.login(request);

        return ResponseEntity.ok(
                ApiResponses.success(HttpStatus.OK, "Login successfully", data, req)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<CustomerResponse>> me(
            Authentication authentication,
            HttpServletRequest req
    ) {
        System.out.println(authentication.getName());
        CustomerResponse data = authService.me(authentication.getName());

        return ResponseEntity.ok(
                ApiResponses.success(HttpStatus.OK, "OK", data, req)
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @Valid @RequestBody RefreshTokenRequest request,
            HttpServletRequest req
    ) {
        AuthResponse data = authService.refresh(request);

        return ResponseEntity.ok(
                ApiResponses.success(HttpStatus.OK, "Refresh successfully", data, req)
        );
    }
}