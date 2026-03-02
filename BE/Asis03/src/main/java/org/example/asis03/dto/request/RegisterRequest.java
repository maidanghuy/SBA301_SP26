package org.example.asis03.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    @Size(min = 2, max = 100)
    private String fullName;

    @Email
    @NotBlank
    @Size(max = 120)
    private String email;

    @NotBlank
    @Size(min = 6, max = 72)
    private String password;

    @Size(max = 30)
    private String phone;
}