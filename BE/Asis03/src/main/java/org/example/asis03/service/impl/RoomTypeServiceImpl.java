package org.example.asis03.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.asis03.dto.request.RoomTypeRequest;
import org.example.asis03.dto.response.RoomTypeResponse;
import org.example.asis03.entity.AS03RoomType;
import org.example.asis03.exception.ResourceNotFoundException;
import org.example.asis03.repository.AS03RoomTypeRepository;
import org.example.asis03.service.RoomTypeService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomTypeServiceImpl implements RoomTypeService {

    private final AS03RoomTypeRepository roomTypeRepository;

    private RoomTypeResponse toRes(AS03RoomType e) {
        return RoomTypeResponse.builder()
                .roomTypeId(e.getRoomTypeId())
                .roomTypeName(e.getRoomTypeName())
                .typeDescription(e.getTypeDescription())
                .typeNote(e.getTypeNote())
                .build();
    }

    @Override
    public List<RoomTypeResponse> getAll() {
        return roomTypeRepository.findAll().stream().map(this::toRes).toList();
    }

    @Override
    public RoomTypeResponse getById(Long id) {
        AS03RoomType rt = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RoomType not found"));
        return toRes(rt);
    }

    @Override
    public RoomTypeResponse create(RoomTypeRequest req) {
        if (roomTypeRepository.existsByRoomTypeNameIgnoreCase(req.getRoomTypeName().trim())) {
            throw new IllegalArgumentException("RoomTypeName already exists");
        }
        AS03RoomType rt = AS03RoomType.builder()
                .roomTypeName(req.getRoomTypeName().trim())
                .typeDescription(req.getTypeDescription())
                .typeNote(req.getTypeNote())
                .build();
        return toRes(roomTypeRepository.save(rt));
    }

    @Override
    public RoomTypeResponse update(Long id, RoomTypeRequest req) {
        AS03RoomType rt = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RoomType not found"));

        rt.setRoomTypeName(req.getRoomTypeName().trim());
        rt.setTypeDescription(req.getTypeDescription());
        rt.setTypeNote(req.getTypeNote());

        return toRes(roomTypeRepository.save(rt));
    }

    @Override
    public void delete(Long id) {
        AS03RoomType rt = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RoomType not found"));
        roomTypeRepository.delete(rt);
    }
}