package org.example.assignment.mapper;

import org.example.assignment.dto.response.ACategoryResponse;
import org.example.assignment.entity.ACategory;

public class ACategoryMapper {

    public static ACategoryResponse toResponse(ACategory entity) {
        return ACategoryResponse.builder()
                .categoryId(entity.getCategoryId())
                .categoryName(entity.getCategoryName())
                .categoryDescription(entity.getCategoryDescription())
                .parentCategoryId(
                        entity.getParentCategory() != null
                                ? entity.getParentCategory().getCategoryId()
                                : null
                )
                .isActive(entity.getIsActive())
                .deleteFlag(entity.getDeleteFlag())
                .build();
    }
}
