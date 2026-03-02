package org.example.asis03.repository;

import org.example.asis03.entity.AS03RoomType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AS03RoomTypeRepository extends JpaRepository<AS03RoomType, Long> {
    boolean existsByRoomTypeNameIgnoreCase(String roomTypeName);
}