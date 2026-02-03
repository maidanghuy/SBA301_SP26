package org.example.assignment.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.assignment.dto.request.ACategoryCreateRequest;
import org.example.assignment.dto.request.ACategoryUpdateRequest;
import org.example.assignment.dto.response.ACategoryResponse;
import org.example.assignment.entity.ACategory;
import org.example.assignment.mapper.ACategoryMapper;
import org.example.assignment.repository.IACategoryRepository;
import org.example.assignment.service.impl.ACategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ACategoryServiceImpl implements ACategoryService {

    private final IACategoryRepository categoryRepository;

    @Override
    public List<ACategoryResponse> getAll() {
        return categoryRepository.findAll()
                .stream()
                .map(ACategoryMapper::toResponse)
                .toList();
    }

    @Override
    public ACategoryResponse getById(Long id) {
        ACategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found: " + id));

        return ACategoryMapper.toResponse(category);
    }

    @Override
    public ACategoryResponse create(ACategoryCreateRequest request) {
        ACategory category = new ACategory();

        category.setCategoryName(request.getCategoryName());
        category.setCategoryDescription(request.getCategoryDescription());
        category.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        if (request.getParentCategoryId() != null) {
            ACategory parent = categoryRepository.findById(request.getParentCategoryId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            category.setParentCategory(parent);
        }

        return ACategoryMapper.toResponse(categoryRepository.save(category));
    }

    @Override
    public ACategoryResponse update(Long id, ACategoryUpdateRequest request) {
        ACategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found: " + id));

        category.setCategoryName(request.getCategoryName());
        category.setCategoryDescription(request.getCategoryDescription());
        category.setIsActive(request.getIsActive());

        if (request.getParentCategoryId() != null) {
            ACategory parent = categoryRepository.findById(request.getParentCategoryId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            category.setParentCategory(parent);
        } else {
            category.setParentCategory(null);
        }

        return ACategoryMapper.toResponse(categoryRepository.save(category));
    }

    @Override
    public ACategoryResponse updateDeleteFlag(Long id, Boolean deleteFlag) {
        ACategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found: " + id));

        category.setDeleteFlag(Boolean.TRUE.equals(deleteFlag));
        return ACategoryMapper.toResponse(categoryRepository.save(category));
    }
}
