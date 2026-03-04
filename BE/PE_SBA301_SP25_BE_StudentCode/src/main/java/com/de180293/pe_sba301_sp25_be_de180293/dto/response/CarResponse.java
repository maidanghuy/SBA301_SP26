package com.de180293.pe_sba301_sp25_be_de180293.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CarResponse {
    private Integer carId;
    private String carName;
    private Short unitsInStock;
    private Integer unitPrice;
    private String countryName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean deleteFlag;
}