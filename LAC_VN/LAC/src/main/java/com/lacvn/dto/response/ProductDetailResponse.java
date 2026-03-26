package com.lacvn.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProductDetailResponse {
    private ProductSummaryResponse product;
    private List<ProductSpecificationResponse> specifications;
    private List<ReviewResponse> reviews;
}
