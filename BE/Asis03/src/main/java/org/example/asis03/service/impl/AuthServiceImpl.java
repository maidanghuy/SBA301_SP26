package org.example.asis03.service.impl;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.example.asis03.dto.request.LoginRequest;
import org.example.asis03.dto.request.RefreshTokenRequest;
import org.example.asis03.dto.request.RegisterRequest;
import org.example.asis03.dto.response.AuthResponse;
import org.example.asis03.dto.response.CustomerResponse;
import org.example.asis03.entity.AS03Customer;
import org.example.asis03.entity.Role;
import org.example.asis03.exception.ResourceNotFoundException;
import org.example.asis03.repository.AS03CustomerRepository;
import org.example.asis03.service.AuthService;
import org.example.asis03.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AS03CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Value("${app.staff.email}")
    private String staffEmail;

    @Override
    public CustomerResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (customerRepository.existsByEmail(email) || email.equalsIgnoreCase(staffEmail)) {
            throw new IllegalArgumentException("Email already exists");
        }

        AS03Customer c = AS03Customer.builder()
                .fullName(request.getFullName().trim())
                .email(email)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.CUSTOMER)
                .active(true)
                .build();

        AS03Customer saved = customerRepository.save(c);

        return CustomerResponse.builder()
                .id(saved.getId())
                .email(saved.getEmail())
                .role(saved.getRole().name())
                .fullName(saved.getFullName())
                .phone(saved.getPhone())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        UserDetails ud = userDetailsService.loadUserByUsername(email);

        if (!passwordEncoder.matches(request.getPassword(), ud.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        Role role;
        CustomerResponse user;

        if (email.equalsIgnoreCase(staffEmail)) {
            role = Role.STAFF;
            user = CustomerResponse.builder()
                    .id(null)
                    .email(email)
                    .role(role.name())
                    .fullName(null)
                    .phone(null)
                    .build();
        } else {
            AS03Customer c = customerRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            role = c.getRole();
            user = CustomerResponse.builder()
                    .id(c.getId())
                    .email(c.getEmail())
                    .role(role.name())
                    .fullName(c.getFullName())
                    .phone(c.getPhone())
                    .build();
        }

        String accessToken = jwtUtil.generateAccessToken(email, role);
        String refreshToken = jwtUtil.generateRefreshToken(email, role);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtUtil.getAccessExpiresInSeconds())
                .user(user)
                .build();
    }

    @Override
    public CustomerResponse me(String email) {
        if (email.equalsIgnoreCase(staffEmail)) {
            return CustomerResponse.builder().id(null).email(email).role(Role.STAFF.name()).fullName(null).build();
        }
        AS03Customer c = customerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return CustomerResponse.builder()
                .id(c.getId())
                .email(c.getEmail())
                .role(c.getRole().name())
                .fullName(c.getFullName())
                .phone(c.getPhone())
                .build();
    }

    @Override
    public AuthResponse refresh(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        try {
            String type = jwtUtil.getType(refreshToken);
            if (!"refresh".equals(type)) {
                throw new IllegalArgumentException("Invalid refresh token");
            }

            String email = jwtUtil.getEmail(refreshToken);
            String roleStr = jwtUtil.getRole(refreshToken);
            if (email == null || roleStr == null) {
                throw new IllegalArgumentException("Invalid refresh token");
            }

            Role role = Role.valueOf(roleStr);

            CustomerResponse user;
            if (email.equalsIgnoreCase(staffEmail)) {
                user = CustomerResponse.builder()
                        .id(null)
                        .email(email)
                        .role(Role.STAFF.name())
                        .fullName(null)
                        .phone(null)
                        .build();
            } else {
                AS03Customer c = customerRepository.findByEmail(email)
                        .filter(AS03Customer::getActive)
                        .orElseThrow(() -> new IllegalArgumentException("User not found or inactive"));

                user = CustomerResponse.builder()
                        .id(c.getId())
                        .email(c.getEmail())
                        .role(c.getRole().name())
                        .fullName(c.getFullName())
                        .phone(c.getPhone())
                        .build();
            }

            String newAccessToken = jwtUtil.generateAccessToken(email, role);

            String newRefreshToken = jwtUtil.generateRefreshToken(email, role);

            return AuthResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .expiresIn(jwtUtil.getAccessExpiresInSeconds())
                    .user(user)
                    .build();

        } catch (ExpiredJwtException ex) {
            throw new IllegalArgumentException("Refresh token expired");
        } catch (JwtException | IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
    }
}