package org.example.orchid.service.impl;

import org.example.orchid.entity.Category;

import java.util.List;

public interface CategoryService {
    List<Category> findAll();
    Category findById(String id);
    Category save(Category category);
}
