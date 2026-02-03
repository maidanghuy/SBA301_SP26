package org.example.assignment.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ANewsCreateRequest {

    @NotBlank(message = "News title is required")
    private String newsTitle;

    private String headline;

    @NotBlank(message = "News content is required")
    private String newsContent;

    private String newsSource;

    @NotNull(message = "Category is required")
    private Long categoryId;

    @NotBlank(message = "News status is required")
    private String newsStatus;

    // 👇 dùng BaseEntity
    private String createdBy;

    // many-to-many
    private List<Long> tagIds;
}