package com.sankalpsetu.volunteer.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class VolunteerActivityResponse {
    private UUID activityId;
    private String title;
    private String subtitle;
    private String status;
    private String statusClass;
    private LocalDateTime createdAt;
}