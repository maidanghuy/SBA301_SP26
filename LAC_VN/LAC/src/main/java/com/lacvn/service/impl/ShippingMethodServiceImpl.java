package com.lacvn.service.impl;

import com.lacvn.dto.request.ShippingMethodRequest;
import com.lacvn.dto.response.ShippingMethodResponse;
import com.lacvn.entity.ShippingMethod;
import com.lacvn.exception.ResourceNotFoundException;
import com.lacvn.repository.ShippingMethodRepository;
import com.lacvn.service.ShippingMethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShippingMethodServiceImpl implements ShippingMethodService {

    private final ShippingMethodRepository shippingMethodRepository;

    @Override
    public List<ShippingMethodResponse> getAllShippingMethods() {
        return shippingMethodRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public ShippingMethodResponse getShippingMethodById(Long id) {
        ShippingMethod shippingMethod = shippingMethodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipping method not found with id: " + id));
        return toResponse(shippingMethod);
    }

    @Override
    public ShippingMethodResponse createShippingMethod(ShippingMethodRequest request) {
        ShippingMethod entity = ShippingMethod.builder()
                .name(request.getName())
                .price(request.getPrice())
                .description(request.getDescription())
                .build();

        ShippingMethod saved = shippingMethodRepository.save(entity);
        return toResponse(saved);
    }

    @Override
    public ShippingMethodResponse updateShippingMethod(Long id, ShippingMethodRequest request) {
        ShippingMethod existing = shippingMethodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipping method not found with id: " + id));

        if (request.getName() != null) existing.setName(request.getName());
        if (request.getPrice() != null) existing.setPrice(request.getPrice());
        if (request.getDescription() != null) existing.setDescription(request.getDescription());

        ShippingMethod saved = shippingMethodRepository.save(existing);
        return toResponse(saved);
    }

    @Override
    public void deleteShippingMethod(Long id) {
        ShippingMethod existing = shippingMethodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipping method not found with id: " + id));
        shippingMethodRepository.delete(existing);
    }

    private ShippingMethodResponse toResponse(ShippingMethod shippingMethod) {
        return ShippingMethodResponse.builder()
                .id(shippingMethod.getId())
                .name(shippingMethod.getName())
                .price(shippingMethod.getPrice())
                .description(shippingMethod.getDescription())
                .build();
    }
}
