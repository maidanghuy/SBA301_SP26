package org.example.orchid.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "category", schema = "sba301_sp26")
public class Category extends BaseEntity{

    /**
     * Category ID (e.g. c1, c2)
     */
    @Id
    @Column(name = "category_id", length = 10)
    String categoryId;

    /**
     * Category name
     */
    @Column(name = "name", length = 100, nullable = false)
    String name;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    @JsonIgnore
    List<Orchid> orchids;
}
