package org.example.assignment.service.impl;

import org.example.assignment.dto.request.LoginRequest;
import org.example.assignment.dto.response.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}
