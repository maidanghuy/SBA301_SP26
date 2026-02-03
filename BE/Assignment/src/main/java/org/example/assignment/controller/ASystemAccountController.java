package org.example.assignment.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.assignment.common.ApiResponse;
import org.example.assignment.common.ApiResponses;
import org.example.assignment.dto.request.DeleteFlagRequest;
import org.example.assignment.dto.request.ASystemAccountCreateRequest;
import org.example.assignment.dto.request.ASystemAccountUpdateRequest;
import org.example.assignment.dto.response.ASystemAccountResponse;
import org.example.assignment.dto.response.TagResponse;
import org.example.assignment.service.ASystemAccountServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ASystemAccountController {

    private final ASystemAccountServiceImpl accountService;

    // GET /api/v1/accounts?includeDeleted=false&q=abc
    @GetMapping
    public ResponseEntity<ApiResponse<List<ASystemAccountResponse>>> getAll(
            @RequestParam(required = false) Boolean includeDeleted,
            @RequestParam(required = false) String q,
            HttpServletRequest req
    ) {
        List<ASystemAccountResponse> data = accountService.getAll(includeDeleted, q);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "OK", data, req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ASystemAccountResponse>> getById(@PathVariable Long id, HttpServletRequest req) {
        ASystemAccountResponse data = accountService.getById(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "OK", data, req));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ASystemAccountResponse>> create(@Valid @RequestBody ASystemAccountCreateRequest request, HttpServletRequest req) {
        ASystemAccountResponse data = accountService.create(request);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "OK", data, req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ASystemAccountResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody ASystemAccountUpdateRequest request,
            HttpServletRequest req
    ) {
        ASystemAccountResponse data = accountService.update(id, request);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "OK", data, req));
    }

    @PatchMapping("/{id}/delete-flag")
    public ResponseEntity<ApiResponse<ASystemAccountResponse>> updateDeleteFlag(
            @PathVariable Long id,
            @RequestBody DeleteFlagRequest request,
            HttpServletRequest req
    ) {
        ASystemAccountResponse data = accountService.updateDeleteFlag(id, request.getDeleteFlag());
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "OK", data, req));
    }
}
