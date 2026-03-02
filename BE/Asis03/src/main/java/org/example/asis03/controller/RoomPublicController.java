package org.example.asis03.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.asis03.common.ApiResponse;
import org.example.asis03.common.ApiResponses;
import org.example.asis03.dto.response.RoomResponse;
import org.example.asis03.service.RoomInformationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomPublicController {

    private final RoomInformationService roomService;

    // GET /api/rooms?q=101 OR /api/rooms?roomTypeId=1 OR /api/rooms?status=true
    @GetMapping
    public ResponseEntity<ApiResponse<List<RoomResponse>>> getAll(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long roomTypeId,
            @RequestParam(required = false) Boolean status,
            HttpServletRequest req
    ) {
        List<RoomResponse> data = roomService.getAllPublic(q, roomTypeId, status);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "OK", data, req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoomResponse>> getById(
            @PathVariable Long id,
            HttpServletRequest req
    ) {
        RoomResponse data = roomService.getPublicById(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "OK", data, req));
    }
}