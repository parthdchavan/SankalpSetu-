package com.sankalpsetu.ngo.service;

import com.sankalpsetu.donation.entity.Donation;
import com.sankalpsetu.donation.entity.DonationRequest;
import com.sankalpsetu.donation.entity.PickupAssignment;
import com.sankalpsetu.donation.repository.DonationRepository;
import com.sankalpsetu.donation.repository.DonationRequestRepository;
import com.sankalpsetu.donation.repository.PickupAssignmentRepository;
import com.sankalpsetu.ngo.dto.NgoActionResponse;
import com.sankalpsetu.ngo.dto.NgoDashboardResponse;
import com.sankalpsetu.ngo.dto.NgoNearbyDonationResponse;
import com.sankalpsetu.ngo.dto.NgoPickupResponse;
import com.sankalpsetu.ngo.dto.NgoRequestResponse;
import com.sankalpsetu.ngo.entity.Ngo;
import com.sankalpsetu.ngo.repository.NgoRepository;
import com.sankalpsetu.user.entity.Address;
import com.sankalpsetu.user.entity.User;
import com.sankalpsetu.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NgoService {

    private final DonationRepository donationRepository;
    private final DonationRequestRepository donationRequestRepository;
    private final PickupAssignmentRepository pickupAssignmentRepository;
    private final NgoRepository ngoRepository;
    private final UserRepository userRepository;

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Ngo currentNgo() {
        User user = currentUser();
        return ngoRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("NGO profile not found"));
    }

    private void ensureVerified(Ngo ngo) {
        if (ngo.getVerificationStatus() != Ngo.VerificationStatus.APPROVED) {
            throw new RuntimeException("NGO must be verified before accepting donations");
        }
    }

    @Transactional(readOnly = true)
    public NgoDashboardResponse getDashboard() {
        Ngo ngo = currentNgo();
        NgoDashboardResponse response = NgoDashboardResponse.from(ngo);

        List<DonationRequest> ngoRequests = donationRequestRepository.findByNgoId(ngo.getId());
        Set<UUID> actedDonationIds = ngoRequests.stream()
                .map(request -> request.getDonation().getId())
                .collect(Collectors.toSet());

        List<Donation> pendingDonations = donationRepository.findByStatus(Donation.DonationStatus.PENDING).stream()
                .filter(donation -> !actedDonationIds.contains(donation.getId()))
                .sorted(Comparator
                        .comparingDouble((Donation donation) -> distanceKm(ngo.getAddress(), donation.getPickupAddress()))
                        .thenComparing(donation -> urgencyRank(donation.getExpiryTime()))
                        .thenComparing(Donation::getExpiryTime))
                .collect(Collectors.toList());

        List<PickupAssignment> pickupAssignments = pickupAssignmentRepository.findByNgoId(ngo.getId()).stream()
                .filter(assignment -> assignment.getStatus() != PickupAssignment.AssignmentStatus.DELIVERED)
                .sorted(Comparator.comparing(PickupAssignment::getAssignedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .collect(Collectors.toList());

        response.setPendingDonationCount(pendingDonations.size());
        response.setActivePickupCount(pickupAssignments.size());
        response.setAcceptedThisMonth(ngoRequests.stream()
                .filter(request -> request.getRequestStatus() == DonationRequest.RequestStatus.ACCEPTED)
                .filter(request -> request.getCreatedAt() != null)
                .filter(request -> YearMonth.from(request.getCreatedAt()).equals(YearMonth.now()))
                .count());
        response.setRequestHistoryCount(ngoRequests.size());
        response.setNearbyDonations(pendingDonations.stream().map(donation -> toNearbyDonationResponse(ngo, donation)).collect(Collectors.toList()));
        response.setActivePickups(pickupAssignments.stream().map(this::toPickupResponse).collect(Collectors.toList()));
        response.setRequestHistory(ngoRequests.stream()
                .sorted(Comparator.comparing(DonationRequest::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .limit(10)
                .map(this::toRequestResponse)
                .collect(Collectors.toList()));

        return response;
    }

    @Transactional
    public NgoActionResponse acceptDonation(UUID donationId) {
        Ngo ngo = currentNgo();
        ensureVerified(ngo);

        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));
        if (donation.getStatus() != Donation.DonationStatus.PENDING) {
            throw new RuntimeException("Donation is no longer available");
        }

        DonationRequest request = findOrCreateRequest(ngo, donation);
        request.setRequestStatus(DonationRequest.RequestStatus.ACCEPTED);
        donationRequestRepository.save(request);

        donation.setStatus(Donation.DonationStatus.ACCEPTED);
        donationRepository.save(donation);

        PickupAssignment assignment = pickupAssignmentRepository.findByDonationId(donationId).orElseGet(PickupAssignment::new);
        assignment.setDonation(donation);
        assignment.setNgo(ngo);
        assignment.setAssignedAt(LocalDateTime.now());
        assignment.setStatus(PickupAssignment.AssignmentStatus.ASSIGNED);
        pickupAssignmentRepository.save(assignment);

        NgoActionResponse response = new NgoActionResponse();
        response.setMessage("Donation accepted");
        response.setDonationId(donationId);
        response.setRequestStatus(request.getRequestStatus().name());
        response.setPickupAssignmentId(assignment.getId());
        return response;
    }

    @Transactional
    public NgoActionResponse rejectDonation(UUID donationId) {
        Ngo ngo = currentNgo();
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        DonationRequest request = findOrCreateRequest(ngo, donation);
        request.setRequestStatus(DonationRequest.RequestStatus.REJECTED);
        donationRequestRepository.save(request);

        NgoActionResponse response = new NgoActionResponse();
        response.setMessage("Donation rejected");
        response.setDonationId(donationId);
        response.setRequestStatus(request.getRequestStatus().name());
        response.setPickupAssignmentId(Optional.ofNullable(pickupAssignmentRepository.findByDonationId(donationId).orElse(null))
                .map(PickupAssignment::getId)
                .orElse(null));
        return response;
    }

    private DonationRequest findOrCreateRequest(Ngo ngo, Donation donation) {
        return donationRequestRepository.findByDonationId(donation.getId()).stream()
                .filter(request -> request.getNgo().getId().equals(ngo.getId()))
                .findFirst()
                .orElseGet(() -> {
                    DonationRequest request = new DonationRequest();
                    request.setNgo(ngo);
                    request.setDonation(donation);
                    return request;
                });
    }

    private NgoNearbyDonationResponse toNearbyDonationResponse(Ngo ngo, Donation donation) {
        NgoNearbyDonationResponse response = new NgoNearbyDonationResponse();
        response.setDonationId(donation.getId());
        response.setFoodName(donation.getFoodName());
        response.setFoodCategory(donation.getFoodCategory() != null ? donation.getFoodCategory().getName() : null);
        response.setDescription(donation.getDescription());
        response.setQuantity(donation.getQuantity());
        response.setQuantityUnit(donation.getQuantityUnit());
        response.setServesPeople(donation.getServesPeople());
        response.setExpiryTime(donation.getExpiryTime());
        response.setStatus(donation.getStatus().name());
        response.setDonorName(donation.getDonor() != null ? donation.getDonor().getFirstName() + " " + safeLastName(donation.getDonor()) : null);
        if (donation.getDonor() != null) {
            response.setDonorEmail(donation.getDonor().getEmail());
            response.setDonorPhone(donation.getDonor().getPhone());
        }
        if (donation.getPickupAddress() != null) {
            response.setCity(donation.getPickupAddress().getCity());
            response.setAddressLine1(donation.getPickupAddress().getAddressLine1());
        }
        double distance = distanceKm(ngo.getAddress(), donation.getPickupAddress());
        response.setDistanceKm(distance);
        response.setDistanceLabel(distance >= 999 ? "Distance unavailable" : String.format(Locale.ENGLISH, "%.1f km away", distance));
        response.setUrgencyLabel(urgencyLabel(donation.getExpiryTime()));
        return response;
    }

    private NgoPickupResponse toPickupResponse(PickupAssignment assignment) {
        NgoPickupResponse response = new NgoPickupResponse();
        response.setPickupAssignmentId(assignment.getId());
        response.setDonationId(assignment.getDonation() != null ? assignment.getDonation().getId() : null);
        if (assignment.getDonation() != null) {
            response.setFoodName(assignment.getDonation().getFoodName());
            response.setFoodCategory(assignment.getDonation().getFoodCategory() != null ? assignment.getDonation().getFoodCategory().getName() : null);
            response.setQuantity(assignment.getDonation().getQuantity());
            response.setQuantityUnit(assignment.getDonation().getQuantityUnit());
            response.setDonorName(assignment.getDonation().getDonor() != null ? assignment.getDonation().getDonor().getFirstName() + " " + safeLastName(assignment.getDonation().getDonor()) : null);
            if (assignment.getDonation().getDonor() != null) {
                response.setDonorEmail(assignment.getDonation().getDonor().getEmail());
                response.setDonorPhone(assignment.getDonation().getDonor().getPhone());
            }
            if (assignment.getDonation().getPickupAddress() != null) {
                response.setCity(assignment.getDonation().getPickupAddress().getCity());
                response.setAddressLine1(assignment.getDonation().getPickupAddress().getAddressLine1());
                response.setPickupState(assignment.getDonation().getPickupAddress().getState());
            }
        }
        response.setVolunteerName(assignment.getVolunteer() != null && assignment.getVolunteer().getUser() != null
                ? assignment.getVolunteer().getUser().getFirstName() + " " + safeLastName(assignment.getVolunteer().getUser())
                : null);
        if (assignment.getVolunteer() != null && assignment.getVolunteer().getUser() != null) {
            response.setVolunteerEmail(assignment.getVolunteer().getUser().getEmail());
            response.setVolunteerPhone(assignment.getVolunteer().getUser().getPhone());
        }
        response.setStatus(assignment.getStatus().name());
        response.setAssignedAt(assignment.getAssignedAt());
        response.setPickupTime(assignment.getPickupTime());
        response.setDeliveredTime(assignment.getDeliveredTime());
        return response;
    }

    private NgoRequestResponse toRequestResponse(DonationRequest request) {
        NgoRequestResponse response = new NgoRequestResponse();
        response.setRequestId(request.getId());
        response.setDonationId(request.getDonation() != null ? request.getDonation().getId() : null);
        response.setFoodName(request.getDonation() != null ? request.getDonation().getFoodName() : null);
        response.setDonorName(request.getDonation() != null && request.getDonation().getDonor() != null
                ? request.getDonation().getDonor().getFirstName() + " " + safeLastName(request.getDonation().getDonor())
                : null);
        if (request.getDonation() != null && request.getDonation().getDonor() != null) {
            response.setDonorPhone(request.getDonation().getDonor().getPhone());
        }
        response.setRequestStatus(request.getRequestStatus().name());
        response.setCreatedAt(request.getCreatedAt());
        if (request.getDonation() != null && request.getDonation().getPickupAddress() != null) {
            response.setCity(request.getDonation().getPickupAddress().getCity());
            response.setAddressLine1(request.getDonation().getPickupAddress().getAddressLine1());
        }
        return response;
    }

    private String safeLastName(User user) {
        return user.getLastName() == null || user.getLastName().isBlank() ? "" : user.getLastName();
    }

    private double distanceKm(Address left, Address right) {
        if (left == null || right == null) {
            return 999d;
        }
        if (hasCoordinates(left) && hasCoordinates(right)) {
            return haversineKm(left.getLatitude(), left.getLongitude(), right.getLatitude(), right.getLongitude());
        }
        if (equalsIgnoreCase(left.getCity(), right.getCity()) && equalsIgnoreCase(left.getState(), right.getState())) {
            return 1.5d;
        }
        if (equalsIgnoreCase(left.getCity(), right.getCity())) {
            return 4.0d;
        }
        if (equalsIgnoreCase(left.getState(), right.getState())) {
            return 12.0d;
        }
        return 40.0d;
    }

    private boolean hasCoordinates(Address address) {
        return address.getLatitude() != null && address.getLongitude() != null;
    }

    private double haversineKm(BigDecimal lat1, BigDecimal lon1, BigDecimal lat2, BigDecimal lon2) {
        double earthRadiusKm = 6371.0d;
        double dLat = Math.toRadians(lat2.doubleValue() - lat1.doubleValue());
        double dLon = Math.toRadians(lon2.doubleValue() - lon1.doubleValue());
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1.doubleValue())) * Math.cos(Math.toRadians(lat2.doubleValue()))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return earthRadiusKm * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    }

    private int urgencyRank(LocalDateTime expiryTime) {
        if (expiryTime == null) {
            return 3;
        }
        long hours = ChronoUnit.HOURS.between(LocalDateTime.now(), expiryTime);
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

    private boolean equalsIgnoreCase(String left, String right) {
        if (left == null || right == null) {
            return false;
        }
        return left.trim().equalsIgnoreCase(right.trim());
    }
}