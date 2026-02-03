package org.example.assignment.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static lombok.AccessLevel.PRIVATE;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = PRIVATE)
@Entity
@Table(name = "a_news_article", schema = "sba301_sp26")
public class ANewsArticle extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "news_article_id")
    Long newsArticleId;

    @Column(name = "news_title", length = 255, nullable = false)
    String newsTitle;

    @Column(name = "headline", length = 500)
    String headline;

    @Column(name = "news_content", columnDefinition = "TEXT", nullable = false)
    String newsContent;

    @Column(name = "news_source", length = 255)
    String newsSource;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    ACategory category;

    @Column(name = "news_status", length = 50, nullable = false)
    String newsStatus;

    @Column(name = "modified_date")
    LocalDateTime modifiedDate;

    @OneToMany(mappedBy = "newsArticle", fetch = FetchType.LAZY)
    @Builder.Default
    List<ANewsTag> newsTags = new ArrayList<>();
}
