package org.example.assignment.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.assignment.common.ApiResponse;
import org.example.assignment.common.ApiResponses;
import org.example.assignment.dto.response.TagResponse;
import org.example.assignment.service.ATagServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tags")
@RequiredArgsConstructor
public class ATagController {

    private final ATagServiceImpl tagService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TagResponse>>> getAllTags(HttpServletRequest req) {
        List<TagResponse> data = tagService.getAll();
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "OK", data, req));
    }
}
