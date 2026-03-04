package com.de180293.pe_sba301_sp25_be_de180293.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import static lombok.AccessLevel.PRIVATE;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@FieldDefaults(level = PRIVATE)
@Table(name = "pr03_cars")
public class PR03Cars extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "car_id")
    Integer carId;

    @Column(name = "car_name", nullable = false, length = 40)
    String carName;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "country_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_cars_country"))
    PR03Country country;

    @Column(name = "units_in_stock", nullable = false)
    Short unitsInStock;

    @Column(name = "unit_price", nullable = false)
    Integer unitPrice;
}