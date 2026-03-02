package org.example.asis03.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class BookingResponse {

    private Long bookingReservationId;
    private LocalDateTime bookingDate;
    private String bookingStatus;
    private BigDecimal totalPrice;
    private Long customerId;

    private List<BookingDetailResponse> details;
}