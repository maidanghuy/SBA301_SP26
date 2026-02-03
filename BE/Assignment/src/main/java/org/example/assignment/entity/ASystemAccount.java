package org.example.assignment.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import static lombok.AccessLevel.PRIVATE;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = PRIVATE)
@Entity
@Table(name = "a_system_account", schema = "sba301_sp26")
public class ASystemAccount extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    Long accountId;

    @Column(name = "account_name", length = 100, nullable = false)
    String accountName;

    @Column(name = "account_email", length = 150, nullable = false, unique = true)
    String accountEmail;

    @Column(name = "account_role", length = 50, nullable = false)
    String accountRole;

    @Column(name = "account_password", length = 255, nullable = false)
    String accountPassword;
}
