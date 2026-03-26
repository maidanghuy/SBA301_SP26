package com.lacvn.service;

import com.lacvn.dto.request.BrandRequest;
import com.lacvn.dto.response.BrandResponse;

import java.util.List;

public interface BrandService {
    BrandResponse create(BrandRequest request);

    List<BrandResponse> getAll();

    BrandResponse update(Long id, BrandRequest request);

    void delete(Long id);
}
