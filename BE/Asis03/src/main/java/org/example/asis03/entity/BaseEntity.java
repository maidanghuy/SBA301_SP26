package org.example.asis03.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@MappedSuperclass
@FieldDefaults(level = AccessLevel.PRIVATE)
public abstract class BaseEntity {

    /**
     * Time when the record was created
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    LocalDateTime createdAt;

    /**
     * Time when the record was last updated
     */
    @Column(name = "updated_at")
    LocalDateTime updatedAt;

    /**
     * User who created the record
     */
    @Column(name = "created_by", length = 50, updatable = false)
    String createdBy;

    /**
     * User who last updated the record
     */
    @Column(name = "updated_by", length = 50)
    String updatedBy;

    /**
     * Soft delete flag
     * false = active, true = deleted
     */
    @Column(name = "delete_flag", nullable = false)
    Boolean deleteFlag = false;

    @PrePersist
    protected void onCreate() {
        System.out.println(">>> PrePersist BaseEntity called");
        this.createdAt = LocalDateTime.now();
        this.deleteFlag = Boolean.FALSE;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
