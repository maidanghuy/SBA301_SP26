package com.lacvn.repository;

import com.lacvn.entity.ProductSpecification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface ProductSpecificationRepository extends JpaRepository<ProductSpecification, Long> {
    List<ProductSpecification> findByProductId(String productId);

    // Used for manual id generation when the DB doesn't auto-generate ids.
    Optional<ProductSpecification> findTopByOrderByIdDesc();
}
