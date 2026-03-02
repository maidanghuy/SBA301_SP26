package org.example.asis03.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.asis03.dto.request.RoomRequest;
import org.example.asis03.dto.response.RoomResponse;
import org.example.asis03.entity.AS03RoomInformation;
import org.example.asis03.entity.AS03RoomType;
import org.example.asis03.exception.ResourceNotFoundException;
import org.example.asis03.repository.AS03RoomInformationRepository;
import org.example.asis03.repository.AS03RoomTypeRepository;
import org.example.asis03.service.RoomInformationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomInformationServiceImpl implements RoomInformationService {

    private final AS03RoomInformationRepository roomRepo;
    private final AS03RoomTypeRepository roomTypeRepo;

    private RoomResponse toRes(AS03RoomInformation r) {
        return RoomResponse.builder()
                .roomId(r.getRoomId())
                .roomNumber(r.getRoomNumber())
                .roomDetailDescription(r.getRoomDetailDescription())
                .roomMaxCapacity(r.getRoomMaxCapacity())
                .roomStatus(r.getRoomStatus())
                .roomPricePerDay(r.getRoomPricePerDay())
                .roomTypeId(r.getRoomType().getRoomTypeId())
                .roomTypeName(r.getRoomType().getRoomTypeName())
                .build();
    }

    @Override
    public List<RoomResponse> getAllPublic(String q, Long roomTypeId, Boolean status) {
        List<AS03RoomInformation> rooms;

        if (q != null && !q.isBlank()) {
            rooms = roomRepo.findByRoomNumberContainingIgnoreCaseAndDeleteFlagFalse(q.trim());
        } else if (roomTypeId != null) {
            rooms = roomRepo.findByRoomType_RoomTypeIdAndDeleteFlagFalse(roomTypeId);
        } else if (status != null) {
            rooms = roomRepo.findByRoomStatusAndDeleteFlagFalse(status);
        } else {
            rooms = roomRepo.findByDeleteFlagFalse();
        }

        return rooms.stream().map(this::toRes).toList();
    }

    @Override
    public RoomResponse getPublicById(Long id) {
        AS03RoomInformation r = roomRepo.findById(id)
                .filter(room -> Boolean.FALSE.equals(room.getDeleteFlag()))
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        return toRes(r);
    }

    @Override
    public List<RoomResponse> getAllAdmin() {
        return roomRepo.findByDeleteFlagFalse()
                .stream()
                .map(this::toRes)
                .toList();
    }
    @Override
    public RoomResponse create(RoomRequest req) {
        String roomNumber = req.getRoomNumber().trim();

        if (roomRepo.existsByRoomNumberIgnoreCaseAndDeleteFlagFalse(roomNumber)) {
            throw new IllegalArgumentException("RoomNumber already exists");
        }

        AS03RoomType rt = roomTypeRepo.findById(req.getRoomTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("RoomType not found"));

        AS03RoomInformation r = AS03RoomInformation.builder()
                .roomNumber(roomNumber)
                .roomDetailDescription(req.getRoomDetailDescription())
                .roomMaxCapacity(req.getRoomMaxCapacity())
                .roomType(rt)
                .roomStatus(req.getRoomStatus())
                .roomPricePerDay(req.getRoomPricePerDay())
                .build();

        return toRes(roomRepo.save(r));
    }

    @Override
    public RoomResponse update(Long id, RoomRequest req) {

        AS03RoomInformation r = roomRepo.findById(id)
                .filter(room -> Boolean.FALSE.equals(room.getDeleteFlag()))
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        String newNumber = req.getRoomNumber().trim();

        if (!newNumber.equalsIgnoreCase(r.getRoomNumber())
                && roomRepo.existsByRoomNumberIgnoreCaseAndDeleteFlagFalse(newNumber)) {
            throw new IllegalArgumentException("RoomNumber already exists");
        }

        AS03RoomType rt = roomTypeRepo.findById(req.getRoomTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("RoomType not found"));

        r.setRoomNumber(newNumber);
        r.setRoomDetailDescription(req.getRoomDetailDescription());
        r.setRoomMaxCapacity(req.getRoomMaxCapacity());
        r.setRoomType(rt);
        r.setRoomStatus(req.getRoomStatus());
        r.setRoomPricePerDay(req.getRoomPricePerDay());

        return toRes(roomRepo.save(r));
    }

    @Override
    public void delete(Long id) {
        AS03RoomInformation r = roomRepo.findById(id)
                .filter(room -> Boolean.FALSE.equals(room.getDeleteFlag()))
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        r.setDeleteFlag(true);
        r.setRoomStatus(false);

        roomRepo.save(r);
    }
}