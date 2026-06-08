package com.sankalpsetu.volunteer.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class VolunteerAssignmentResponse {
    private UUID assignmentId;
    private UUID donationId;
    private String foodName;
    private String foodCategory;
    private Integer quantity;
    private String quantityUnit;
    private Integer servesPeople;
    private String status;
    private String urgencyLabel;
    private String distanceLabel;
    private String pickupAddress;
    private String city;
    private String donorName;
    private String donorEmail;
    private String donorPhone;
    private String ngoName;
    private String ngoEmail;
    private String ngoPhone;
    private String directionsUrl;
    private LocalDateTime assignedAt;
    private LocalDateTime pickupTime;
    private LocalDateTime deliveredTime;
}