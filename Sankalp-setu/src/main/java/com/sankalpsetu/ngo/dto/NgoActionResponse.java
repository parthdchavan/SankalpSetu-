package com.sankalpsetu.ngo.dto;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NgoActionResponse {
    private String message;
    private UUID donationId;
    private String requestStatus;
    private UUID pickupAssignmentId;
}