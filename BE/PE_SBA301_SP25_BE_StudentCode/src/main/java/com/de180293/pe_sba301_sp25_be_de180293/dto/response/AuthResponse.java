package com.de180293.pe_sba301_sp25_be_de180293.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private long expiresIn;
    private CustomerResponse user;
}