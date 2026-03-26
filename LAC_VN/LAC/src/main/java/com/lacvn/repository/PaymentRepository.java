package com.lacvn.repository;

import com.lacvn.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // PayOS orderCode can be stored as ID, so this retrieves by PayOS orderCode if mapped correctly
    Optional<Payment> findTopByOrder_IdOrderByCreatedAtDesc(String orderId);
}
