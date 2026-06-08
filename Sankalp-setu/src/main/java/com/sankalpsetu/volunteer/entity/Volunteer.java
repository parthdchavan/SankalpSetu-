package com.sankalpsetu.volunteer.entity;

import com.sankalpsetu.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "volunteers")
@Getter @Setter
public class Volunteer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "vehicle_type", length = 50)
    private String vehicleType;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status", length = 20)
    private AvailabilityStatus availabilityStatus = AvailabilityStatus.AVAILABLE;

    @Column(name = "total_deliveries")
    private Integer totalDeliveries = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum AvailabilityStatus {
        AVAILABLE, BUSY, OFFLINE
    }
}
