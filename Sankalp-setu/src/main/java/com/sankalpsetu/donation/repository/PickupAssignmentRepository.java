package com.sankalpsetu.donation.repository;

import com.sankalpsetu.donation.entity.PickupAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PickupAssignmentRepository extends JpaRepository<PickupAssignment, UUID> {
    Optional<PickupAssignment> findByDonationId(UUID donationId);
    List<PickupAssignment> findByVolunteerId(UUID volunteerId);
    List<PickupAssignment> findByNgoId(UUID ngoId);
}
