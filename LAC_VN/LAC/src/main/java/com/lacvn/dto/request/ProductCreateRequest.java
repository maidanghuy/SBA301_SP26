package com.lacvn.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

import static lombok.AccessLevel.PRIVATE;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = PRIVATE)
public class ProductCreateRequest {

    @NotBlank(message = "Product name is required")
    @Size(max = 255, message = "Product name cannot exceed 255 characters")
    String name;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    BigDecimal price;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    String description;

    @jakarta.validation.constraints.Pattern(
            regexp = "^(http|https)://.*$",
            message = "Image must be a valid URL"
    )
    String image;

    @NotNull(message = "Stock is required")
    @jakarta.validation.constraints.Min(value = 0, message = "Stock must be >= 0")
    Integer stock;

    @Builder.Default
    Boolean isNew = false;

    @Builder.Default
    Boolean isFeatured = false;

    @NotNull(message = "Brand is required")
    Long brandId;

    @NotNull(message = "Category is required")
    Long categoryId;

    // List specs as key-value pairs.
    // `key` refers to ProductSpecificationDefinition.spec_key.
    List<@jakarta.validation.Valid ProductSpecificationKVRequest> specifications;
}
