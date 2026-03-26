package com.lacvn.repository;

import com.lacvn.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, String> {
    Optional<Cart> findFirstByUserIdAndDeleteFlagFalse(String userId);
    Optional<Cart> findFirstByUserIdAndStatusAndDeleteFlagFalse(String userId, String status);
    Optional<Cart> findFirstByUserEmailAndDeleteFlagFalse(String email);
}
