package com.lacvn.controller;

import com.lacvn.common.ApiResponse;
import com.lacvn.common.ApiResponses;
import com.lacvn.dto.request.ProductSpecificationDefinitionRequest;
import com.lacvn.dto.response.ProductSpecificationDefinitionResponse;
import com.lacvn.service.ProductSpecificationDefinitionService;
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
public class ProductSpecificationDefinitionController {

    private final ProductSpecificationDefinitionService service;

    @PostMapping("/api/admin/product-specifications")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductSpecificationDefinitionResponse>> create(
            @Valid @RequestBody ProductSpecificationDefinitionRequest request,
            HttpServletRequest req
    ) {
        ProductSpecificationDefinitionResponse result = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponses.success(HttpStatus.CREATED, "Specification created successfully", result, req));
    }

    @GetMapping("/api/product-specifications")
    public ResponseEntity<ApiResponse<List<ProductSpecificationDefinitionResponse>>> getAll(
            HttpServletRequest req
    ) {
        List<ProductSpecificationDefinitionResponse> result = service.getAll();
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Specifications retrieved successfully", result, req));
    }

    @GetMapping("/api/product-specifications/{id}")
    public ResponseEntity<ApiResponse<ProductSpecificationDefinitionResponse>> getDetail(
            @PathVariable Long id,
            HttpServletRequest req
    ) {
        ProductSpecificationDefinitionResponse result = service.getDetail(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Specification retrieved successfully", result, req));
    }

    @PutMapping("/api/admin/product-specifications/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductSpecificationDefinitionResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody ProductSpecificationDefinitionRequest request,
            HttpServletRequest req
    ) {
        ProductSpecificationDefinitionResponse result = service.update(id, request);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Specification updated successfully", result, req));
    }

    @DeleteMapping("/api/admin/product-specifications/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> delete(
            @PathVariable Long id,
            HttpServletRequest req
    ) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Specification deleted successfully", null, req));
    }
}

