package com.sankalpsetu.admin.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecentDonationResponse {
    private UUID id;
    private String foodName;
    private String donorName;
    private String city;
    private String status;
    private Integer servesPeople;
    private LocalDateTime createdAt;
}
