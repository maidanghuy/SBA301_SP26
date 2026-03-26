package com.lacvn.dto.response;

import com.lacvn.dto.payment.ShippingInfoDTO;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
public class OrderDetailResponseDTO {
    private String id;
    private BigDecimal total;
    private String status;
    private String paymentStatus;
    private String paymentMethod;
    private Instant createdAt;
    private List<OrderItemResponseDTO> items;
    private ShippingInfoDTO shippingInfo;
    private String shippingMethodName;
    private BigDecimal shippingFee;
    private String note;
    private String checkoutUrl;
    private String qrCode;
}
