package org.example.assignment.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TagResponse {
    private Long tagId;
    private String tagName;
    private String note;
}
