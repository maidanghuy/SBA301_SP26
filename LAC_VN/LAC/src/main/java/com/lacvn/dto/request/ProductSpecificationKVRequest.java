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
public class ProductSpecificationKVRequest {
    @NotBlank(message = "Specification key is required")
    @Size(max = 100, message = "Specification key cannot exceed 100 characters")
    String key;

    @NotBlank(message = "Specification value is required")
    @Size(max = 255, message = "Specification value cannot exceed 255 characters")
    String value;
}

