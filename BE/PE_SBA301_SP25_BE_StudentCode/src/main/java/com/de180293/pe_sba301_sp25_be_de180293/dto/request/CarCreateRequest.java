package com.de180293.pe_sba301_sp25_be_de180293.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CarCreateRequest {

    @NotBlank
    @Size(min = 11, max = 40, message = "CarName must be greater than 10 characters")
    private String carName;

    @NotNull
    private Integer countryId;

    @NotNull
    @Min(value = 5, message = "UnitsInStock must be >= 5")
    @Max(value = 20, message = "UnitsInStock must be <= 20")
    private Short unitsInStock;

    @NotNull
    @Min(value = 1, message = "UnitPrice must be positive")
    private Integer unitPrice;
}