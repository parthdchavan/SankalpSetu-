package com.sankalpsetu.ngo.dto;

import com.sankalpsetu.ngo.entity.Ngo;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class NgoDashboardResponse {
    private String organizationName;
    private String verificationStatus;
    private String ngoFirstName;
    private String city;
    private boolean canAcceptDonations;
    private long pendingDonationCount;
    private long activePickupCount;
    private long acceptedThisMonth;
    private long requestHistoryCount;
    private List<NgoNearbyDonationResponse> nearbyDonations = new ArrayList<>();
    private List<NgoPickupResponse> activePickups = new ArrayList<>();
    private List<NgoRequestResponse> requestHistory = new ArrayList<>();

    public static NgoDashboardResponse from(Ngo ngo) {
        NgoDashboardResponse response = new NgoDashboardResponse();
        response.setOrganizationName(ngo.getOrganizationName());
        response.setVerificationStatus(ngo.getVerificationStatus().name());
        response.setNgoFirstName(ngo.getUser() != null ? ngo.getUser().getFirstName() : null);
        response.setCity(ngo.getAddress() != null ? ngo.getAddress().getCity() : null);
        response.setCanAcceptDonations(ngo.getVerificationStatus() == Ngo.VerificationStatus.APPROVED);
        return response;
    }
}