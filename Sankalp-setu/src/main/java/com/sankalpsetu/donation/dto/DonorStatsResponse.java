package com.sankalpsetu.donation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DonorStatsResponse {
    private long totalDonations;
    private long activeDonations;
    private long completedDonations;
    private long cancelledDonations;
    private int totalMealsProvided;
}
