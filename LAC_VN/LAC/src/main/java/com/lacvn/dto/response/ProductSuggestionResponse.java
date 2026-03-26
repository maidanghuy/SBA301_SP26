package com.lacvn.dto.response;

import lombok.Builder;
import lombok.Data;

/**
 * Response DTO for product search suggestions
 */
@Data
@Builder
public class ProductSuggestionResponse {
    private String id;
    private String name;
    private String image;
}
