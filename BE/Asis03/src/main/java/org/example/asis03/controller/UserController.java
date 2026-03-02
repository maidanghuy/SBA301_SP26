package org.example.asis03.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.asis03.common.ApiResponse;
import org.example.asis03.common.ApiResponses;
import org.example.asis03.dto.request.CustomerUpdateRequest;
import org.example.asis03.dto.response.CustomerResponse;
import org.example.asis03.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class UserController {

    private final CustomerService customerService;

    // GET /api/customers/me
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<CustomerResponse>> me(HttpServletRequest req) {
        CustomerResponse data = customerService.me();
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "OK", data, req));
    }

    // PATCH /api/customers/me
    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<CustomerResponse>> updateMe(
            @Valid @RequestBody CustomerUpdateRequest request,
            HttpServletRequest req
    ) {
        CustomerResponse data = customerService.updateMe(request);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Updated", data, req));
    }
}