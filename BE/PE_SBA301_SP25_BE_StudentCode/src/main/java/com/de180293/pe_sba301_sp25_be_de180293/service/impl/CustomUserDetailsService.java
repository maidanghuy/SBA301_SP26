package com.de180293.pe_sba301_sp25_be_de180293.service.impl;

import com.de180293.pe_sba301_sp25_be_de180293.entity.PR03AccountMember;
import com.de180293.pe_sba301_sp25_be_de180293.repository.PR03AccountMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final PR03AccountMemberRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String memberId) {
        PR03AccountMember m = accountRepository.findById(memberId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return org.springframework.security.core.userdetails.User.builder()
                .username(m.getMemberId())
                .password(m.getMemberPassword())
                .roles(m.getMemberRole().name())
                .build();
    }
}