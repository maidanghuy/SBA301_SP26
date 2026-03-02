package org.example.asis03.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.asis03.common.ApiResponse;
import org.example.asis03.common.ApiResponses;
import org.example.asis03.dto.request.BookingCreateRequest;
import org.example.asis03.dto.response.BookingResponse;
import org.example.asis03.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // POST /api/bookings
    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> create(
            @Valid @RequestBody BookingCreateRequest request,
            HttpServletRequest req
    ) {
        BookingResponse data = bookingService.create(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponses.success(HttpStatus.CREATED, "Created", data, req));
    }

    // POST /api/bookings/me
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> myHistory(HttpServletRequest req) {
        List<BookingResponse> data = bookingService.myHistory();
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "OK", data, req));
    }

    // GET /api/bookings/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getById(
            @PathVariable Long id,
            HttpServletRequest req
    ) {
        BookingResponse data = bookingService.getById(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "OK", data, req));
    }

    // POST /api/bookings/{id}/cancel
    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancel(
            @PathVariable Long id,
            HttpServletRequest req
    ) {
        BookingResponse data = bookingService.cancel(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Cancelled", data, req));
    }
}