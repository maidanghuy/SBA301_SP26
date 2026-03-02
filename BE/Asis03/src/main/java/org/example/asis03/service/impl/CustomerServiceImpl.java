package org.example.asis03.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.asis03.dto.request.CustomerUpdateRequest;
import org.example.asis03.dto.response.CustomerResponse;
import org.example.asis03.entity.AS03Customer;
import org.example.asis03.exception.ResourceNotFoundException;
import org.example.asis03.repository.AS03CustomerRepository;
import org.example.asis03.service.CustomerService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final AS03CustomerRepository customerRepo;

    private AS03Customer currentCustomer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return customerRepo.findByEmailAndDeleteFlagFalse(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
    }

    private CustomerResponse toUserRes(AS03Customer c) {
        return CustomerResponse.builder()
                .id(c.getId())
                .email(c.getEmail())
                .role(c.getRole() != null ? c.getRole().name() : null)
                .fullName(c.getFullName())
                .phone(c.getPhone())
                .build();
    }

    @Override
    public CustomerResponse me() {
        return toUserRes(currentCustomer());
    }

    @Override
    public CustomerResponse updateMe(CustomerUpdateRequest req) {
        AS03Customer c = currentCustomer();

        // update fields allowed
        if (req.getFullName() != null) c.setFullName(req.getFullName());
        if (req.getPhone() != null) c.setPhone(req.getPhone());

        return toUserRes(customerRepo.save(c));
    }
}