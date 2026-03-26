package com.lacvn.dto.request;

import lombok.Data;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

@Data
public class ShippingMethodRequest {
    @NotNull
    @Size(max = 150)
    private String name;

    @NotNull
    private BigDecimal price;

    @Size(max = 255)
    private String description;
}
