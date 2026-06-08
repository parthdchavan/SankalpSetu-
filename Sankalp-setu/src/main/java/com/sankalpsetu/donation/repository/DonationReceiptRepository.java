package com.sankalpsetu.donation.repository;

import com.sankalpsetu.donation.entity.DonationReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DonationReceiptRepository extends JpaRepository<DonationReceipt, UUID> {
    Optional<DonationReceipt> findByDonationId(UUID donationId);
    Optional<DonationReceipt> findByReceiptNumber(String receiptNumber);
}
