package org.example.orchid.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.example.orchid.common.ApiResponse;
import org.example.orchid.common.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.http.converter.HttpMessageNotReadableException;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> notFound(ResourceNotFoundException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponses.error(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), req));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> validation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        Map<String, String> details = new LinkedHashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            details.put(fe.getField(), fe.getDefaultMessage());
        }

        return ResponseEntity.badRequest()
                .body(ApiResponses.error(HttpStatus.BAD_REQUEST, "Validation failed", details, req));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Object>> badJson(HttpMessageNotReadableException ex, HttpServletRequest req) {
        return ResponseEntity.badRequest()
                .body(ApiResponses.error(HttpStatus.BAD_REQUEST, "Invalid JSON", "Request body is malformed", req));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> illegalArg(IllegalArgumentException ex, HttpServletRequest req) {
        return ResponseEntity.badRequest()
                .body(ApiResponses.error(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), req));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> other(Exception ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponses.error(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", "Unexpected error", req));
    }
}
