package com.lacvn.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class CartCreateRequest {
    @NotBlank(message = "User id is required")
    String userId;

    @Size(max = 20, message = "Status cannot exceed 20 characters")
    String status;

    @Size(max = 255, message = "Note cannot exceed 255 characters")
    String note;
}
