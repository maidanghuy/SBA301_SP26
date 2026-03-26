package com.lacvn.service;

import com.lacvn.common.PageResponse;
import com.lacvn.dto.request.ProductCreateRequest;
import com.lacvn.dto.request.ProductSearchRequest;
import com.lacvn.dto.request.ProductUpdateRequest;
import com.lacvn.dto.response.ProductDetailResponse;
import com.lacvn.dto.response.ProductFilterOptionResponse;
import com.lacvn.dto.response.ProductSpecificationResponse;
import com.lacvn.dto.response.ProductSummaryResponse;
import com.lacvn.dto.response.ProductSuggestionResponse;
import com.lacvn.dto.response.ReviewResponse;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {
    ProductDetailResponse createProduct(ProductCreateRequest request);

    ProductDetailResponse updateProduct(String id, ProductUpdateRequest request);

    ProductDetailResponse deleteProduct(String id);

    PageResponse<ProductSummaryResponse> getProducts(
            String keyword,
            Long brandId,
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean isNew,
            Boolean isFeatured,
            BigDecimal minRating,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    ProductDetailResponse getProductDetail(String id);

    List<ProductSpecificationResponse> getProductSpecifications(String id);

    List<ReviewResponse> getProductReviews(String id);

    List<ProductSummaryResponse> getFeaturedProducts(int limit);

    List<ProductSummaryResponse> getProductsByCategory(Long categoryId);
    
    // New methods for advanced search
    PageResponse<ProductSummaryResponse> searchProducts(ProductSearchRequest request);
    
    ProductFilterOptionResponse getFilterOptions();
    
    List<ProductSummaryResponse> getProductSuggestions(String keyword,
                                                      int limit,
                                                      Long brandId,
                                                      Long categoryId,
                                                      BigDecimal minPrice,
                                                      BigDecimal maxPrice,
                                                      Boolean isNew,
                                                      Boolean isFeatured,
                                                      BigDecimal minRating);
}
