package org.example.asis03.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.asis03.common.ApiResponse;
import org.example.asis03.common.ApiResponses;
import org.example.asis03.dto.request.RoomTypeRequest;
import org.example.asis03.dto.response.RoomTypeResponse;
import org.example.asis03.service.RoomTypeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/room-types")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STAFF')")
public class AdminRoomTypeController {

    private final RoomTypeService roomTypeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoomTypeResponse>>> getAll(HttpServletRequest req) {
        List<RoomTypeResponse> data = roomTypeService.getAll();
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "OK", data, req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoomTypeResponse>> getById(@PathVariable Long id, HttpServletRequest req) {
        RoomTypeResponse data = roomTypeService.getById(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "OK", data, req));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RoomTypeResponse>> create(
            @Valid @RequestBody RoomTypeRequest body, HttpServletRequest req) {
        RoomTypeResponse data = roomTypeService.create(body);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponses.success(HttpStatus.CREATED, "Created", data, req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RoomTypeResponse>> update(
            @PathVariable Long id, @Valid @RequestBody RoomTypeRequest body, HttpServletRequest req) {
        RoomTypeResponse data = roomTypeService.update(id, body);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Updated", data, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long id, HttpServletRequest req) {
        roomTypeService.delete(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Deleted", null, req));
    }
}