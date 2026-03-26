package com.lacvn.dto.request;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

/**
 * Request DTO for advanced product search and filtering
 */
@Data
@Builder
public class ProductSearchRequest {
    // Search
    private String keyword;
    
    // Filtering
    private Long brandId;
    private Long categoryId;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Boolean isNew;
    private Boolean isFeatured;
    private BigDecimal minRating;
    
    // Pagination
    private Integer page;
    private Integer size;
    
    // Sorting
    private String sortBy;     // name, price, rating, createdAt, etc.
    private String sortDir;    // asc, desc
    
    // Default values
    public ProductSearchRequest withDefaults() {
        if (this.page == null) this.page = 0;
        if (this.size == null) this.size = 10;
        if (this.sortBy == null) this.sortBy = "createdAt";
        if (this.sortDir == null) this.sortDir = "desc";
        return this;
    }
}
