package com.de180293.pe_sba301_sp25_be_de180293.service.impl;

import com.de180293.pe_sba301_sp25_be_de180293.dto.request.LoginRequest;
import com.de180293.pe_sba301_sp25_be_de180293.dto.request.RefreshTokenRequest;
import com.de180293.pe_sba301_sp25_be_de180293.dto.request.RegisterRequest;
import com.de180293.pe_sba301_sp25_be_de180293.dto.response.AuthResponse;
import com.de180293.pe_sba301_sp25_be_de180293.dto.response.CustomerResponse;
import com.de180293.pe_sba301_sp25_be_de180293.entity.PR03AccountMember;
import com.de180293.pe_sba301_sp25_be_de180293.entity.Role;
import com.de180293.pe_sba301_sp25_be_de180293.exception.ResourceNotFoundException;
import com.de180293.pe_sba301_sp25_be_de180293.repository.PR03AccountMemberRepository;
import com.de180293.pe_sba301_sp25_be_de180293.service.AuthService;
import com.de180293.pe_sba301_sp25_be_de180293.utils.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final PR03AccountMemberRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public CustomerResponse register(RegisterRequest request) {
        String memberId = request.getMemberId().trim();
        String email = request.getEmail().trim().toLowerCase();

        if (accountRepository.existsById(memberId)) {
            throw new IllegalArgumentException("MemberID already exists");
        }
        if (accountRepository.existsByEmailAddressIgnoreCase(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        PR03AccountMember m = PR03AccountMember.builder()
                .memberId(memberId)
                .emailAddress(email)
                .memberPassword(passwordEncoder.encode(request.getPassword()))
                .memberRole(Role.MEMBER)
                .build();

        PR03AccountMember saved = accountRepository.save(m);

        return CustomerResponse.builder()
                .memberId(saved.getMemberId())
                .email(saved.getEmailAddress())
                .role(saved.getMemberRole().name())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String username = request.getUsername().trim();

        PR03AccountMember member = accountRepository.findById(username)
                .orElseGet(() -> accountRepository.findByEmailAddressIgnoreCase(username)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found")));

        if (!passwordEncoder.matches(request.getPassword(), member.getMemberPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        Role role = member.getMemberRole();

        // subject của JWT nên là memberId để nhất quán
        String accessToken = jwtUtil.generateAccessToken(member.getMemberId(), role);
        String refreshToken = jwtUtil.generateRefreshToken(member.getMemberId(), role);

        CustomerResponse user = CustomerResponse.builder()
                .memberId(member.getMemberId())
                .email(member.getEmailAddress())
                .role(role.name())
                .build();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtUtil.getAccessExpiresInSeconds())
                .user(user)
                .build();
    }

    @Override
    public CustomerResponse me(String memberId) {
        PR03AccountMember member = accountRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return CustomerResponse.builder()
                .memberId(member.getMemberId())
                .email(member.getEmailAddress())
                .role(member.getMemberRole().name())
                .build();
    }

    @Override
    public AuthResponse refresh(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        try {
            if (!"refresh".equals(jwtUtil.getType(refreshToken))) {
                throw new IllegalArgumentException("Invalid refresh token");
            }

            String memberId = jwtUtil.getEmail(refreshToken); // subject = memberId
            String roleStr = jwtUtil.getRole(refreshToken);

            if (memberId == null || roleStr == null) {
                throw new IllegalArgumentException("Invalid refresh token");
            }

            Role role = Role.valueOf(roleStr);

            PR03AccountMember member = accountRepository.findById(memberId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            String newAccessToken = jwtUtil.generateAccessToken(member.getMemberId(), role);
            String newRefreshToken = jwtUtil.generateRefreshToken(member.getMemberId(), role);

            CustomerResponse user = CustomerResponse.builder()
                    .memberId(member.getMemberId())
                    .email(member.getEmailAddress())
                    .role(member.getMemberRole().name())
                    .build();

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