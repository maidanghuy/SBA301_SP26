package org.example.asis03.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerAdminResponse {
    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String role;
    private Boolean active;
}