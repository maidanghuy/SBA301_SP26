package com.de180293.pe_sba301_sp25_be_de180293.repository;

import com.de180293.pe_sba301_sp25_be_de180293.entity.PR03Cars;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PR03CarsRepository extends JpaRepository<PR03Cars, Integer> {
    List<PR03Cars> findAll(Sort sort);

    List<PR03Cars> findByDeleteFlagIsFalse(Sort sort);

}