package com.lacvn.service.impl;

import com.lacvn.dto.request.BrandRequest;
import com.lacvn.dto.response.BrandResponse;
import com.lacvn.entity.Brand;
import com.lacvn.exception.ResourceNotFoundException;
import com.lacvn.repository.BrandRepository;
import com.lacvn.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;

    @Override
    public BrandResponse create(BrandRequest request) {
        Brand brand = Brand.builder()
                .id(nextId())
                .name(request.getName())
                .build();
        return toResponse(brandRepository.save(brand));
    }

    @Override
    public List<BrandResponse> getAll() {
        return brandRepository.findAll().stream()
                .filter(brand -> !Boolean.TRUE.equals(brand.getDeleteFlag()))
                .map(this::toResponse)
                .toList();
    }

    @Override
    public BrandResponse update(Long id, BrandRequest request) {
        Brand brand = findActiveById(id);
        brand.setName(request.getName());
        return toResponse(brandRepository.save(brand));
    }

    @Override
    public void delete(Long id) {
        Brand brand = findActiveById(id);
        brand.setDeleteFlag(true);
        brandRepository.save(brand);
    }

    private Brand findActiveById(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + id));
        if (Boolean.TRUE.equals(brand.getDeleteFlag())) {
            throw new ResourceNotFoundException("Brand not found with id: " + id);
        }
        return brand;
    }

    private long nextId() {
        return brandRepository.findTopByOrderByIdDesc()
                .map(brand -> brand.getId() + 1)
                .orElse(1L);
    }

    private BrandResponse toResponse(Brand brand) {
        return BrandResponse.builder()
                .id(brand.getId())
                .name(brand.getName())
                .build();
    }
}
