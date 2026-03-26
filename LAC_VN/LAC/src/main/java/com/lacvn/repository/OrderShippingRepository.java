package com.lacvn.repository;

import com.lacvn.entity.OrderShipping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderShippingRepository extends JpaRepository<OrderShipping, Long> {
    Optional<OrderShipping> findByOrder_Id(String orderId);
}
