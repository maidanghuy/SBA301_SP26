package com.lacvn.service;

import com.lacvn.dto.request.ProductSpecificationDefinitionRequest;
import com.lacvn.dto.response.ProductSpecificationDefinitionResponse;

import java.util.List;

public interface ProductSpecificationDefinitionService {
    ProductSpecificationDefinitionResponse create(ProductSpecificationDefinitionRequest request);

    List<ProductSpecificationDefinitionResponse> getAll();

    ProductSpecificationDefinitionResponse getDetail(Long id);

    ProductSpecificationDefinitionResponse update(Long id, ProductSpecificationDefinitionRequest request);

    void delete(Long id);
}

