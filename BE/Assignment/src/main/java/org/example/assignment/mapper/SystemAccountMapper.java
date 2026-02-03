package org.example.assignment.mapper;

import org.example.assignment.dto.response.ASystemAccountResponse;
import org.example.assignment.entity.ASystemAccount;

public class SystemAccountMapper {

    public static ASystemAccountResponse toResponse(ASystemAccount a) {
        return ASystemAccountResponse.builder()
                .accountId(a.getAccountId())
                .accountName(a.getAccountName())
                .accountEmail(a.getAccountEmail())
                .accountRole(a.getAccountRole())
                .createdAt(a.getCreatedAt())
                .updatedAt(a.getUpdatedAt())
                .createdBy(a.getCreatedBy())
                .updatedBy(a.getUpdatedBy())
                .deleteFlag(a.getDeleteFlag())
                .build();
    }
}
