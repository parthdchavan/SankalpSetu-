package com.sankalpsetu.donation.repository;

import com.sankalpsetu.donation.entity.DonationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DonationRequestRepository extends JpaRepository<DonationRequest, UUID> {
    List<DonationRequest> findByDonationId(UUID donationId);
    List<DonationRequest> findByNgoId(UUID ngoId);
}
