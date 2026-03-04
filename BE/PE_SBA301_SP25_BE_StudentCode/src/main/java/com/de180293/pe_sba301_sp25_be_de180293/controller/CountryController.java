package com.de180293.pe_sba301_sp25_be_de180293.controller;

import com.de180293.pe_sba301_sp25_be_de180293.common.ApiResponse;
import com.de180293.pe_sba301_sp25_be_de180293.common.ApiResponses;
import com.de180293.pe_sba301_sp25_be_de180293.dto.response.CountryResponse;
import com.de180293.pe_sba301_sp25_be_de180293.service.CountryService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/countries")
@RequiredArgsConstructor
public class CountryController {

    private final CountryService countryService;

    // Public API
    @GetMapping
    public ResponseEntity<ApiResponse<List<CountryResponse>>> getAll(HttpServletRequest req) {

        List<CountryResponse> data = countryService.getAllCountries();

        return ResponseEntity.ok(
                ApiResponses.success(HttpStatus.OK, "OK", data, req)
        );
    }
}