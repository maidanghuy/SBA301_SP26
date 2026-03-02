package org.example.asis03.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RoomRequest {

    @NotBlank
    @Size(max = 30)
    private String roomNumber;

    @Size(max = 1000)
    private String roomDetailDescription;

    @NotNull
    @Min(1)
    private Integer roomMaxCapacity;

    @NotNull
    private Long roomTypeId;

    @NotNull
    private Boolean roomStatus;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal roomPricePerDay;
}