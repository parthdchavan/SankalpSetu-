package com.sankalpsetu.donation.controller;

import com.sankalpsetu.donation.dto.CreateDonationRequest;
import com.sankalpsetu.donation.dto.DonationResponse;
import com.sankalpsetu.donation.dto.DonorStatsResponse;
import com.sankalpsetu.donation.service.DonationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    @PostMapping
    public ResponseEntity<DonationResponse> create(@Valid @RequestBody CreateDonationRequest req) {
        return ResponseEntity.ok(donationService.create(req));
    }

    @GetMapping("/my")
    public ResponseEntity<List<DonationResponse>> myDonations() {
        return ResponseEntity.ok(donationService.myDonations());
    }

    @GetMapping("/my/stats")
    public ResponseEntity<DonorStatsResponse> myStats() {
        return ResponseEntity.ok(donationService.myStats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(donationService.getById(id));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable UUID id) {
        donationService.cancel(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/categories")
    public ResponseEntity<List<com.sankalpsetu.donation.entity.FoodCategory>> categories() {
        return ResponseEntity.ok(donationService.getAllCategories());
    }
}
