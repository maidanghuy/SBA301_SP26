package org.example.asis03.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.example.asis03.dto.request.BookingCreateRequest;
import org.example.asis03.dto.request.BookingRoomItemRequest;
import org.example.asis03.dto.response.BookingDetailResponse;
import org.example.asis03.dto.response.BookingResponse;
import org.example.asis03.entity.*;
import org.example.asis03.exception.ResourceNotFoundException;
import org.example.asis03.repository.AS03BookingDetailRepository;
import org.example.asis03.repository.AS03BookingReservationRepository;
import org.example.asis03.repository.AS03CustomerRepository;
import org.example.asis03.repository.AS03RoomInformationRepository;
import org.example.asis03.service.BookingService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final AS03BookingReservationRepository bookingReservationRepo;
    private final AS03BookingDetailRepository bookingDetailRepo;
    private final AS03RoomInformationRepository roomRepo;
    private final AS03CustomerRepository customerRepo;

    private static final EnumSet<BookingStatus> ACTIVE_STATUSES =
            EnumSet.of(BookingStatus.PENDING, BookingStatus.CONFIRMED);

    private BookingResponse toRes(AS03BookingReservation r) {

        List<BookingDetailResponse> details = Optional.ofNullable(r.getBookingDetails())
                .orElseGet(List::of)
                .stream()
                .map(d -> BookingDetailResponse.builder()
                        .roomId(d.getRoom().getRoomId())
                        .roomNumber(d.getRoom().getRoomNumber())
                        .startDate(d.getStartDate())
                        .endDate(d.getEndDate())
                        .actualPrice(d.getActualPrice())
                        .build())
                .toList();

        return BookingResponse.builder()
                .bookingReservationId(r.getBookingReservationId())
                .bookingDate(r.getBookingDate())
                .bookingStatus(r.getBookingStatus().name())
                .totalPrice(r.getTotalPrice())
                .customerId(r.getCustomer().getId())
                .details(details)
                .build();
    }

    @Override
    @Transactional
    public BookingResponse create(BookingCreateRequest req) {

        // basic validate
        if (req.getRooms() == null || req.getRooms().isEmpty()) {
            throw new IllegalArgumentException("Rooms list is empty");
        }

        for (BookingRoomItemRequest item : req.getRooms()) {
            if (item.getStartDate() == null || item.getEndDate() == null) {
                throw new IllegalArgumentException("StartDate/EndDate is required");
            }
            if (!item.getEndDate().isAfter(item.getStartDate())) {
                throw new IllegalArgumentException("EndDate must be after StartDate for roomId=" + item.getRoomId());
            }
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        AS03Customer customer = customerRepo.findByEmailAndDeleteFlagFalse(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        // load rooms
        List<Long> roomIds = req.getRooms().stream()
                .map(BookingRoomItemRequest::getRoomId)
                .distinct()
                .toList();

        Map<Long, AS03RoomInformation> roomsById = roomRepo.findAllById(roomIds)
                .stream()
                .collect(java.util.stream.Collectors.toMap(AS03RoomInformation::getRoomId, r -> r));

        if (roomsById.size() != roomIds.size()) {
            List<Long> missing = roomIds.stream().filter(id -> !roomsById.containsKey(id)).toList();
            throw new ResourceNotFoundException("Room not found: " + missing);
        }

        // check roomStatus
        for (Long roomId : roomIds) {
            AS03RoomInformation r = roomsById.get(roomId);
            if (Boolean.FALSE.equals(r.getRoomStatus())) {
                throw new IllegalArgumentException("Room is not available: roomId=" + roomId);
            }
        }

        // check overlap từng item
        for (BookingRoomItemRequest item : req.getRooms()) {
            List<AS03BookingDetail> overlaps = bookingDetailRepo.findOverlaps(
                    List.of(item.getRoomId()),
                    ACTIVE_STATUSES,
                    item.getStartDate(),
                    item.getEndDate()
            );
            if (!overlaps.isEmpty()) {
                throw new IllegalArgumentException(
                        "Room already booked: roomId=" + item.getRoomId()
                                + " from " + item.getStartDate()
                                + " to " + item.getEndDate()
                );
            }
        }

        // create reservation
        AS03BookingReservation reservation = AS03BookingReservation.builder()
                .bookingDate(LocalDateTime.now())
                .customer(customer)
                .bookingStatus(BookingStatus.PENDING)
                .totalPrice(BigDecimal.ZERO)
                .build();

        bookingReservationRepo.save(reservation);

        // create details + calc price
        BigDecimal total = BigDecimal.ZERO;
        List<AS03BookingDetail> details = new ArrayList<>();

        for (BookingRoomItemRequest item : req.getRooms()) {
            AS03RoomInformation room = roomsById.get(item.getRoomId());

            long days = ChronoUnit.DAYS.between(item.getStartDate(), item.getEndDate());
            if (days <= 0) {
                throw new IllegalArgumentException("Invalid booking days for roomId=" + item.getRoomId());
            }

            BigDecimal actualPrice = room.getRoomPricePerDay().multiply(BigDecimal.valueOf(days));
            total = total.add(actualPrice);

            AS03BookingDetailId id = AS03BookingDetailId.builder()
                    .bookingReservationId(reservation.getBookingReservationId())
                    .roomId(room.getRoomId())
                    .build();

            AS03BookingDetail detail = AS03BookingDetail.builder()
                    .id(id)
                    .bookingReservation(reservation)
                    .room(room)
                    .startDate(item.getStartDate())
                    .endDate(item.getEndDate())
                    .actualPrice(actualPrice)
                    .build();

            details.add(detail);
        }

        bookingDetailRepo.saveAll(details);

        reservation.setTotalPrice(total);
        reservation.setBookingDetails(details);

        return toRes(bookingReservationRepo.save(reservation));
    }

    @Override
    public BookingResponse getById(Long id) {
        AS03BookingReservation r = bookingReservationRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        AS03Customer customer = customerRepo.findByEmailAndDeleteFlagFalse(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        if (!Objects.equals(r.getCustomer().getId(), customer.getId())) {
            throw new IllegalArgumentException("You are not allowed to view this booking");
        }

        return toRes(r);
    }

    @Override
    @Transactional
    public BookingResponse cancel(Long id) {
        AS03BookingReservation r = bookingReservationRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (r.getBookingStatus() == BookingStatus.COMPLETED) {
            throw new IllegalArgumentException("Cannot cancel a completed booking");
        }

        r.setBookingStatus(BookingStatus.CANCELLED);
        return toRes(bookingReservationRepo.save(r));
    }

    @Override
    public List<BookingResponse> myHistory() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        AS03Customer customer = customerRepo.findByEmailAndDeleteFlagFalse(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        return bookingReservationRepo.findByCustomer_IdOrderByBookingDateDesc(customer.getId())
                .stream()
                .map(this::toRes)
                .toList();
    }
}