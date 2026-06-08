package com.sankalpsetu.ngo.controller;

import com.sankalpsetu.ngo.dto.NgoActionResponse;
import com.sankalpsetu.ngo.dto.NgoDashboardResponse;
import com.sankalpsetu.ngo.service.NgoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/ngo")
@RequiredArgsConstructor
public class NgoController {

    private final NgoService ngoService;

    @GetMapping("/dashboard")
    public ResponseEntity<NgoDashboardResponse> dashboard() {
        return ResponseEntity.ok(ngoService.getDashboard());
    }

    @PostMapping("/donations/{donationId}/accept")
    public ResponseEntity<NgoActionResponse> acceptDonation(@PathVariable UUID donationId) {
        return ResponseEntity.ok(ngoService.acceptDonation(donationId));
    }

    @PostMapping("/donations/{donationId}/reject")
    public ResponseEntity<NgoActionResponse> rejectDonation(@PathVariable UUID donationId) {
        return ResponseEntity.ok(ngoService.rejectDonation(donationId));
    }
}