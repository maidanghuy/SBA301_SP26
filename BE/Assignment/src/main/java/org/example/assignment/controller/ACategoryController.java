package org.example.assignment.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.assignment.common.ApiResponse;
import org.example.assignment.common.ApiResponses;
import org.example.assignment.dto.request.ACategoryCreateRequest;
import org.example.assignment.dto.request.ACategoryUpdateRequest;
import org.example.assignment.dto.request.DeleteFlagRequest;
import org.example.assignment.dto.response.ACategoryResponse;
import org.example.assignment.service.impl.ACategoryServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class ACategoryController {

    private final ACategoryServiceImpl categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ACategoryResponse>>> getAll(HttpServletRequest req) {
        List<ACategoryResponse> data = categoryService.getAll();
        return ResponseEntity.ok(
                ApiResponses.success(HttpStatus.OK, "OK", data, req)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ACategoryResponse>> getById(@PathVariable Long id, HttpServletRequest req) {
        ACategoryResponse data = categoryService.getById(id);
        return ResponseEntity.ok(
                ApiResponses.success(HttpStatus.OK, "OK", data, req)
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ACategoryResponse>> create(@RequestBody ACategoryCreateRequest request, HttpServletRequest req) {
        ACategoryResponse data = categoryService.create(request);
        return ResponseEntity.ok(
                ApiResponses.success(HttpStatus.OK, "OK", data, req)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ACategoryResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody ACategoryUpdateRequest request,
            HttpServletRequest req
    ) {
        ACategoryResponse data = categoryService.update(id, request);
        return ResponseEntity.ok(
                ApiResponses.success(HttpStatus.OK, "OK", data, req)
        );
    }
    @PatchMapping("/{id}/delete-flag")
    public ResponseEntity<ApiResponse<ACategoryResponse>> updateDeleteFlag(
            @PathVariable Long id,
            @Valid @RequestBody DeleteFlagRequest request,
            HttpServletRequest req
    ) {
        ACategoryResponse data = categoryService.updateDeleteFlag(id, request.getDeleteFlag());
        return ResponseEntity.ok(
                ApiResponses.success(HttpStatus.OK, "OK", data, req)
        );
    }
}
