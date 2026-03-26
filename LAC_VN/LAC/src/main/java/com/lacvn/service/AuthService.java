package com.lacvn.service;

import com.lacvn.dto.request.LoginRequest;
import com.lacvn.dto.request.RefreshTokenRequest;
import com.lacvn.dto.request.RegisterRequest;
import com.lacvn.dto.response.AuthResponse;
import com.lacvn.dto.response.UserResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserResponse me(String email);
    AuthResponse refresh(RefreshTokenRequest request);
}