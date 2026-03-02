package org.example.asis03.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class BookingDetailResponse {

    private Long roomId;
    private String roomNumber;

    private LocalDate startDate;
    private LocalDate endDate;

    private BigDecimal actualPrice;
}