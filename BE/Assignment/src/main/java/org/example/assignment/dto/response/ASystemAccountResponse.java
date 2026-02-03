package org.example.assignment.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ASystemAccountResponse {
    private Long accountId;
    private String accountName;
    private String accountEmail;
    private String accountRole;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
    private Boolean deleteFlag;
}

