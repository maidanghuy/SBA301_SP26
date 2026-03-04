package com.de180293.pe_sba301_sp25_be_de180293.service;

import com.de180293.pe_sba301_sp25_be_de180293.dto.request.LoginRequest;
import com.de180293.pe_sba301_sp25_be_de180293.dto.request.RefreshTokenRequest;
import com.de180293.pe_sba301_sp25_be_de180293.dto.request.RegisterRequest;
import com.de180293.pe_sba301_sp25_be_de180293.dto.response.AuthResponse;
import com.de180293.pe_sba301_sp25_be_de180293.dto.response.CustomerResponse;

public interface AuthService {
    CustomerResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    CustomerResponse me(String email);
    AuthResponse refresh(RefreshTokenRequest request);
}