package com.lacvn.repository;

import com.lacvn.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCartId(String cartId);
    Optional<CartItem> findByCartIdAndProductId(String cartId, String productId);
    Optional<CartItem> findTopByOrderByIdDesc();
    List<CartItem> findByCartUserEmailAndDeleteFlagFalse(String email);
}
