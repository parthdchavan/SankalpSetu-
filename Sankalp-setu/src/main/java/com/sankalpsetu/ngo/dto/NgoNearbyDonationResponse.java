package com.sankalpsetu.ngo.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

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
    private String city;
    private String addressLine1;
    private String distanceLabel;
    private Double distanceKm;
    private String urgencyLabel;
}