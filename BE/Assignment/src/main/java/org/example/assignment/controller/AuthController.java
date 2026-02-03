package org.example.assignment.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.assignment.dto.request.LoginRequest;
import org.example.assignment.dto.response.LoginResponse;
import org.example.assignment.service.AuthServiceImpl;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final AuthServiceImpl authService;

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}

