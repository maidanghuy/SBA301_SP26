package com.lacvn.controller;

import com.lacvn.common.ApiResponse;
import com.lacvn.common.ApiResponses;
import com.lacvn.dto.request.ShippingMethodRequest;
import com.lacvn.dto.response.ShippingMethodResponse;
import com.lacvn.service.ShippingMethodService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shipping-methods")
@RequiredArgsConstructor
public class ShippingMethodController {

    private final ShippingMethodService shippingMethodService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShippingMethodResponse>>> getAllShippingMethods(HttpServletRequest request) {
        List<ShippingMethodResponse> shippingMethods = shippingMethodService.getAllShippingMethods();
        return ResponseEntity.ok(ApiResponses.ok(shippingMethods, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ShippingMethodResponse>> getShippingMethodById(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        ShippingMethodResponse result = shippingMethodService.getShippingMethodById(id);
        return ResponseEntity.ok(ApiResponses.ok(result, request));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ShippingMethodResponse>> createShippingMethod(
            @Valid @RequestBody ShippingMethodRequest request,
            HttpServletRequest httpRequest
    ) {
        ShippingMethodResponse result = shippingMethodService.createShippingMethod(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponses.success(HttpStatus.CREATED, "Shipping method created successfully", result, httpRequest));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ShippingMethodResponse>> updateShippingMethod(
            @PathVariable Long id,
            @Valid @RequestBody ShippingMethodRequest request,
            HttpServletRequest httpRequest
    ) {
        ShippingMethodResponse result = shippingMethodService.updateShippingMethod(id, request);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Shipping method updated successfully", result, httpRequest));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> deleteShippingMethod(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        shippingMethodService.deleteShippingMethod(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Shipping method deleted successfully", null, request));
    }
}
