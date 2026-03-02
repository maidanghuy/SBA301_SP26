package org.example.asis03.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RoomTypeRequest {
    @NotBlank
    @Size(max = 100)
    private String roomTypeName;

    @Size(max = 500)
    private String typeDescription;

    @Size(max = 255)
    private String typeNote;
}