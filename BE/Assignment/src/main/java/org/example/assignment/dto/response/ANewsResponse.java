package org.example.assignment.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ANewsResponse {

    private Long newsArticleId;
    private String newsTitle;
    private String headline;
    private String newsContent;
    private String newsSource;
    private String newsStatus;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
    private Boolean deleteFlag;

    // category
    private Long categoryId;
    private String categoryName;

    // tags
    private List<TagResponse> tags;

    @Data
    @Builder
    public static class TagResponse {
        private Long tagId;
        private String tagName;
    }
}
