package com.lacvn.repository;

import com.lacvn.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByUser_EmailOrderByCreatedAtDesc(String email);
}
