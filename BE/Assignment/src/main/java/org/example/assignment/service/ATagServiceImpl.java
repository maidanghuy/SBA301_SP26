package org.example.assignment.service;

import lombok.RequiredArgsConstructor;
import org.example.assignment.dto.response.TagResponse;
import org.example.assignment.entity.ATag;
import org.example.assignment.repository.IATagRepository;
import org.example.assignment.service.impl.ATagService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ATagServiceImpl implements ATagService {

    private final IATagRepository tagRepository;

    @Override
    public List<TagResponse> getAll() {
        return tagRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private TagResponse toResponse(ATag tag) {
        return TagResponse.builder()
                .tagId(tag.getTagId())
                .tagName(tag.getTagName())
                .note(tag.getNote())
                .build();
    }
}
