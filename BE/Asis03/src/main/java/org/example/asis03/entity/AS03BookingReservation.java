package org.example.asis03.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "as03_booking_reservation")
public class AS03BookingReservation extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BookingReservationID")
    private Long bookingReservationId;

    @Column(name = "BookingDate", nullable = false)
    private LocalDateTime bookingDate;

    @Column(name = "TotalPrice", nullable = false, precision = 18, scale = 2)
    private BigDecimal totalPrice;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "CustomerID",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_bookingreservation_customer")
    )
    private AS03Customer customer;

    @Enumerated(EnumType.STRING)
    @Column(name = "BookingStatus", nullable = false, length = 30)
    private BookingStatus bookingStatus;

    @OneToMany(
            mappedBy = "bookingReservation",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<AS03BookingDetail> bookingDetails = new ArrayList<>();
}