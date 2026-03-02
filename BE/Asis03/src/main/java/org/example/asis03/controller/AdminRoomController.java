package org.example.asis03.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.asis03.common.ApiResponse;
import org.example.asis03.common.ApiResponses;
import org.example.asis03.dto.request.RoomRequest;
import org.example.asis03.dto.response.RoomResponse;
import org.example.asis03.service.RoomInformationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/rooms")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STAFF')")
public class AdminRoomController {

    private final RoomInformationService roomService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoomResponse>>> getAll(HttpServletRequest req) {
        List<RoomResponse> data = roomService.getAllAdmin();
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "OK", data, req));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RoomResponse>> create(
            @Valid @RequestBody RoomRequest body, HttpServletRequest req) {
        RoomResponse data = roomService.create(body);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponses.success(HttpStatus.CREATED, "Created", data, req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RoomResponse>> update(
            @PathVariable Long id, @Valid @RequestBody RoomRequest body, HttpServletRequest req) {
        RoomResponse data = roomService.update(id, body);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Updated", data, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long id, HttpServletRequest req) {
        roomService.delete(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Deleted", null, req));
    }
}