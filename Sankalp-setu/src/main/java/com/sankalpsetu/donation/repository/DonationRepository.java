package com.sankalpsetu.donation.repository;

import com.sankalpsetu.donation.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DonationRepository extends JpaRepository<Donation, UUID> {
    List<Donation> findByDonorId(UUID donorId);
    List<Donation> findByStatus(Donation.DonationStatus status);
}
