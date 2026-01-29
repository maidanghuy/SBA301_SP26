package org.example.orchid.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Entity
@Table(name = "orchid", schema = "sba301_sp26")
public class Orchid extends BaseEntity {

    /**
     * Primary key of orchid table
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    Long id;

    /**
     * Name of the orchid (display name)
     */
    @Column(name = "orchid_name", length = 100, nullable = false)
    String orchidName;

    /**
     * Detailed description of the orchid
     */
    @Column(name = "description", columnDefinition = "TEXT")
    String description;

    /**
     * Flag to indicate whether orchid is special
     */
    @Column(name = "is_special", nullable = false)
    Boolean isSpecial = false;

    /**
     * Image URL or image path of orchid
     */
    @Column(name = "image", length = 255)
    String image;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    Category category;
}


