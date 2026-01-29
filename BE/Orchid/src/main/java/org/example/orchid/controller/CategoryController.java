package org.example.orchid.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.orchid.common.ApiResponse;
import org.example.orchid.common.ApiResponses;
import org.example.orchid.entity.Category;
import org.example.orchid.service.impl.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * Get all categories
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAll(HttpServletRequest req) {
        List<Category> data = categoryService.findAll();
        return ResponseEntity.ok(
                ApiResponses.success(HttpStatus.OK, "OK", data, req)
        );
    }

    /**
     * Get category by id
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> getById(
            @PathVariable String id,
            HttpServletRequest req
    ) {
        Category data = categoryService.findById(id);
        return ResponseEntity.ok(
                ApiResponses.success(HttpStatus.OK, "OK", data, req)
        );
    }

    /**
     * Create category
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Category>> create(
            @RequestBody Category category,
            HttpServletRequest req
    ) {
        Category saved = categoryService.save(category);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponses.success(HttpStatus.CREATED, "Created", saved, req));
    }
}