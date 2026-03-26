package com.lacvn.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
public class OrderResponseDTO {
    private String id;
    private BigDecimal total;
    private String status;
    private String paymentStatus;
    private String paymentMethod;
    private Instant createdAt;
}
