package com.sankalpsetu.ngo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class NgoActionResponse {
    private String message;
    private UUID donationId;
    private String requestStatus;
    private UUID pickupAssignmentId;
}