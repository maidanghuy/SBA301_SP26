package org.example.assignment.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.assignment.common.ApiResponse;
import org.example.assignment.common.ApiResponses;
import org.example.assignment.dto.request.ANewsCreateRequest;
import org.example.assignment.dto.request.ANewsUpdateRequest;
import org.example.assignment.dto.request.DeleteFlagRequest;
import org.example.assignment.dto.response.ANewsResponse;
import org.example.assignment.service.ANewsServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/news")
@RequiredArgsConstructor
public class ANewsController {

    private final ANewsServiceImpl newsService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ANewsResponse>>> getAll(
            @RequestParam(required = false) Boolean includeDeleted,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String status,
            HttpServletRequest req
    ) {
        List<ANewsResponse> data = newsService.getAll(includeDeleted, q, status);
        return ResponseEntity.ok(
                ApiResponses.success(HttpStatus.OK, "OK", data, req)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ANewsResponse>> getById(@PathVariable Long id, HttpServletRequest req) {
        ANewsResponse data = newsService.getById(id);
        return ResponseEntity.ok(
                ApiResponses.success(HttpStatus.OK, "OK", data, req)
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ANewsResponse>> create(@Valid @RequestBody ANewsCreateRequest request, HttpServletRequest req) {
        ANewsResponse data = newsService.create(request);
        return ResponseEntity.ok(
                ApiResponses.success(HttpStatus.OK, "OK", data, req)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ANewsResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody ANewsUpdateRequest request,
            HttpServletRequest req
    ) {

        ANewsResponse data = newsService.update(id, request);
        return ResponseEntity.ok(
                ApiResponses.success(HttpStatus.OK, "OK", data, req)
        );
    }

    @PatchMapping("/{id}/delete-flag")
    public ResponseEntity<ApiResponse<ANewsResponse>> updateDeleteFlag(
            @PathVariable Long id,
            @RequestBody DeleteFlagRequest request,
            HttpServletRequest req
    ) {
        ANewsResponse data = newsService.updateDeleteFlag(id, request.getDeleteFlag());
        return ResponseEntity.ok(
                ApiResponses.success(HttpStatus.OK, "OK", data, req)
        );
    }
}
