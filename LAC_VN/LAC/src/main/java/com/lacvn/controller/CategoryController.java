package com.lacvn.controller;

import com.lacvn.common.ApiResponse;
import com.lacvn.common.ApiResponses;
import com.lacvn.dto.request.CategoryRequest;
import com.lacvn.dto.response.CategoryResponse;
import com.lacvn.dto.response.ProductSummaryResponse;
import com.lacvn.service.CategoryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping("/api/admin/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponse>> create(
            @Valid @RequestBody CategoryRequest request,
            HttpServletRequest req
    ) {
        CategoryResponse result = categoryService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponses.success(HttpStatus.CREATED, "Category created successfully", result, req));
    }

    @GetMapping("/api/categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAll(HttpServletRequest req) {
        List<CategoryResponse> result = categoryService.getAll();
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Categories retrieved successfully", result, req));
    }

    @GetMapping("/api/categories/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getDetail(
            @PathVariable Long id,
            HttpServletRequest req
    ) {
        CategoryResponse result = categoryService.getDetail(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Category retrieved successfully", result, req));
    }

    @PutMapping("/api/admin/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request,
            HttpServletRequest req
    ) {
        CategoryResponse result = categoryService.update(id, request);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Category updated successfully", result, req));
    }

    @DeleteMapping("/api/admin/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> delete(
            @PathVariable Long id,
            HttpServletRequest req
    ) {
        categoryService.delete(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Category deleted successfully", null, req));
    }

    @GetMapping("/api/categories/{id}/products")
    public ResponseEntity<ApiResponse<List<ProductSummaryResponse>>> getProductsByCategory(
            @PathVariable Long id,
            HttpServletRequest req
    ) {
        List<ProductSummaryResponse> result = categoryService.getProductsByCategory(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Products retrieved successfully", result, req));
    }
}
