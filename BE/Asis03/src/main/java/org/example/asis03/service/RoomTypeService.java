package org.example.asis03.service;

import org.example.asis03.dto.request.RoomTypeRequest;
import org.example.asis03.dto.response.RoomTypeResponse;

import java.util.List;

public interface RoomTypeService {
    List<RoomTypeResponse> getAll();
    RoomTypeResponse getById(Long id);
    RoomTypeResponse create(RoomTypeRequest req);
    RoomTypeResponse update(Long id, RoomTypeRequest req);
    void delete(Long id);
}