package org.example.assignment.repository;

import org.example.assignment.entity.ANewsArticle;
import org.example.assignment.entity.ANewsTag;
import org.example.assignment.entity.ANewsTagId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IANewsTagRepository extends JpaRepository<ANewsTag, ANewsTagId> {
    List<ANewsTag> findByNewsArticle(ANewsArticle newsArticle);
    void deleteByNewsArticle(ANewsArticle newsArticle);
}
