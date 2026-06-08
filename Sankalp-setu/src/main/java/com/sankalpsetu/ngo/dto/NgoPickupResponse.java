package com.sankalpsetu.ngo.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NgoPickupResponse {
    private UUID pickupAssignmentId;
    private UUID donationId;
    private String foodName;
    private String foodCategory;
    private Integer quantity;
    private String quantityUnit;
    private String donorName;
    private String donorEmail;
    private String donorPhone;
    private String volunteerName;
    private String volunteerEmail;
    private String volunteerPhone;
    private String status;
    private LocalDateTime assignedAt;
    private LocalDateTime pickupTime;
    private LocalDateTime deliveredTime;
    private String city;
    private String addressLine1;
    private String pickupState;
}