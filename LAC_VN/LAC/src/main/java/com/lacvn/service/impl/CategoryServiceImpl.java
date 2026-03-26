package com.lacvn.service.impl;

import com.lacvn.dto.request.CategoryRequest;
import com.lacvn.dto.response.CategoryResponse;
import com.lacvn.entity.Category;
import com.lacvn.exception.ResourceNotFoundException;
import com.lacvn.repository.CategoryRepository;
import com.lacvn.dto.response.ProductSummaryResponse;
import com.lacvn.service.CategoryService;
import com.lacvn.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductService productService;

    @Override
    public CategoryResponse create(CategoryRequest request) {
        Category category = Category.builder()
                .id(nextId())
                .nameVn(request.getNameVn())
                .nameEnglish(request.getNameEnglish())
                .keyC(request.getKey())


                .build();
        return toResponse(categoryRepository.save(category));
    }

    @Override
    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll().stream()
                .filter(category -> !Boolean.TRUE.equals(category.getDeleteFlag()))
                .map(this::toResponse)
                .toList();
    }

    @Override
    public CategoryResponse getDetail(Long id) {
        Category category = findActiveById(id);
        return toResponse(category);
    }

    @Override
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = findActiveById(id);
        category.setKeyC(request.getKey());
        category.setNameVn(request.getNameVn());
        category.setNameEnglish(request.getNameEnglish());
        return toResponse(categoryRepository.save(category));
    }

    @Override
    public void delete(Long id) {
        Category category = findActiveById(id);
        category.setDeleteFlag(true);
        categoryRepository.save(category);
    }

    @Override
    public List<ProductSummaryResponse> getProductsByCategory(Long categoryId) {
        // Verify category exists
        findActiveById(categoryId);
        return productService.getProductsByCategory(categoryId);
    }

    private Category findActiveById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        if (Boolean.TRUE.equals(category.getDeleteFlag())) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        return category;
    }

    private long nextId() {
        return categoryRepository.findTopByOrderByIdDesc()
                .map(category -> category.getId() + 1)
                .orElse(1L);
    }

    private CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .key(category.getKeyC())
                .nameVn(category.getNameVn())
                .nameEnglish(category.getNameEnglish())
                .build();
    }
}
