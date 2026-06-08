package com.sankalpsetu.donation.entity;

import com.sankalpsetu.user.entity.Address;
import com.sankalpsetu.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "donations")
@Getter @Setter
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private User donor;

    @ManyToOne
    @JoinColumn(name = "food_category_id")
    private FoodCategory foodCategory;

    @Column(name = "food_name", nullable = false, length = 255)
    private String foodName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "quantity_unit", length = 50)
    private String quantityUnit;

    @Column(name = "serves_people")
    private Integer servesPeople;

    @Column(name = "expiry_time", nullable = false)
    private LocalDateTime expiryTime;

    @ManyToOne
    @JoinColumn(name = "pickup_address_id")
    private Address pickupAddress;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private DonationStatus status = DonationStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum DonationStatus {
        PENDING, ACCEPTED, VOLUNTEER_ASSIGNED, PICKED_UP, DELIVERED, EXPIRED, CANCELLED
    }
}
