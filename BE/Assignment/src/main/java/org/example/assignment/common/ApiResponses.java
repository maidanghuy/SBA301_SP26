package org.example.assignment.common;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;

import java.time.Instant;

public class ApiResponses {

    public static <T> ApiResponse<T> success(HttpStatus status, String message, T data, HttpServletRequest req) {
        return ApiResponse.<T>builder()
                .timestamp(Instant.now())
                .status(status.value())
                .message(message)
                .data(data)
                .path(req.getRequestURI())
                .build();
    }

    public static ApiResponse<Object> error(HttpStatus status, String message, Object error, HttpServletRequest req) {
        return ApiResponse.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .message(message)
                .error(error)
                .path(req.getRequestURI())
                .build();
    }

}
