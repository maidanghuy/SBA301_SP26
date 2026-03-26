package com.lacvn.dto.payment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutItemDTO {
    
    @JsonProperty("product_id")
    private String productId;

    @JsonProperty("quantity")
    private Integer quantity;
}
