package com.de180293.pe_sba301_sp25_be_de180293.service.impl;

import com.de180293.pe_sba301_sp25_be_de180293.dto.response.CountryResponse;
import com.de180293.pe_sba301_sp25_be_de180293.repository.PR03CountryRepository;
import com.de180293.pe_sba301_sp25_be_de180293.service.CountryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CountryServiceImpl implements CountryService {

    private final PR03CountryRepository countryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CountryResponse> getAllCountries() {

        return countryRepository.findAll(Sort.by("countryId"))
                .stream()
                .map(c -> CountryResponse.builder()
                        .countryId(c.getCountryId())
                        .countryName(c.getCountryName())
                        .build())
                .toList();
    }
}