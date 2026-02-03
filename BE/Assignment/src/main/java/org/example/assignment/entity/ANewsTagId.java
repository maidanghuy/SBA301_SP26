package org.example.assignment.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

import static lombok.AccessLevel.PRIVATE;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = PRIVATE)
@Embeddable
public class ANewsTagId implements Serializable {

    @Column(name = "news_article_id")
    Long newsArticleId;

    @Column(name = "tag_id")
    Long tagId;
}
