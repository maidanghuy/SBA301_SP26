package com.de180293.pe_sba301_sp25_be_de180293.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
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
@Table(name = "pr03_account_members", uniqueConstraints = {
        @UniqueConstraint(name = "uk_account_member_email", columnNames = "email_address")
})
public class PR03AccountMember extends BaseEntity {

    @Id
    @Column(name = "member_id", length = 20)
    String memberId;

    @Column(name = "member_password", nullable = false, length = 80)
    String memberPassword;

    @Column(name = "email_address", nullable = false, length = 100)
    String emailAddress;

    @Column(name = "member_role", nullable = false)
    Role memberRole;
}