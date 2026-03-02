package org.example.asis03.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.asis03.common.ApiResponse;
import org.example.asis03.common.ApiResponses;
import org.example.asis03.dto.request.CustomerAdminUpdateRequest;
import org.example.asis03.dto.response.CustomerAdminResponse;
import org.example.asis03.service.AdminCustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/customers")
@RequiredArgsConstructor
public class AdminCustomerController {

    private final AdminCustomerService adminCustomerService;

    // GET /api/admin/customers?q=
    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomerAdminResponse>>> list(
            @RequestParam(value = "q", required = false) String q,
            HttpServletRequest req
    ) {
        List<CustomerAdminResponse> data = adminCustomerService.list(q);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "OK", data, req));
    }

    // PUT /api/admin/customers/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerAdminResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody CustomerAdminUpdateRequest request,
            HttpServletRequest req
    ) {
        CustomerAdminResponse data = adminCustomerService.update(id, request);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Updated", data, req));
    }

    // DELETE /api/admin/customers/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> remove(
            @PathVariable Long id,
            HttpServletRequest req
    ) {
        adminCustomerService.remove(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Deleted", null, req));
    }
}