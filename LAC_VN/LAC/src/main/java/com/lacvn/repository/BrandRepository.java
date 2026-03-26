package com.lacvn.repository;

import com.lacvn.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    Optional<Brand> findTopByOrderByIdDesc();
}
