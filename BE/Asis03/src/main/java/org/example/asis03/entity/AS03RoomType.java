package org.example.asis03.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "as03_room_types")
public class AS03RoomType extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoomTypeID")
    private Long roomTypeId;

    @Column(name = "RoomTypeName", nullable = false, length = 100)
    private String roomTypeName;

    @Column(name = "TypeDescription", length = 500)
    private String typeDescription;

    @Column(name = "TypeNote", length = 255)
    private String typeNote;

    @OneToMany(mappedBy = "roomType", cascade = CascadeType.ALL, orphanRemoval = false)
    @Builder.Default
    private List<AS03RoomInformation> rooms = new ArrayList<>();
}