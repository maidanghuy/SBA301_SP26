package org.example.asis03.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CustomerAdminUpdateRequest {

    @Size(max = 255)
    private String fullName;

    @Size(max = 30)
    private String phone;

    private String role;

    private Boolean active;
}