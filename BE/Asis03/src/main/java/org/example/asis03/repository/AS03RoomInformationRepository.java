package org.example.asis03.repository;

import org.example.asis03.entity.AS03RoomInformation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AS03RoomInformationRepository extends JpaRepository<AS03RoomInformation, Long> {

    boolean existsByRoomNumberIgnoreCaseAndDeleteFlagFalse(String roomNumber);

    List<AS03RoomInformation> findByDeleteFlagFalse();

    List<AS03RoomInformation> findByRoomStatusAndDeleteFlagFalse(Boolean roomStatus);

    List<AS03RoomInformation> findByRoomType_RoomTypeIdAndDeleteFlagFalse(Long roomTypeId);

    List<AS03RoomInformation> findByRoomNumberContainingIgnoreCaseAndDeleteFlagFalse(String q);
}