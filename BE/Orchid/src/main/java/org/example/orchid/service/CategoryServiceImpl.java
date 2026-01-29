package org.example.orchid.service;

import lombok.RequiredArgsConstructor;
import org.example.orchid.entity.Category;
import org.example.orchid.repository.ICategoryRepository;
import org.example.orchid.service.impl.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private final ICategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Category findById(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Category not found: " + id)
                );
    }

    @Override
    @Transactional
    public Category save(Category category) {
        return categoryRepository.save(category);
    }
}
