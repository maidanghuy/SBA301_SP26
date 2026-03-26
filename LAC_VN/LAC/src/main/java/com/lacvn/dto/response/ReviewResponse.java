package com.lacvn.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {
    private Long id;
    private Integer rating;
    private String comment;
    private String userId;
    private String userFullName;
    private LocalDateTime createdAt;
}
