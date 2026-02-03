package org.example.assignment.service.impl;

import org.example.assignment.dto.request.ASystemAccountCreateRequest;
import org.example.assignment.dto.request.ASystemAccountUpdateRequest;
import org.example.assignment.dto.response.ASystemAccountResponse;

import java.util.List;

public interface ASystemAccountService {

    List<ASystemAccountResponse> getAll(Boolean includeDeleted, String q);

    ASystemAccountResponse getById(Long id);

    ASystemAccountResponse create(ASystemAccountCreateRequest request);

    ASystemAccountResponse update(Long id, ASystemAccountUpdateRequest request);

    ASystemAccountResponse updateDeleteFlag(Long id, Boolean deleteFlag);
}
