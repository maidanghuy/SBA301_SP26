package org.example.assignment.repository;

import org.example.assignment.entity.ACategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IACategoryRepository extends JpaRepository<ACategory, Long> {
}

