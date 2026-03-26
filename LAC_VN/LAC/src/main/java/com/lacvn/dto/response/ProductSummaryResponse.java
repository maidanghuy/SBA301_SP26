package com.lacvn.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ProductSummaryResponse {
    private String id;
    private String name;
    private BigDecimal price;
    private String description;
    private String image;
    private Integer stock;
    private Boolean isNew;
    private Boolean isFeatured;
    private BigDecimal rating;
    private Integer reviewsCount;
    private Long brandId;
    private String brandName;
    private Long categoryId;
    private String categoryName;
}
