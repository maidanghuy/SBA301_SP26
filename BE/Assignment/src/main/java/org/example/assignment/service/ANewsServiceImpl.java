package org.example.assignment.service;

import lombok.RequiredArgsConstructor;
import org.example.assignment.dto.request.ANewsCreateRequest;
import org.example.assignment.dto.request.ANewsUpdateRequest;
import org.example.assignment.dto.response.ANewsResponse;
import org.example.assignment.entity.*;
import org.example.assignment.mapper.ANewsMapper;
import org.example.assignment.repository.*;
import org.example.assignment.service.impl.ANewsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ANewsServiceImpl implements ANewsService {

    private final IANewsArticleRepository newsRepo;
    private final IACategoryRepository categoryRepo;
    private final IATagRepository tagRepo;
    private final IANewsTagRepository newsTagRepo;

    @Override
    public List<ANewsResponse> getAll(Boolean includeDeleted, String q, String status) {
        boolean incDel = includeDeleted != null && includeDeleted;

        List<ANewsArticle> list;

        if (incDel) {
            list = newsRepo.findAll();
        } else if (status != null && q != null) {
            list = newsRepo.findByDeleteFlagFalseAndNewsStatusAndNewsTitleContainingIgnoreCase(status, q);
        } else if (status != null) {
            list = newsRepo.findByDeleteFlagFalseAndNewsStatus(status);
        } else if (q != null) {
            list = newsRepo.findByDeleteFlagFalseAndNewsTitleContainingIgnoreCase(q);
        } else {
            list = newsRepo.findAll();
        }

        return list.stream().map(ANewsMapper::toResponse).toList();
    }

    @Override
    public ANewsResponse getById(Long id) {
        return newsRepo.findById(id)
                .map(ANewsMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("News not found: " + id));
    }

    @Override
    public ANewsResponse create(ANewsCreateRequest request) {
        ANewsArticle n = new ANewsArticle();

        n.setNewsTitle(request.getNewsTitle().trim());
        n.setHeadline(request.getHeadline());
        n.setNewsContent(request.getNewsContent().trim());
        n.setNewsSource(request.getNewsSource());
        n.setNewsStatus(request.getNewsStatus());
        n.setCreatedBy(request.getCreatedBy());

        ACategory category = categoryRepo.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        n.setCategory(category);

        ANewsArticle saved = newsRepo.save(n);

        syncTags(saved, request.getTagIds());

        return ANewsMapper.toResponse(saved);
    }

    @Override
    public ANewsResponse update(Long id, ANewsUpdateRequest request) {
        ANewsArticle n = newsRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("News not found"));

        n.setNewsTitle(request.getNewsTitle().trim());
        n.setHeadline(request.getHeadline());
        n.setNewsContent(request.getNewsContent().trim());
        n.setNewsSource(request.getNewsSource());
        n.setNewsStatus(request.getNewsStatus());
        n.setUpdatedBy(request.getUpdatedBy());

        ACategory category = categoryRepo.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        n.setCategory(category);

        syncTags(n, request.getTagIds());

        return ANewsMapper.toResponse(newsRepo.save(n));
    }

    @Override
    public ANewsResponse updateDeleteFlag(Long id, Boolean deleteFlag) {
        ANewsArticle n = newsRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("News not found"));

        n.setDeleteFlag(Boolean.TRUE.equals(deleteFlag));
        return ANewsMapper.toResponse(newsRepo.save(n));
    }

    private void syncTags(ANewsArticle news, List<Long> tagIds) {
        newsTagRepo.deleteByNewsArticle(news);
        news.getNewsTags().clear();

        if (tagIds == null || tagIds.isEmpty()) return;

        for (Long tagId : tagIds) {
            ATag tag = tagRepo.findById(tagId)
                    .orElseThrow(() -> new RuntimeException("Tag not found: " + tagId));

            ANewsTag nt = new ANewsTag();
            nt.setId(new ANewsTagId(news.getNewsArticleId(), tag.getTagId()));
            nt.setNewsArticle(news);
            nt.setTag(tag);

            newsTagRepo.save(nt);
            news.getNewsTags().add(nt);
        }
    }
}
