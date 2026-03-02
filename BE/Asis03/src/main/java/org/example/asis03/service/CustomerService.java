package org.example.asis03.service;

import org.example.asis03.dto.request.CustomerUpdateRequest;
import org.example.asis03.dto.response.CustomerResponse;

public interface CustomerService {
    CustomerResponse me();
    CustomerResponse updateMe(CustomerUpdateRequest req);
}