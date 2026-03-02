package org.example.asis03.repository;

import org.example.asis03.entity.AS03BookingReservation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AS03BookingReservationRepository extends JpaRepository<AS03BookingReservation, Long> {
    List<AS03BookingReservation> findByCustomer_IdOrderByBookingDateDesc(Long customerId);

    @EntityGraph(attributePaths = { "customer", "bookingDetails", "bookingDetails.room" })
    @Query("""
        select br
        from AS03BookingReservation br
        where (:status is null or upper(br.bookingStatus) = :status)
          and (:customerId is null or br.customer.id = :customerId)
          and (:from is null or br.bookingDate >= :from)
          and (:to is null or br.bookingDate <= :to)
        order by br.bookingDate desc
    """)
    List<AS03BookingReservation> findAdminBookings(
            @Param("status") String status,
            @Param("customerId") Long customerId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
}