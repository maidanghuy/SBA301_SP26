package org.example.assignment.service.impl;

import org.example.assignment.dto.request.ACategoryCreateRequest;
import org.example.assignment.dto.request.ACategoryUpdateRequest;
import org.example.assignment.dto.response.ACategoryResponse;

import java.util.List;

public interface ACategoryService {

    List<ACategoryResponse> getAll();

    ACategoryResponse getById(Long id);

    ACategoryResponse create(ACategoryCreateRequest request);

    ACategoryResponse update(Long id, ACategoryUpdateRequest request);

    ACategoryResponse updateDeleteFlag(Long id, Boolean deleteFlag);

}