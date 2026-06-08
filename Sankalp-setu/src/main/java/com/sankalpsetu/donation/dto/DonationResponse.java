package com.sankalpsetu.donation.dto;

import com.sankalpsetu.donation.entity.Donation;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter
public class DonationResponse {
    private UUID id;
    private String foodName;
    private String foodCategory;
    private String description;
    private Integer quantity;
    private String quantityUnit;
    private Integer servesPeople;
    private LocalDateTime expiryTime;
    private String status;
    private LocalDateTime createdAt;
    private String city;
    private String addressLine1;

    public static DonationResponse from(Donation d) {
        DonationResponse r = new DonationResponse();
        r.setId(d.getId());
        r.setFoodName(d.getFoodName());
        r.setFoodCategory(d.getFoodCategory() != null ? d.getFoodCategory().getName() : null);
        r.setDescription(d.getDescription());
        r.setQuantity(d.getQuantity());
        r.setQuantityUnit(d.getQuantityUnit());
        r.setServesPeople(d.getServesPeople());
        r.setExpiryTime(d.getExpiryTime());
        r.setStatus(d.getStatus().name());
        r.setCreatedAt(d.getCreatedAt());
        if (d.getPickupAddress() != null) {
            r.setCity(d.getPickupAddress().getCity());
            r.setAddressLine1(d.getPickupAddress().getAddressLine1());
        }
        return r;
    }
}
