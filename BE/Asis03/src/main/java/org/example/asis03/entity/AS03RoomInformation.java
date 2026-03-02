package org.example.asis03.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "as03_room_information",
        uniqueConstraints = @UniqueConstraint(name = "uk_room_number", columnNames = "RoomNumber")
)
public class AS03RoomInformation extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoomID")
    private Long roomId;

    @Column(name = "RoomNumber", nullable = false, length = 30)
    private String roomNumber;

    @Column(name = "RoomDetailDescription", length = 1000)
    private String roomDetailDescription;

    @Column(name = "RoomMaxCapacity", nullable = false)
    private Integer roomMaxCapacity;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "RoomTypeID", nullable = false,
            foreignKey = @ForeignKey(name = "fk_room_roomtype"))
    private AS03RoomType roomType;

    @Column(name = "RoomStatus", nullable = false)
    private Boolean roomStatus;

    @Column(name = "RoomPricePerDay", nullable = false, precision = 18, scale = 2)
    private BigDecimal roomPricePerDay;
}