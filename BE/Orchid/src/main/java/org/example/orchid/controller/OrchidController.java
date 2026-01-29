package org.example.orchid.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.orchid.common.ApiResponse;
import org.example.orchid.common.ApiResponses;
import org.example.orchid.dto.OrchidRequest;
import org.example.orchid.entity.Category;
import org.example.orchid.entity.Orchid;
import org.example.orchid.service.CategoryServiceImpl;
import org.example.orchid.service.OrchidServiceImpl;
import org.example.orchid.service.impl.CategoryService;
import org.example.orchid.service.impl.OrchidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/orchids")
@RequiredArgsConstructor
public class OrchidController {

    private final OrchidService orchidService;
    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Orchid>>> search(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String sort,
            HttpServletRequest req
    ) {
        List<Orchid> data = orchidService.search(category, q, sort);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "OK", data, req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Orchid>> getById(@PathVariable Long id, HttpServletRequest req) {
        Orchid data = orchidService.findById(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "OK", data, req));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Orchid>> create(@Valid @RequestBody OrchidRequest dto, HttpServletRequest req) {
        System.out.println("++++++++++++++++");
        Category categoryEntity = categoryService.findById(dto.getCategoryId());

        Orchid orchid = Orchid.builder()
                .orchidName(dto.getOrchidName())
                .description(dto.getDescription())
                .isSpecial(dto.getIsSpecial() != null ? dto.getIsSpecial() : false)
                .image(dto.getImage())
                .category(categoryEntity)
                .build();

        Orchid saved = orchidService.save(orchid);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponses.success(HttpStatus.CREATED, "Created", saved, req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Orchid>> update(
            @PathVariable Long id,
            @Valid @RequestBody OrchidRequest dto,
            HttpServletRequest req
    ) {
        Orchid existing = orchidService.findById(id);

        existing.setOrchidName(dto.getOrchidName());
        existing.setDescription(dto.getDescription());
        existing.setIsSpecial(dto.getIsSpecial() != null ? dto.getIsSpecial() : existing.getIsSpecial());
        existing.setImage(dto.getImage());
        existing.setUpdatedBy(dto.getUpdatedBy());

        if (dto.getCategoryId() != null && !dto.getCategoryId().isBlank()) {
            Category categoryEntity = categoryService.findById(dto.getCategoryId());
            existing.setCategory(categoryEntity);
        }

        Orchid saved = orchidService.save(existing);

        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Updated", saved, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id, HttpServletRequest req) {
        orchidService.deleteById(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Deleted", null, req));
    }
}
