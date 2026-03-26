package com.lacvn.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePaymentLinkRequest {
    private String productName;
    private String description;
    private int price;
    private String returnUrl;
    private String cancelUrl;
}
