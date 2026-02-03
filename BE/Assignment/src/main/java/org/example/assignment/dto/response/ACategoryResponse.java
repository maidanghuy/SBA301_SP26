package org.example.assignment.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import static lombok.AccessLevel.PRIVATE;

@Data
@FieldDefaults(level = PRIVATE)
@Builder
public class ACategoryResponse {

    Long categoryId;

    String categoryName;

    String categoryDescription;

    Long parentCategoryId;

    Boolean isActive;

    Boolean deleteFlag;

}
