package com.lacvn.repository;

import com.lacvn.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, String>, JpaSpecificationExecutor<Product> {
    List<Product> findByCategoryIdAndDeleteFlagFalse(Long categoryId);
    
    @Query("SELECT MIN(p.price) FROM Product p WHERE p.deleteFlag = false")
    BigDecimal getMinPrice();
    
    @Query("SELECT MAX(p.price) FROM Product p WHERE p.deleteFlag = false")
    BigDecimal getMaxPrice();
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.brand.id = :brandId AND p.deleteFlag = false")
    Long countByBrandId(@Param("brandId") Long brandId);
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = :categoryId AND p.deleteFlag = false")
    Long countByCategoryId(@Param("categoryId") Long categoryId);
}
