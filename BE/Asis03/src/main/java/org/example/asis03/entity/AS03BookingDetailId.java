package org.example.asis03.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class AS03BookingDetailId implements Serializable {

    @Column(name = "booking_reservation_id", nullable = false)
    private Long bookingReservationId;

    @Column(name = "room_id", nullable = false)
    private Long roomId;
}