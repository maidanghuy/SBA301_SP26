package org.example.asis03.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class BookingCreateRequest {

    @NotEmpty
    @Valid
    private List<BookingRoomItemRequest> rooms;
}