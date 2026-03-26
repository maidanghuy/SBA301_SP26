package com.lacvn.controller;

import com.lacvn.common.ApiResponse;
import com.lacvn.common.ApiResponses;
import com.lacvn.common.PageResponse;
import com.lacvn.dto.request.ProductCreateRequest;
import com.lacvn.dto.request.ProductSearchRequest;
import com.lacvn.dto.request.ProductUpdateRequest;
import com.lacvn.dto.response.ProductDetailResponse;
import com.lacvn.dto.response.ProductFilterOptionResponse;
import com.lacvn.dto.response.ProductSpecificationResponse;
import com.lacvn.dto.response.ProductSummaryResponse;
import com.lacvn.dto.response.ReviewResponse;
import com.lacvn.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping("/api/admin/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductDetailResponse>> create(
            @Valid @RequestBody ProductCreateRequest request,
            HttpServletRequest req
    ) {
        ProductDetailResponse result = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponses.success(HttpStatus.CREATED, "Product created successfully", result, req));
    }

    @PutMapping("/api/admin/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductDetailResponse>> update(
            @PathVariable String id,
            @Valid @RequestBody ProductUpdateRequest request,
            HttpServletRequest req
    ) {
        ProductDetailResponse result = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Product updated successfully", result, req));
    }

    @DeleteMapping("/api/admin/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductDetailResponse>> delete(
            @PathVariable String id,
            HttpServletRequest req
    ) {
        ProductDetailResponse result = productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Product deleted successfully", result, req));
    }

    @GetMapping("/api/products")
    public ResponseEntity<ApiResponse<PageResponse<ProductSummaryResponse>>> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean isNew,
            @RequestParam(required = false) Boolean isFeatured,
            @RequestParam(required = false) BigDecimal minRating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            HttpServletRequest req
    ) {
        PageResponse<ProductSummaryResponse> result = productService.getProducts(
                keyword, brandId, categoryId, minPrice, maxPrice, isNew, isFeatured, minRating, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Products retrieved successfully", result, req));
    }

    @GetMapping("/api/products/{id}")
    public ResponseEntity<ApiResponse<ProductDetailResponse>> detail(
            @PathVariable String id,
            HttpServletRequest req
    ) {
        ProductDetailResponse result = productService.getProductDetail(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Product retrieved successfully", result, req));
    }

    @GetMapping("/api/products/{id}/specifications")
    public ResponseEntity<ApiResponse<List<ProductSpecificationResponse>>> specifications(
            @PathVariable String id,
            HttpServletRequest req
    ) {
        List<ProductSpecificationResponse> result = productService.getProductSpecifications(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Product specifications retrieved successfully", result, req));
    }

    @GetMapping("/api/products/{id}/reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> reviews(
            @PathVariable String id,
            HttpServletRequest req
    ) {
        List<ReviewResponse> result = productService.getProductReviews(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Product reviews retrieved successfully", result, req));
    }

    @GetMapping("/api/products/featured")
    public ResponseEntity<ApiResponse<List<ProductSummaryResponse>>> featured(
            @RequestParam(defaultValue = "8") int limit,
            HttpServletRequest req
    ) {
        List<ProductSummaryResponse> result = productService.getFeaturedProducts(limit);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Featured products retrieved successfully", result, req));
    }

//    @GetMapping("/api/products/newest")
//    public ResponseEntity<ApiResponse<List<ProductSummaryResponse>>> newest(
//            @RequestParam(defaultValue = "8") int limit,
//            HttpServletRequest req
//    ) {
//        List<ProductSummaryResponse> result = productService.getNewestProducts(limit);
//        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Newest products retrieved successfully", result, req));
//    }

    /**
     * Advanced search API with POST body-based request
     * POST /api/products/search
     *
     * Example request body:
     * {
     *   "keyword": "laptop",
     *   "brandId": 1,
     *   "categoryId": 5,
     *   "minPrice": 1000,
     *   "maxPrice": 5000,
     *   "isNew": true,
     *   "isFeatured": false,
     *   "minRating": 3.5,
     *   "page": 0,
     *   "size": 20,
     *   "sortBy": "price",
     *   "sortDir": "asc"
     * }
     */
    @PostMapping("/api/products/search")
    public ResponseEntity<ApiResponse<PageResponse<ProductSummaryResponse>>> search(
            @RequestBody ProductSearchRequest request,
            HttpServletRequest req
    ) {
        PageResponse<ProductSummaryResponse> result = productService.searchProducts(request);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Search completed successfully", result, req));
    }

    /**
     * Get search suggestions based on keyword
     * GET /api/products/search/suggestions?keyword=laptop&limit=5
     */
    @GetMapping("/api/products/search/suggestions")
    public ResponseEntity<ApiResponse<List<ProductSummaryResponse>>> suggestions(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "5") int limit,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean isNew,
            @RequestParam(required = false) Boolean isFeatured,
            @RequestParam(required = false) BigDecimal minRating,
            HttpServletRequest req
    ) {
        List<ProductSummaryResponse> result = productService.getProductSuggestions(
                keyword, limit, brandId, categoryId, minPrice, maxPrice, isNew, isFeatured, minRating
        );
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Suggestions retrieved successfully", result, req));
    }

    /**
     * Get available filter options (brands, categories, price range, etc.)
     * GET /api/products/filters
     */
    @GetMapping("/api/products/filters")
    public ResponseEntity<ApiResponse<ProductFilterOptionResponse>> filterOptions(
            HttpServletRequest req
    ) {
        ProductFilterOptionResponse result = productService.getFilterOptions();
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Filter options retrieved successfully", result, req));
    }
}
