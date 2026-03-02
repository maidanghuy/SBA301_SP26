package org.example.asis03.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoomTypeResponse {
    private Long roomTypeId;
    private String roomTypeName;
    private String typeDescription;
    private String typeNote;
}