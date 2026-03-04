package org.example.assignment.service.impl;

import org.example.assignment.dto.response.TagResponse;

import java.util.List;

public interface ATagService {
    List<TagResponse> getAll();
}