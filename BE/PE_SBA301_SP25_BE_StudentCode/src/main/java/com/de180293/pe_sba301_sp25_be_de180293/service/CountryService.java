package com.de180293.pe_sba301_sp25_be_de180293.service;

import com.de180293.pe_sba301_sp25_be_de180293.dto.response.CountryResponse;

import java.util.List;

public interface CountryService {
    List<CountryResponse> getAllCountries();
}