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
public class ProductSpecificationDefinitionRequest {
    @NotBlank(message = "specKey is required")
    @Size(max = 100, message = "specKey cannot exceed 100 characters")
    String specKey;

    @NotBlank(message = "nameVi is required")
    @Size(max = 150, message = "nameVi cannot exceed 150 characters")
    String nameVi;
}

