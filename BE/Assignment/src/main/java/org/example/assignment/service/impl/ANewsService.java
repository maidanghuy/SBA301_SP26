package org.example.assignment.service.impl;

import org.example.assignment.dto.request.ANewsCreateRequest;
import org.example.assignment.dto.request.ANewsUpdateRequest;
import org.example.assignment.dto.response.ANewsResponse;

import java.util.List;

public interface ANewsService {

    List<ANewsResponse> getAll(Boolean includeDeleted, String q, String status);

    ANewsResponse getById(Long id);

    ANewsResponse create(ANewsCreateRequest request);

    ANewsResponse update(Long id, ANewsUpdateRequest request);

    ANewsResponse updateDeleteFlag(Long id, Boolean deleteFlag);
}