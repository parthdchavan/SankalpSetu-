package com.sankalpsetu.admin.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PendingNgoResponse {
    private UUID id;
    private String organizationName;
    private String registrationNumber;
    private String contactName;
    private String email;
    private String phone;
    private String city;
    private String state;
    private String verificationStatus;
    private LocalDateTime submittedAt;
}
