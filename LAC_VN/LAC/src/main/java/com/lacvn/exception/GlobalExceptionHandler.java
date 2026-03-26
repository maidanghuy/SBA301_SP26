package com.lacvn.exception;

import com.lacvn.common.ApiResponse;
import com.lacvn.common.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> notFound(ResourceNotFoundException ex, HttpServletRequest req) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), req);
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> validation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        Map<String, String> details = new LinkedHashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            details.put(fe.getField(), fe.getDefaultMessage());
        }
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Validation Failed", details, req);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Object>> badJson(HttpMessageNotReadableException ex, HttpServletRequest req) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Invalid JSON", "Request body is malformed", req);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> illegalArg(IllegalArgumentException ex, HttpServletRequest req) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), req);
    }

    @ExceptionHandler({UsernameNotFoundException.class, BadCredentialsException.class})
    public ResponseEntity<ApiResponse<Object>> authFailed(Exception ex, HttpServletRequest req) {
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "Unauthorized", "Invalid email or password", req);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> accessDenied(
            AccessDeniedException ex,
            HttpServletRequest req
    ) {
        return buildErrorResponse(
                HttpStatus.FORBIDDEN,
                "Forbidden",
                "You do not have permission to access this resource",
                req
        );
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Object>> constraintViolation(
            ConstraintViolationException ex,
            HttpServletRequest req
    ) {
        Map<String, String> details = new LinkedHashMap<>();
        ex.getConstraintViolations().forEach(v -> {
            details.put(v.getPropertyPath().toString(), v.getMessage());
        });

        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Validation Failed", details, req);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Object>> typeMismatch(
            MethodArgumentTypeMismatchException ex,
            HttpServletRequest req
    ) {
        String message = String.format("Parameter '%s' should be of type %s",
                ex.getName(),
                ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "unknown"
        );

        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Type Mismatch", message, req);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Object>> dataIntegrity(
            DataIntegrityViolationException ex,
            HttpServletRequest req
    ) {
        return buildErrorResponse(
                HttpStatus.CONFLICT,
                "Data Conflict",
                "Duplicate or invalid data",
                req
        );
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResponse<Object>> missingParam(
            MissingServletRequestParameterException ex,
            HttpServletRequest req
    ) {
        String message = "Missing parameter: " + ex.getParameterName();
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Bad Request", message, req);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> other(Exception ex, HttpServletRequest req) {
        ex.printStackTrace();

        Map<String, String> errorDetails = new LinkedHashMap<>();
        errorDetails.put("message", ex.getMessage());
        errorDetails.put("stackTrace", getStackTraceAsString(ex));

        ApiError apiError = ApiError.builder()
                .timestamp(Instant.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("Internal Server Error")
                .message("Unexpected error")
                .details(errorDetails)
                .path(req.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponses.error(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", apiError, req));
    }

    // Utility method to convert the stack trace to a string
    private String getStackTraceAsString(Exception ex) {
        StringBuilder stackTrace = new StringBuilder();
        for (StackTraceElement element : ex.getStackTrace()) {
            stackTrace.append(element.toString()).append("\n");
        }
        return stackTrace.toString();
    }

    // Utility method to build error response
    private ResponseEntity<ApiResponse<Object>> buildErrorResponse(HttpStatus status, String error, Object message, HttpServletRequest req) {
        ApiError apiError = ApiError.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .error(error)
                .message(message.toString())
                .path(req.getRequestURI())
                .build();

        return ResponseEntity.status(status).body(ApiResponses.error(status, error, apiError, req));
    }
}