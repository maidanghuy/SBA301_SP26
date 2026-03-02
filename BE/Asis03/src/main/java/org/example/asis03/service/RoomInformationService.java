package org.example.asis03.service;

import org.example.asis03.dto.request.RoomRequest;
import org.example.asis03.dto.response.RoomResponse;

import java.util.List;

public interface RoomInformationService {
    List<RoomResponse> getAllPublic(String q, Long roomTypeId, Boolean status);
    RoomResponse getPublicById(Long id);

    List<RoomResponse> getAllAdmin();
    RoomResponse create(RoomRequest req);
    RoomResponse update(Long id, RoomRequest req);
    void delete(Long id);
}