package org.example.assignment.repository;

import org.example.assignment.entity.ANewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IANewsArticleRepository extends JpaRepository<ANewsArticle, Long> {

    List<ANewsArticle> findByDeleteFlagFalse();

    List<ANewsArticle> findByDeleteFlagFalseAndNewsTitleContainingIgnoreCase(String q);

    List<ANewsArticle> findByDeleteFlagFalseAndNewsStatus(String status);

    List<ANewsArticle> findByDeleteFlagFalseAndNewsStatusAndNewsTitleContainingIgnoreCase(
            String status, String q
    );
}

