package com.lacvn.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import static lombok.AccessLevel.PRIVATE;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = PRIVATE)
public class LoginRequest {

    @NotBlank
    @Email(message = "Invalid email format")
    String email;

    @Pattern(regexp = "^[0-9]{9,11}$", message = "Phone must be 9-11 digits")
    String phone;

    @NotBlank
    String password;
}