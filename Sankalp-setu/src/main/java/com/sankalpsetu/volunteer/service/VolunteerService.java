package com.sankalpsetu.volunteer.service;

import com.sankalpsetu.donation.entity.PickupAssignment;
import com.sankalpsetu.donation.repository.PickupAssignmentRepository;
import com.sankalpsetu.user.entity.User;
import com.sankalpsetu.user.repository.UserRepository;
import com.sankalpsetu.volunteer.dto.VolunteerActionResponse;
import com.sankalpsetu.volunteer.dto.VolunteerActivityResponse;
import com.sankalpsetu.volunteer.dto.VolunteerAssignmentResponse;
import com.sankalpsetu.volunteer.dto.VolunteerDashboardResponse;
import com.sankalpsetu.volunteer.entity.Volunteer;
import com.sankalpsetu.volunteer.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VolunteerService {

    private final VolunteerRepository volunteerRepository;
    private final PickupAssignmentRepository pickupAssignmentRepository;
    private final UserRepository userRepository;

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Volunteer currentVolunteer() {
        return volunteerRepository.findByUserId(currentUser().getId())
                .orElseThrow(() -> new RuntimeException("Volunteer profile not found"));
    }

    @Transactional(readOnly = true)
    public VolunteerDashboardResponse getDashboard() {
        Volunteer volunteer = currentVolunteer();
        List<PickupAssignment> allAssignments = pickupAssignmentRepository.findAll();
        List<PickupAssignment> volunteerAssignments = pickupAssignmentRepository.findByVolunteerId(volunteer.getId());

        List<PickupAssignment> availableAssignments = allAssignments.stream()
                .filter(assignment -> assignment.getVolunteer() == null)
                .filter(assignment -> assignment.getStatus() == PickupAssignment.AssignmentStatus.ASSIGNED)
                .sorted(Comparator
                        .comparing((PickupAssignment assignment) -> urgencyRank(assignment))
                        .thenComparing(PickupAssignment::getAssignedAt, Comparator.nullsLast(Comparator.naturalOrder())))
                .collect(Collectors.toList());

        List<PickupAssignment> activeAssignments = volunteerAssignments.stream()
                .filter(assignment -> assignment.getStatus() != PickupAssignment.AssignmentStatus.DELIVERED)
                .sorted(Comparator.comparing(PickupAssignment::getAssignedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .collect(Collectors.toList());

        long deliveriesThisMonth = volunteerAssignments.stream()
                .filter(assignment -> assignment.getStatus() == PickupAssignment.AssignmentStatus.DELIVERED)
                .filter(assignment -> assignment.getDeliveredTime() != null)
                .filter(assignment -> YearMonth.from(assignment.getDeliveredTime()).equals(YearMonth.now()))
                .count();

        VolunteerDashboardResponse response = new VolunteerDashboardResponse();
        response.setVolunteerName(volunteer.getUser() != null ? volunteer.getUser().getFirstName() : null);
        response.setAvailabilityStatus(volunteer.getAvailabilityStatus().name());
        response.setVehicleType(volunteer.getVehicleType());
        response.setActiveAssignmentCount(activeAssignments.size());
        response.setDeliveriesThisMonth(deliveriesThisMonth);
        response.setOpenAssignmentsCount(availableAssignments.size());
        response.setRouteScore(Math.min(100, (int) (deliveriesThisMonth * 5 + activeAssignments.size() * 12 + availableAssignments.size() * 2)));
        response.setAvailableAssignments(availableAssignments.stream().map(this::toAssignmentResponse).collect(Collectors.toList()));
        response.setActiveAssignments(activeAssignments.stream().map(this::toAssignmentResponse).collect(Collectors.toList()));
        response.setRecentActivity(buildRecentActivity(volunteerAssignments));
        return response;
    }

    @Transactional
    public VolunteerActionResponse toggleAvailability() {
        Volunteer volunteer = currentVolunteer();
        Volunteer.AvailabilityStatus next = volunteer.getAvailabilityStatus() == Volunteer.AvailabilityStatus.AVAILABLE
                ? Volunteer.AvailabilityStatus.OFFLINE
                : Volunteer.AvailabilityStatus.AVAILABLE;
        volunteer.setAvailabilityStatus(next);
        volunteerRepository.save(volunteer);
        VolunteerActionResponse response = new VolunteerActionResponse();
        response.setMessage("Availability updated");
        response.setStatus(next.name());
        return response;
    }

    @Transactional
    public VolunteerActionResponse acceptAssignment(UUID assignmentId) {
        Volunteer volunteer = currentVolunteer();
        if (volunteer.getAvailabilityStatus() != Volunteer.AvailabilityStatus.AVAILABLE) {
            throw new RuntimeException("Set availability to AVAILABLE before accepting assignments");
        }

        PickupAssignment assignment = pickupAssignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        if (assignment.getVolunteer() != null) {
            throw new RuntimeException("Assignment is already claimed");
        }
        if (assignment.getStatus() != PickupAssignment.AssignmentStatus.ASSIGNED) {
            throw new RuntimeException("Assignment is no longer available");
        }

        assignment.setVolunteer(volunteer);
        assignment.setAssignedAt(assignment.getAssignedAt() != null ? assignment.getAssignedAt() : LocalDateTime.now());
        pickupAssignmentRepository.save(assignment);

        volunteer.setAvailabilityStatus(Volunteer.AvailabilityStatus.BUSY);
        volunteerRepository.save(volunteer);

        VolunteerActionResponse response = new VolunteerActionResponse();
        response.setMessage("Assignment accepted");
        response.setAssignmentId(assignmentId);
        response.setStatus(assignment.getStatus().name());
        return response;
    }

    @Transactional
    public VolunteerActionResponse markPickedUp(UUID assignmentId) {
        PickupAssignment assignment = requireMine(assignmentId);
        if (assignment.getStatus() != PickupAssignment.AssignmentStatus.ASSIGNED) {
            throw new RuntimeException("Assignment must be accepted before pickup");
        }

        assignment.setStatus(PickupAssignment.AssignmentStatus.PICKED_UP);
        assignment.setPickupTime(LocalDateTime.now());
        pickupAssignmentRepository.save(assignment);

        VolunteerActionResponse response = new VolunteerActionResponse();
        response.setMessage("Pickup marked as started");
        response.setAssignmentId(assignmentId);
        response.setStatus(assignment.getStatus().name());
        return response;
    }

    @Transactional
    public VolunteerActionResponse markDelivered(UUID assignmentId) {
        PickupAssignment assignment = requireMine(assignmentId);
        if (assignment.getStatus() != PickupAssignment.AssignmentStatus.PICKED_UP) {
            throw new RuntimeException("Assignment must be picked up before delivery");
        }

        assignment.setStatus(PickupAssignment.AssignmentStatus.DELIVERED);
        assignment.setDeliveredTime(LocalDateTime.now());
        pickupAssignmentRepository.save(assignment);

        Volunteer volunteer = currentVolunteer();
        volunteer.setTotalDeliveries((volunteer.getTotalDeliveries() == null ? 0 : volunteer.getTotalDeliveries()) + 1);
        boolean hasOpenWork = pickupAssignmentRepository.findByVolunteerId(volunteer.getId()).stream()
                .anyMatch(item -> item.getStatus() != PickupAssignment.AssignmentStatus.DELIVERED && !item.getId().equals(assignmentId));
        volunteer.setAvailabilityStatus(hasOpenWork ? Volunteer.AvailabilityStatus.BUSY : Volunteer.AvailabilityStatus.AVAILABLE);
        volunteerRepository.save(volunteer);

        VolunteerActionResponse response = new VolunteerActionResponse();
        response.setMessage("Delivery completed");
        response.setAssignmentId(assignmentId);
        response.setStatus(assignment.getStatus().name());
        return response;
    }

    private PickupAssignment requireMine(UUID assignmentId) {
        Volunteer volunteer = currentVolunteer();
        PickupAssignment assignment = pickupAssignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        if (assignment.getVolunteer() == null || !assignment.getVolunteer().getId().equals(volunteer.getId())) {
            throw new RuntimeException("Assignment is not assigned to you");
        }
        return assignment;
    }

    private VolunteerAssignmentResponse toAssignmentResponse(PickupAssignment assignment) {
        VolunteerAssignmentResponse response = new VolunteerAssignmentResponse();
        response.setAssignmentId(assignment.getId());
        response.setDonationId(assignment.getDonation() != null ? assignment.getDonation().getId() : null);
        response.setFoodName(assignment.getDonation() != null ? assignment.getDonation().getFoodName() : null);
        response.setFoodCategory(assignment.getDonation() != null && assignment.getDonation().getFoodCategory() != null ? assignment.getDonation().getFoodCategory().getName() : null);
        response.setQuantity(assignment.getDonation() != null ? assignment.getDonation().getQuantity() : null);
        response.setQuantityUnit(assignment.getDonation() != null ? assignment.getDonation().getQuantityUnit() : null);
        response.setServesPeople(assignment.getDonation() != null ? assignment.getDonation().getServesPeople() : null);
        response.setStatus(assignment.getStatus().name());
        response.setUrgencyLabel(assignment.getDonation() != null ? urgencyLabel(assignment.getDonation().getExpiryTime()) : null);
        response.setDistanceLabel(assignment.getDonation() != null ? distanceLabel(assignment.getDonation().getExpiryTime()) : null);
        if (assignment.getDonation() != null && assignment.getDonation().getPickupAddress() != null) {
            response.setPickupAddress(assignment.getDonation().getPickupAddress().getAddressLine1());
            response.setCity(assignment.getDonation().getPickupAddress().getCity());
        }
        if (assignment.getDonation() != null && assignment.getDonation().getDonor() != null) {
            response.setDonorName(assignment.getDonation().getDonor().getFirstName() + " " + safeLastName(assignment.getDonation().getDonor()));
            response.setDonorEmail(assignment.getDonation().getDonor().getEmail());
            response.setDonorPhone(assignment.getDonation().getDonor().getPhone());
        }
        if (assignment.getNgo() != null) {
            response.setNgoName(assignment.getNgo().getOrganizationName());
            if (assignment.getNgo().getUser() != null) {
                response.setNgoEmail(assignment.getNgo().getUser().getEmail());
                response.setNgoPhone(assignment.getNgo().getUser().getPhone());
            }
        }
        response.setDirectionsUrl(buildDirectionsUrl(assignment));
        response.setAssignedAt(assignment.getAssignedAt());
        response.setPickupTime(assignment.getPickupTime());
        response.setDeliveredTime(assignment.getDeliveredTime());
        return response;
    }

    private List<VolunteerActivityResponse> buildRecentActivity(List<PickupAssignment> assignments) {
        return assignments.stream()
                .sorted(Comparator.comparing(PickupAssignment::getAssignedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .limit(6)
                .map(assignment -> {
                    VolunteerActivityResponse response = new VolunteerActivityResponse();
                    response.setActivityId(assignment.getId());
                    response.setTitle(activityTitle(assignment));
                    response.setSubtitle(activitySubtitle(assignment));
                    response.setStatus(assignment.getStatus().name());
                    response.setStatusClass(statusClass(assignment.getStatus()));
                    response.setCreatedAt(activityTimestamp(assignment));
                    return response;
                })
                .collect(Collectors.toList());
    }

    private String activityTitle(PickupAssignment assignment) {
        return switch (assignment.getStatus()) {
            case ASSIGNED -> assignment.getDonation() != null ? assignment.getDonation().getFoodName() + " ready for pickup" : "Pickup ready";
            case PICKED_UP -> assignment.getDonation() != null ? assignment.getDonation().getFoodName() + " picked up" : "Pickup started";
            case DELIVERED -> assignment.getDonation() != null ? assignment.getDonation().getFoodName() + " delivered" : "Delivery completed";
        };
    }

    private String activitySubtitle(PickupAssignment assignment) {
        if (assignment.getStatus() == PickupAssignment.AssignmentStatus.DELIVERED) {
            return "Delivered to NGO " + (assignment.getNgo() != null ? assignment.getNgo().getOrganizationName() : "");
        }
        if (assignment.getStatus() == PickupAssignment.AssignmentStatus.PICKED_UP) {
            return "On route from " + locationLabel(assignment);
        }
        return "Pickup waiting at " + locationLabel(assignment);
    }

    private String locationLabel(PickupAssignment assignment) {
        if (assignment.getDonation() == null || assignment.getDonation().getPickupAddress() == null) {
            return "address unavailable";
        }
        return assignment.getDonation().getPickupAddress().getAddressLine1();
    }

    private LocalDateTime activityTimestamp(PickupAssignment assignment) {
        if (assignment.getStatus() == PickupAssignment.AssignmentStatus.DELIVERED) {
            return assignment.getDeliveredTime();
        }
        if (assignment.getStatus() == PickupAssignment.AssignmentStatus.PICKED_UP) {
            return assignment.getPickupTime();
        }
        return assignment.getAssignedAt();
    }

    private String statusClass(PickupAssignment.AssignmentStatus status) {
        return switch (status) {
            case ASSIGNED -> "border-blue-200 bg-blue-50 text-blue-700";
            case PICKED_UP -> "border-violet-200 bg-violet-50 text-violet-700";
            case DELIVERED -> "border-emerald-200 bg-emerald-50 text-emerald-700";
        };
    }

    private String safeLastName(User user) {
        return user.getLastName() == null || user.getLastName().isBlank() ? "" : user.getLastName();
    }

    private int urgencyRank(PickupAssignment assignment) {
        if (assignment.getDonation() == null || assignment.getDonation().getExpiryTime() == null) {
            return 3;
        }
        long hours = ChronoUnit.HOURS.between(LocalDateTime.now(), assignment.getDonation().getExpiryTime());
        if (hours <= 4) {
            return 0;
        }
        if (hours <= 12) {
            return 1;
        }
        return 2;
    }

    private String urgencyLabel(LocalDateTime expiryTime) {
        if (expiryTime == null) {
            return "No expiry provided";
        }
        long hours = ChronoUnit.HOURS.between(LocalDateTime.now(), expiryTime);
        if (hours <= 0) {
            return "Expired";
        }
        if (hours <= 4) {
            return "High urgency · expires in " + hours + "h";
        }
        if (hours <= 12) {
            return "Medium urgency · expires in " + hours + "h";
        }
        return "Low urgency · expires in " + hours + "h";
    }

    private String distanceLabel(LocalDateTime expiryTime) {
        return "Route ready";
    }

    private String buildDirectionsUrl(PickupAssignment assignment) {
        if (assignment.getDonation() == null || assignment.getDonation().getPickupAddress() == null) {
            return null;
        }
        String query = assignment.getDonation().getPickupAddress().getAddressLine1();
        if (assignment.getDonation().getPickupAddress().getCity() != null) {
            query += ", " + assignment.getDonation().getPickupAddress().getCity();
        }
        return "https://www.google.com/maps/search/?api=1&query=" + query.replace(" ", "+");
    }
}