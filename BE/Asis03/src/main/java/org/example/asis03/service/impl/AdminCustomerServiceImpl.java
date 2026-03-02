package org.example.asis03.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.asis03.dto.request.CustomerAdminUpdateRequest;
import org.example.asis03.dto.response.CustomerAdminResponse;
import org.example.asis03.entity.AS03Customer;
import org.example.asis03.entity.Role;
import org.example.asis03.exception.ResourceNotFoundException;
import org.example.asis03.repository.AS03CustomerRepository;
import org.example.asis03.service.AdminCustomerService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminCustomerServiceImpl implements AdminCustomerService {

    private final AS03CustomerRepository customerRepo;

    private CustomerAdminResponse toRes(AS03Customer c) {
        return CustomerAdminResponse.builder()
                .id(c.getId())
                .email(c.getEmail())
                .fullName(c.getFullName())
                .phone(c.getPhone())
                .role(c.getRole() != null ? c.getRole().name() : null)
                .active(c.getActive())
                .build();
    }

    @Override
    public List<CustomerAdminResponse> list(String q) {
        var pageable = PageRequest.of(0, 200, Sort.by(Sort.Direction.DESC, "id"));

        var page = (q == null || q.isBlank())
                ? customerRepo.findByDeleteFlagFalse(pageable)
                : customerRepo.findByDeleteFlagFalseAndEmailContainingIgnoreCaseOrDeleteFlagFalseAndFullNameContainingIgnoreCase(
                q.trim(), q.trim(), pageable
        );

        return page.getContent().stream().map(this::toRes).toList();
    }

    @Override
    @Transactional
    public CustomerAdminResponse update(Long id, CustomerAdminUpdateRequest req) {
        AS03Customer c = customerRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        if (Boolean.TRUE.equals(c.getDeleteFlag())) {
            throw new IllegalArgumentException("Customer was deleted");
        }

        if (req.getFullName() != null) c.setFullName(req.getFullName());
        if (req.getPhone() != null) c.setPhone(req.getPhone());
        if (req.getActive() != null) c.setActive(req.getActive());

        if (req.getRole() != null && !req.getRole().isBlank()) {
            try {
                c.setRole(Role.valueOf(req.getRole().trim().toUpperCase()));
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid role: " + req.getRole());
            }
        }

        return toRes(customerRepo.save(c));
    }

    @Override
    @Transactional
    public void remove(Long id) {
        AS03Customer c = customerRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        c.setDeleteFlag(true);
        customerRepo.save(c);
    }
}