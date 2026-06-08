package com.sankalpsetu.volunteer.controller;

import com.sankalpsetu.volunteer.dto.VolunteerActionResponse;
import com.sankalpsetu.volunteer.dto.VolunteerDashboardResponse;
import com.sankalpsetu.volunteer.service.VolunteerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/volunteer")
@RequiredArgsConstructor
public class VolunteerController {

    private final VolunteerService volunteerService;

    @GetMapping("/dashboard")
    public ResponseEntity<VolunteerDashboardResponse> dashboard() {
        return ResponseEntity.ok(volunteerService.getDashboard());
    }

    @PatchMapping("/availability/toggle")
    public ResponseEntity<VolunteerActionResponse> toggleAvailability() {
        return ResponseEntity.ok(volunteerService.toggleAvailability());
    }

    @PostMapping("/assignments/{assignmentId}/accept")
    public ResponseEntity<VolunteerActionResponse> accept(@PathVariable UUID assignmentId) {
        return ResponseEntity.ok(volunteerService.acceptAssignment(assignmentId));
    }

    @PostMapping("/assignments/{assignmentId}/picked-up")
    public ResponseEntity<VolunteerActionResponse> pickedUp(@PathVariable UUID assignmentId) {
        return ResponseEntity.ok(volunteerService.markPickedUp(assignmentId));
    }

    @PostMapping("/assignments/{assignmentId}/delivered")
    public ResponseEntity<VolunteerActionResponse> delivered(@PathVariable UUID assignmentId) {
        return ResponseEntity.ok(volunteerService.markDelivered(assignmentId));
    }
}