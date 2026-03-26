package com.lacvn.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;
import java.util.List;

import static lombok.AccessLevel.PRIVATE;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = PRIVATE)
public class ProductUpdateRequest {

    @Size(max = 255, message = "Product name cannot exceed 255 characters")
    String name;

    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    BigDecimal price;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    String description;

    @jakarta.validation.constraints.Pattern(
            regexp = "^(http|https)://.*$",
            message = "Image must be a valid URL"
    )
    String image;

    @jakarta.validation.constraints.Min(value = 0, message = "Stock must be >= 0")
    Integer stock;

    Boolean isNew;
    Boolean isFeatured;

    Long brandId;
    Long categoryId;

    // List specs as key-value pairs.
    // `key` refers to ProductSpecificationDefinition.spec_key.
    List<@jakarta.validation.Valid ProductSpecificationKVRequest> specifications;
}
