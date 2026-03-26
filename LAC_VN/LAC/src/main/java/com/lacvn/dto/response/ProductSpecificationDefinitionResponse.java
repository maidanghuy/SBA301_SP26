package com.lacvn.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductSpecificationDefinitionResponse {
    private Long id;
    private String specKey;
    private String nameVi;
}

