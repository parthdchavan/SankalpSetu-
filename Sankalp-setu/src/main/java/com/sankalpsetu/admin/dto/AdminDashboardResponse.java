package com.sankalpsetu.admin.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminDashboardResponse {
    private long totalUsers;
    private long donorCount;
    private long ngoCount;
    private long volunteerCount;
    private long verifiedNgoCount;
    private long pendingNgoCount;
    private long activeDonationCount;
    private long deliveredDonationCount;
    private long mealsThisMonth;
    private List<PendingNgoResponse> pendingNgos;
    private List<RecentDonationResponse> recentDonations;
}
