package com.sankalpsetu.donation.entity;

import com.sankalpsetu.ngo.entity.Ngo;
import com.sankalpsetu.volunteer.entity.Volunteer;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "pickup_assignments")
@Getter @Setter
public class PickupAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "donation_id", nullable = false, unique = true)
    private Donation donation;

    @ManyToOne
    @JoinColumn(name = "ngo_id", nullable = false)
    private Ngo ngo;

    @ManyToOne
    @JoinColumn(name = "volunteer_id")
    private Volunteer volunteer;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "pickup_time")
    private LocalDateTime pickupTime;

    @Column(name = "delivered_time")
    private LocalDateTime deliveredTime;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private AssignmentStatus status = AssignmentStatus.ASSIGNED;

    public enum AssignmentStatus {
        ASSIGNED, PICKED_UP, DELIVERED
    }
}
