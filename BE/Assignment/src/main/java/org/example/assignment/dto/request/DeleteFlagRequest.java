package org.example.assignment.dto.request;

import lombok.Data;
import lombok.experimental.FieldDefaults;

import static lombok.AccessLevel.PRIVATE;

@Data
@FieldDefaults(level = PRIVATE)
public class DeleteFlagRequest {
    Boolean deleteFlag;
}
