package com.de180293.pe_sba301_sp25_be_de180293.repository;

import com.de180293.pe_sba301_sp25_be_de180293.entity.PR03AccountMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PR03AccountMemberRepository extends JpaRepository<PR03AccountMember, String> {
    Optional<PR03AccountMember> findByEmailAddressIgnoreCase(String email);
    boolean existsByEmailAddressIgnoreCase(String email);
}