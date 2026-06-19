package com.sankalpsetu.admin.dto;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminActionResponse {
    private String message;
    private UUID ngoId;
    private String verificationStatus;
}
