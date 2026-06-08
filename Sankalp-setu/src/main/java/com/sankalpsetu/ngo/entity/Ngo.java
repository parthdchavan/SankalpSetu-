package com.sankalpsetu.ngo.entity;

import com.sankalpsetu.user.entity.Address;
import com.sankalpsetu.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ngos")
@Getter @Setter
public class Ngo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "organization_name", nullable = false, length = 255)
    private String organizationName;

    @Column(name = "registration_number", length = 100)
    private String registrationNumber;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", length = 20)
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "verified_by")
    private User verifiedBy;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum VerificationStatus {
        PENDING, APPROVED, REJECTED
    }
}
