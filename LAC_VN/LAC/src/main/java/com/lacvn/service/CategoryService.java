package com.lacvn.service;

import com.lacvn.dto.request.CategoryRequest;
import com.lacvn.dto.response.CategoryResponse;
import com.lacvn.dto.response.ProductSummaryResponse;

import java.util.List;

public interface CategoryService {
    CategoryResponse create(CategoryRequest request);

    List<CategoryResponse> getAll();

    CategoryResponse getDetail(Long id);

    CategoryResponse update(Long id, CategoryRequest request);

    void delete(Long id);

    List<ProductSummaryResponse> getProductsByCategory(Long categoryId);
}
