package org.example.asis03.service;

import org.example.asis03.dto.request.CustomerAdminUpdateRequest;
import org.example.asis03.dto.response.CustomerAdminResponse;

import java.util.List;

public interface AdminCustomerService {
    List<CustomerAdminResponse> list(String q);
    CustomerAdminResponse update(Long id, CustomerAdminUpdateRequest req);
    void remove(Long id);
}