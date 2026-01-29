package org.example.orchid.repository;

import org.example.orchid.entity.Orchid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface IOrchidRepository extends JpaRepository<Orchid, Long>, JpaSpecificationExecutor<Orchid> {
    List<Orchid> findByDeleteFlagIsFalse();
    Optional<Orchid> findByIdAndDeleteFlagIsFalse(Long id);
}
