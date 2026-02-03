package org.example.assignment.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ASystemAccountUpdateRequest {

    @NotBlank(message = "Account name is required")
    @Size(max = 100, message = "Account name max 100 chars")
    private String accountName;

    @NotBlank(message = "Role is required")
    @Size(max = 50, message = "Role max 50 chars")
    private String accountRole;

    @Size(min = 6, max = 255, message = "Password must be 6-255 chars")
    private String accountPassword;

    private String updatedBy;
}
