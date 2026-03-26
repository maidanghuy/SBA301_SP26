package com.lacvn.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ShippingMethodResponse {
    private Long id;
    private String name;
    private BigDecimal price;
    private String description;
}
