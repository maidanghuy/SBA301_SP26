package com.lacvn.controller;

import com.lacvn.common.ApiResponse;
import com.lacvn.common.ApiResponses;
import com.lacvn.dto.request.BrandRequest;
import com.lacvn.dto.response.BrandResponse;
import com.lacvn.service.BrandService;
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
public class BrandController {

    private final BrandService brandService;

    @PostMapping("/api/admin/brands")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BrandResponse>> create(
            @Valid @RequestBody BrandRequest request,
            HttpServletRequest req
    ) {
        BrandResponse result = brandService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponses.success(HttpStatus.CREATED, "Brand created successfully", result, req));
    }

    @GetMapping("/api/brands")
    public ResponseEntity<ApiResponse<List<BrandResponse>>> getAll(HttpServletRequest req) {
        List<BrandResponse> result = brandService.getAll();
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Brands retrieved successfully", result, req));
    }

    @PutMapping("/api/admin/brands/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BrandResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody BrandRequest request,
            HttpServletRequest req
    ) {
        BrandResponse result = brandService.update(id, request);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Brand updated successfully", result, req));
    }

    @DeleteMapping("/api/admin/brands/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> delete(
            @PathVariable Long id,
            HttpServletRequest req
    ) {
        brandService.delete(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Brand deleted successfully", null, req));
    }
}
