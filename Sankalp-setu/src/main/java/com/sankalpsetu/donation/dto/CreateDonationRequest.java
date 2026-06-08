package com.sankalpsetu.donation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class CreateDonationRequest {
    @NotBlank
    private String foodName;
    private Integer foodCategoryId;
    private String description;
    @NotNull
    private Integer quantity;
    private String quantityUnit;
    private Integer servesPeople;
    @NotNull
    private LocalDateTime expiryTime;
    // address fields
    @NotBlank
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pincode;
}
