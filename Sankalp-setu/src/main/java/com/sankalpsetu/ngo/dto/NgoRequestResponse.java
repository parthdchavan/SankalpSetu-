package com.sankalpsetu.ngo.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class NgoRequestResponse {
    private UUID requestId;
    private UUID donationId;
    private String foodName;
    private String donorName;
    private String donorPhone;
    private String requestStatus;
    private LocalDateTime createdAt;
    private String city;
    private String addressLine1;
}