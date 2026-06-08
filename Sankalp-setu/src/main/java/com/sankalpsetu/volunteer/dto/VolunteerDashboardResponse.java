package com.sankalpsetu.volunteer.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class VolunteerDashboardResponse {
    private String volunteerName;
    private String availabilityStatus;
    private String vehicleType;
    private long activeAssignmentCount;
    private long deliveriesThisMonth;
    private long openAssignmentsCount;
    private int routeScore;
    private List<VolunteerAssignmentResponse> availableAssignments = new ArrayList<>();
    private List<VolunteerAssignmentResponse> activeAssignments = new ArrayList<>();
    private List<VolunteerActivityResponse> recentActivity = new ArrayList<>();
}