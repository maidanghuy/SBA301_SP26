package org.example.orchid.repository;

import org.example.orchid.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ICategoryRepository extends JpaRepository<Category, String> {
}
