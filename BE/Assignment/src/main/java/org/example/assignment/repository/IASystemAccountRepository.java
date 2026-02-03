package org.example.assignment.repository;

import org.example.assignment.entity.ASystemAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IASystemAccountRepository extends JpaRepository<ASystemAccount, Long> {

    List<ASystemAccount> findByDeleteFlagFalse();

    List<ASystemAccount> findByDeleteFlagFalseAndAccountNameContainingIgnoreCase(String q);

    Optional<ASystemAccount> findByAccountEmail(String email);

    boolean existsByAccountEmail(String email);
}
