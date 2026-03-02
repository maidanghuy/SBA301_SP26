package org.example.asis03.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.asis03.common.ApiResponse;
import org.example.asis03.common.ApiResponses;
import org.example.asis03.dto.response.BookingResponse;
import org.example.asis03.service.AdminBookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
public class AdminBookingController {

    private final AdminBookingService adminBookingService;

    // GET /api/admin/bookings?status=&customerId=&from=&to=
    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingResponse>>> listAll(
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "customerId", required = false) Long customerId,
            @RequestParam(value = "from", required = false) LocalDateTime from, // ISO: 2026-03-02T00:00:00
            @RequestParam(value = "to", required = false) LocalDateTime to,
            HttpServletRequest req
    ) {
        List<BookingResponse> data = adminBookingService.listAll(status, customerId, from, to);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "OK", data, req));
    }
}