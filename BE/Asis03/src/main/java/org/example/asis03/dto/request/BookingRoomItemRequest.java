package org.example.asis03.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingRoomItemRequest {

    @NotNull
    private Long roomId;

    @NotNull
    @Future(message = "Start date must be in the future")
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;
}