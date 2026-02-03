package org.example.assignment.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ASystemAccountCreateRequest {

    @NotBlank(message = "Account name is required")
    @Size(max = 100, message = "Account name max 100 chars")
    private String accountName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email is invalid")
    @Size(max = 150, message = "Email max 150 chars")
    private String accountEmail;

    @NotBlank(message = "Role is required")
    @Size(max = 50, message = "Role max 50 chars")
    private String accountRole; // ADMIN / EDITOR / USER ...

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 255, message = "Password must be 6-255 chars")
    private String accountPassword;

    // BaseEntity
    private String createdBy;
}

