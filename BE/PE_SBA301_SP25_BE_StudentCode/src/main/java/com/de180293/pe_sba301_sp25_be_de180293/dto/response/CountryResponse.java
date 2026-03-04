package com.de180293.pe_sba301_sp25_be_de180293.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CountryResponse {
    private Integer countryId;
    private String countryName;
}