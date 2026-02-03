package org.example.assignment.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import static lombok.AccessLevel.PRIVATE;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = PRIVATE)
@Entity
@Table(name = "a_news_tag", schema = "sba301_sp26")
public class ANewsTag extends BaseEntity {

    @EmbeddedId
    ANewsTagId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("newsArticleId")
    @JoinColumn(name = "news_article_id", nullable = false)
    ANewsArticle newsArticle;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("tagId")
    @JoinColumn(name = "tag_id", nullable = false)
    ATag tag;
}
