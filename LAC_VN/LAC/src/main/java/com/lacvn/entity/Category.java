package com.lacvn.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
@Table(name = "categories", schema = "TechZone")
public class Category extends BaseEntity {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;


    @Size(max = 20)
    @NotNull
    @Column(name = "name_vn")
    private String nameVn;

    @Size(max = 20)
    @NotNull
    @Column(name = "name_english")
    private String nameEnglish;

    @Column(name = "keyc", unique = true)
    private String keyC;


}