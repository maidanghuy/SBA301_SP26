package org.example.assignment.repository;

import org.example.assignment.entity.ATag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IATagRepository extends JpaRepository<ATag, Long> {}

