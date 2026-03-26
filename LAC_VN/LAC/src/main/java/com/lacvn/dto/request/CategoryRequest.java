package com.lacvn.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import static lombok.AccessLevel.PRIVATE;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = PRIVATE)
public class CategoryRequest {
    @NotBlank(message = "Category name is required")
    @Size(max = 20, message = "Category name cannot exceed 20 characters")
    String name;

    @NotBlank(message = "Category key is required")
    String key;

    String nameVn;

    String nameEnglish;
}
