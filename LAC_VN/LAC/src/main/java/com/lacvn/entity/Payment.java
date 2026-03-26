package com.lacvn.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.Instant;

import static lombok.AccessLevel.PRIVATE;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@FieldDefaults(level = PRIVATE)
@Table(name = "payments", schema = "TechZone")
public class Payment extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @Size(max = 20)
    @Column(name = "method", length = 20)
    private String method;

    @Size(max = 150)
    @Column(name = "transaction_id", length = 150)
    private String transactionId;

    @Size(max = 150)
    @Column(name = "bank_name", length = 150)
    private String bankName;

    @Size(max = 255)
    @Column(name = "transfer_content")
    private String transferContent;

    @Column(name = "amount", precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "paid_at")
    private Instant paidAt;

    @Size(max = 20)
    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "checkout_url", length = 1000)
    private String checkoutUrl;

    @Column(name = "qr_code", length = 1000)
    private String qrCode;
}