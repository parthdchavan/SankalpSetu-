package com.sankalpsetu.volunteer.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class VolunteerActionResponse {
    private String message;
    private UUID assignmentId;
    private String status;
}