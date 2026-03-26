package com.lacvn.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Response DTO containing available filter options
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductFilterOptionResponse {
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Integer minRating;
    private Integer maxRating;
    private List<BrandOptionResponse> brands;
    private List<CategoryOptionResponse> categories;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BrandOptionResponse {
        private Long id;
        private String name;
        private Long productCount;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryOptionResponse {
        private Long id;
        private String nameVn;
        private String nameEnglish;
        private Long productCount;
    }
}
