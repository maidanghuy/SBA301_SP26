package org.example.asis03.service;

import org.example.asis03.dto.response.BookingResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface AdminBookingService {
    List<BookingResponse> listAll(String status, Long customerId, LocalDateTime from, LocalDateTime to);
}