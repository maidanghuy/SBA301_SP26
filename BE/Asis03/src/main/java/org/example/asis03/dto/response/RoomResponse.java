package org.example.asis03.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class RoomResponse {
    private Long roomId;
    private String roomNumber;
    private String roomDetailDescription;
    private Integer roomMaxCapacity;

    private Boolean roomStatus;
    private BigDecimal roomPricePerDay;

    private Long roomTypeId;
    private String roomTypeName;
}