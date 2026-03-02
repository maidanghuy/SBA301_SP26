package org.example.asis03.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "as03_booking_detail")
public class AS03BookingDetail extends BaseEntity {

    @EmbeddedId
    private AS03BookingDetailId id;

    @MapsId("bookingReservationId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "booking_reservation_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_bookingdetail_bookingreservation")
    )
    private AS03BookingReservation bookingReservation;

    @MapsId("roomId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "room_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_bookingdetail_room")
    )
    private AS03RoomInformation room;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "actual_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal actualPrice;
}