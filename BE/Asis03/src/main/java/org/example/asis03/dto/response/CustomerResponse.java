package org.example.asis03.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerResponse {
    private Long id;
    private String email;
    private String role;
    private String fullName;
    private String phone;
}