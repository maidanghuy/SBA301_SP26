package com.lacvn.service.impl;

import com.lacvn.dto.request.ProductSpecificationDefinitionRequest;
import com.lacvn.dto.response.ProductSpecificationDefinitionResponse;
import com.lacvn.entity.ProductSpecificationDefinition;
import com.lacvn.exception.ResourceNotFoundException;
import com.lacvn.repository.ProductSpecificationDefinitionRepository;
import com.lacvn.service.ProductSpecificationDefinitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductSpecificationDefinitionServiceImpl implements ProductSpecificationDefinitionService {

    private final ProductSpecificationDefinitionRepository repository;

    @Override
    public ProductSpecificationDefinitionResponse create(ProductSpecificationDefinitionRequest request) {
        String key = request.getSpecKey().trim();

        if (repository.existsByKey(key)) {
            throw new IllegalArgumentException("Specification key already exists: " + key);
        }

        ProductSpecificationDefinition definition = ProductSpecificationDefinition.builder()
                .key(key)
                .nameVi(request.getNameVi())
                .build();

        return toResponse(repository.save(definition));
    }

    @Override
    public List<ProductSpecificationDefinitionResponse> getAll() {
        return repository.findAll().stream()
                .filter(def -> !Boolean.TRUE.equals(def.getDeleteFlag()))
                .map(this::toResponse)
                .toList();
    }

    @Override
    public ProductSpecificationDefinitionResponse getDetail(Long id) {
        ProductSpecificationDefinition definition = findActiveById(id);
        return toResponse(definition);
    }

    @Override
    public ProductSpecificationDefinitionResponse update(Long id, ProductSpecificationDefinitionRequest request) {
        ProductSpecificationDefinition definition = findActiveById(id);

        String newKey = request.getSpecKey().trim();
        if (!newKey.equals(definition.getKey()) && repository.existsByKey(newKey)) {
            throw new IllegalArgumentException("Specification key already exists: " + newKey);
        }

        definition.setKey(newKey);
        definition.setNameVi(request.getNameVi());

        return toResponse(repository.save(definition));
    }

    @Override
    public void delete(Long id) {
        ProductSpecificationDefinition definition = findActiveById(id);
        definition.setDeleteFlag(true);
        repository.save(definition);
    }

    private ProductSpecificationDefinition findActiveById(Long id) {
        ProductSpecificationDefinition def = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Specification definition not found with id: " + id));
        if (Boolean.TRUE.equals(def.getDeleteFlag())) {
            throw new ResourceNotFoundException("Specification definition not found with id: " + id);
        }
        return def;
    }

    private ProductSpecificationDefinitionResponse toResponse(ProductSpecificationDefinition def) {
        return ProductSpecificationDefinitionResponse.builder()
                .id(def.getId())
                .specKey(def.getKey())
                .nameVi(def.getNameVi())
                .build();
    }
}

