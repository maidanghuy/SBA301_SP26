package org.example.asis03.repository;

import org.example.asis03.entity.AS03Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface AS03CustomerRepository extends JpaRepository<AS03Customer, Long> {
    Optional<AS03Customer> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<AS03Customer> findByEmailAndDeleteFlagFalse(String email);

    Page<AS03Customer> findByDeleteFlagFalse(Pageable pageable);

    Page<AS03Customer> findByDeleteFlagFalseAndEmailContainingIgnoreCaseOrDeleteFlagFalseAndFullNameContainingIgnoreCase(
            String email, String fullName, Pageable pageable
    );
}