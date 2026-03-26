package com.lacvn.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.ColumnDefault;

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
@Table(name = "products", schema = "TechZone")
public class Product extends BaseEntity{
    @Id
    @Size(max = 36)
    @Column(name = "id", nullable = false, length = 36)
    private String id;

    @Size(max = 255)
    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @NotNull
    @Column(name = "price", nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Size(max = 256)
    @Column(name = "description", length = 256)
    private String description;

    @Size(max = 255)
    @Column(name = "image")
    private String image;

    @ColumnDefault("0")
    @Column(name = "stock")
    private Integer stock;

    @ColumnDefault("0")
    @Column(name = "is_new")
    private Boolean isNew;

    @ColumnDefault("0")
    @Column(name = "is_featured")
    private Boolean isFeatured;

    @ColumnDefault("0.0")
    @Column(name = "rating", precision = 2, scale = 1)
    private BigDecimal rating;

    @ColumnDefault("0")
    @Column(name = "reviews_count")
    private Integer reviewsCount;

}