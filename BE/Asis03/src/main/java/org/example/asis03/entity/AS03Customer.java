package org.example.asis03.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

import static lombok.AccessLevel.PRIVATE;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@FieldDefaults(level = PRIVATE)
@Table(name = "as03_customers", uniqueConstraints = {
        @UniqueConstraint(name = "uk_customer_email", columnNames = "email")
})
public class AS03Customer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false)
    String fullName;

    @Column(nullable = false, length = 120)
    String email;

    @Column(nullable = false)
    String passwordHash;

    @Column(length = 30)
    String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    Role role;

    @Column(nullable = false)
    Boolean active;
}