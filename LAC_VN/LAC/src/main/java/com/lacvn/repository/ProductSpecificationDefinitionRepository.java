package com.lacvn.repository;

import com.lacvn.entity.ProductSpecificationDefinition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductSpecificationDefinitionRepository extends JpaRepository<ProductSpecificationDefinition, Long> {
    Optional<ProductSpecificationDefinition> findByKey(String key);
    boolean existsByKey(String key);

    // Used for manual id generation when the DB doesn't auto-generate ids.
    Optional<ProductSpecificationDefinition> findTopByOrderByIdDesc();
}

