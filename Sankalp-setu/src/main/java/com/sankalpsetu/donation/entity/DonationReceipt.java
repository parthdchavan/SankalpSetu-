package com.sankalpsetu.donation.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "donation_receipts")
@Getter @Setter
public class DonationReceipt {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "donation_id", unique = true)
    private Donation donation;

    @Column(name = "receipt_number", unique = true, length = 100)
    private String receiptNumber;

    @Column(name = "pdf_url")
    private String pdfUrl;

    @CreationTimestamp
    @Column(name = "generated_at", updatable = false)
    private LocalDateTime generatedAt;
}
