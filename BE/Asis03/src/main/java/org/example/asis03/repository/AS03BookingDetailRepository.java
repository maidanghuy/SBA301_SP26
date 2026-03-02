package org.example.asis03.repository;

import org.example.asis03.entity.AS03BookingDetail;
import org.example.asis03.entity.AS03BookingDetailId;
import org.example.asis03.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

public interface AS03BookingDetailRepository extends JpaRepository<AS03BookingDetail, AS03BookingDetailId> {

    // overlap rule: [start, end) giao nhau nếu start < existingEnd AND end > existingStart
    @Query("""
        select bd from AS03BookingDetail bd
        join bd.bookingReservation br
        where bd.room.roomId in :roomIds
          and br.bookingStatus in :activeStatuses
          and bd.startDate < :endDate
          and bd.endDate > :startDate
    """)
    List<AS03BookingDetail> findOverlaps(
            Collection<Long> roomIds,
            Collection<BookingStatus> activeStatuses,
            LocalDate startDate,
            LocalDate endDate
    );
}