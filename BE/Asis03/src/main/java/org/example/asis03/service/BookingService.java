package org.example.asis03.service;

import org.example.asis03.dto.request.BookingCreateRequest;
import org.example.asis03.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {
    BookingResponse create(BookingCreateRequest req);
    BookingResponse getById(Long id);
    BookingResponse cancel(Long id);
    List<BookingResponse> myHistory();
}