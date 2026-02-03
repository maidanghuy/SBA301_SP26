package org.example.assignment.service;

import lombok.RequiredArgsConstructor;
import org.example.assignment.dto.request.LoginRequest;
import org.example.assignment.dto.response.LoginResponse;
import org.example.assignment.entity.ASystemAccount;
import org.example.assignment.repository.IASystemAccountRepository;
import org.example.assignment.service.impl.AuthService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final IASystemAccountRepository accountRepo;

    @Override
    public LoginResponse login(LoginRequest request) {

        String username = request.getUsername().trim();
        String password = request.getPassword();

        ASystemAccount acc = accountRepo.findByAccountEmail(username.toLowerCase())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (Boolean.TRUE.equals(acc.getDeleteFlag())) {
            throw new RuntimeException("Account is deleted");
        }

        if (!acc.getAccountPassword().equals(password)) {
            throw new RuntimeException("Invalid username or password");
        }

        return LoginResponse.builder()
                .accountId(acc.getAccountId())
                .name(acc.getAccountName())
                .email(acc.getAccountEmail())
                .role(acc.getAccountRole())
                .build();
    }
}
