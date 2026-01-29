package org.example.orchid.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OrchidRequest {

    @NotBlank(message = "orchidName is required")
    @Size(max = 100, message = "orchidName max length is 100")
    private String orchidName;

    private String description;

    @NotBlank(message = "categoryId is required")
    private String categoryId;

    private Boolean isSpecial;

    @Size(max = 255, message = "image max length is 255")
    private String image;

    private String createdBy;
    private String updatedBy;
}