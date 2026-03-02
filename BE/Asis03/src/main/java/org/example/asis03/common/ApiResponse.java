package org.example.asis03.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private Instant timestamp;
    private int status;
    private String message;
    private T data;
    private Object error;
    private String path;
}
