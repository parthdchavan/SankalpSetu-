package com.sankalpsetu.donation.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reviews")
@Getter @Setter
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "donation_id", unique = true)
    private Donation donation;

    @Column(name = "donor_rating")
    private Integer donorRating;

    @Column(name = "ngo_rating")
    private Integer ngoRating;

    @Column(name = "volunteer_rating")
    private Integer volunteerRating;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
