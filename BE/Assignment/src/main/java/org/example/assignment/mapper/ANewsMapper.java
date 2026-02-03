package org.example.assignment.mapper;

import org.example.assignment.dto.response.ANewsResponse;
import org.example.assignment.entity.ANewsArticle;

import java.util.stream.Collectors;

public class ANewsMapper {

    public static ANewsResponse toResponse(ANewsArticle n) {
        return ANewsResponse.builder()
                .newsArticleId(n.getNewsArticleId())
                .newsTitle(n.getNewsTitle())
                .headline(n.getHeadline())
                .newsContent(n.getNewsContent())
                .newsSource(n.getNewsSource())
                .newsStatus(n.getNewsStatus())
                .createdAt(n.getCreatedAt())
                .updatedAt(n.getUpdatedAt())
                .createdBy(n.getCreatedBy())
                .updatedBy(n.getUpdatedBy())
                .deleteFlag(n.getDeleteFlag())
                .categoryId(
                        n.getCategory() != null
                                ? n.getCategory().getCategoryId()
                                : null
                )
                .categoryName(
                        n.getCategory() != null
                                ? n.getCategory().getCategoryName()
                                : null
                )
                .tags(
                        n.getNewsTags() == null ? null :
                                n.getNewsTags().stream()
                                        .map(nt -> ANewsResponse.TagResponse.builder()
                                                .tagId(nt.getTag().getTagId())
                                                .tagName(nt.getTag().getTagName())
                                                .build()
                                        )
                                        .collect(Collectors.toList())
                )
                .build();
    }
}
