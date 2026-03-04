package com.de180293.pe_sba301_sp25_be_de180293.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {
    ADMIN(1),
    STAFF(2),
    MEMBER(3);

    private final int value;

    public static Role fromValue(Integer value) {
        if (value == null) return null;
        for (Role r : values()) {
            if (r.value == value) return r;
        }
        throw new IllegalArgumentException("Invalid MemberRole value: " + value);
    }
}