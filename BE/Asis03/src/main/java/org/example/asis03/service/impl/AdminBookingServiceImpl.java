package org.example.asis03.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.asis03.dto.response.BookingDetailResponse;
import org.example.asis03.dto.response.BookingResponse;
import org.example.asis03.entity.AS03BookingReservation;
import org.example.asis03.repository.AS03BookingReservationRepository;
import org.example.asis03.service.AdminBookingService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminBookingServiceImpl implements AdminBookingService {

    private final AS03BookingReservationRepository bookingReservationRepo;

    private BookingResponse toRes(AS03BookingReservation r) {
        List<BookingDetailResponse> details = Optional.ofNullable(r.getBookingDetails())
                .orElseGet(List::of)
                .stream()
                .map(d -> BookingDetailResponse.builder()
                        .roomId(d.getRoom().getRoomId())
                        .roomNumber(d.getRoom().getRoomNumber())
                        .startDate(d.getStartDate())
                        .endDate(d.getEndDate())
                        .actualPrice(d.getActualPrice())
                        .build())
                .toList();

        return BookingResponse.builder()
                .bookingReservationId(r.getBookingReservationId())
                .bookingDate(r.getBookingDate())
                .bookingStatus(r.getBookingStatus().name())
                .totalPrice(r.getTotalPrice())
                .customerId(r.getCustomer().getId())
                .details(details)
                .build();
    }

    @Override
    public List<BookingResponse> listAll(String status, Long customerId, LocalDateTime from, LocalDateTime to) {
        // status null/blank => không filter
        String st = (status == null || status.isBlank()) ? null : status.trim().toUpperCase();

        var rows = bookingReservationRepo.findAdminBookings(st, customerId, from, to);
        return rows.stream().map(this::toRes).toList();
    }
}