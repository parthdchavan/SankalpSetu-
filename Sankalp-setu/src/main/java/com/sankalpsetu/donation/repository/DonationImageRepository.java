package com.sankalpsetu.donation.repository;

import com.sankalpsetu.donation.entity.DonationImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DonationImageRepository extends JpaRepository<DonationImage, UUID> {
    List<DonationImage> findByDonationId(UUID donationId);
}
