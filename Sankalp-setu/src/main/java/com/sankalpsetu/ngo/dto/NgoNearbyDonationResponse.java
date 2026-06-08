package com.sankalpsetu.ngo.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NgoNearbyDonationResponse {
    private UUID donationId;
    private String foodName;
    private String foodCategory;
    private String description;
    private Integer quantity;
    private String quantityUnit;
    private Integer servesPeople;
    private LocalDateTime expiryTime;
    private String status;
    private String donorName;
    private String donorEmail;
    private String donorPhone;
    private String city;
    private String addressLine1;
    private String distanceLabel;
    private Double distanceKm;
    private String urgencyLabel;
}