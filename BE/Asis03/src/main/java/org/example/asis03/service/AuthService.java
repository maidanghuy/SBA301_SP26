package org.example.asis03.service;

import org.example.asis03.dto.request.LoginRequest;
import org.example.asis03.dto.request.RefreshTokenRequest;
import org.example.asis03.dto.request.RegisterRequest;
import org.example.asis03.dto.response.AuthResponse;
import org.example.asis03.dto.response.CustomerResponse;

public interface AuthService {
    CustomerResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    CustomerResponse me(String email);
    AuthResponse refresh(RefreshTokenRequest request);
}