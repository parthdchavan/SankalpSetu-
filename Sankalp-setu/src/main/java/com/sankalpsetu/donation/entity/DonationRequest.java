package com.sankalpsetu.donation.entity;

import com.sankalpsetu.ngo.entity.Ngo;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "donation_requests")
@Getter @Setter
public class DonationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "donation_id", nullable = false)
    private Donation donation;

    @ManyToOne
    @JoinColumn(name = "ngo_id", nullable = false)
    private Ngo ngo;

    @Enumerated(EnumType.STRING)
    @Column(name = "request_status", length = 20)
    private RequestStatus requestStatus = RequestStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum RequestStatus {
        PENDING, ACCEPTED, REJECTED
    }
}
