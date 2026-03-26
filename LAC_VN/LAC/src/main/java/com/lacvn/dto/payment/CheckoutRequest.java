package com.lacvn.dto.payment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {

    @JsonProperty("order_items")
    private List<CheckoutItemDTO> orderItems;

    @JsonProperty("shipping_info")
    private ShippingInfoDTO shippingInfo;

    @JsonProperty("return_url")
    private String returnUrl;

    @JsonProperty("cancel_url")
    private String cancelUrl;

    @JsonProperty("note")
    private String note;

    @JsonProperty("shipping_method_id")
    private Long shippingMethodId;
}
