package com.sankalpsetu.admin.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sankalpsetu.admin.dto.AdminActionResponse;
import com.sankalpsetu.admin.dto.AdminDashboardResponse;
import com.sankalpsetu.admin.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> dashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @PatchMapping("/ngos/{ngoId}/approve")
    public ResponseEntity<AdminActionResponse> approveNgo(@PathVariable UUID ngoId) {
        return ResponseEntity.ok(adminService.updateNgoVerification(ngoId, true));
    }

    @PatchMapping("/ngos/{ngoId}/reject")
    public ResponseEntity<AdminActionResponse> rejectNgo(@PathVariable UUID ngoId) {
        return ResponseEntity.ok(adminService.updateNgoVerification(ngoId, false));
    }
}
