package com.lacvn.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private String email;
    private String role;  // 'user' or 'admin'
}