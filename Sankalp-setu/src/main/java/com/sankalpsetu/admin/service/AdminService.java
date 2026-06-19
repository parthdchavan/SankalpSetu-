package com.sankalpsetu.admin.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sankalpsetu.admin.dto.AdminActionResponse;
import com.sankalpsetu.admin.dto.AdminDashboardResponse;
import com.sankalpsetu.admin.dto.PendingNgoResponse;
import com.sankalpsetu.admin.dto.RecentDonationResponse;
import com.sankalpsetu.analytics.repository.AnalyticsDailyRepository;
import com.sankalpsetu.donation.entity.Donation;
import com.sankalpsetu.donation.repository.DonationRepository;
import com.sankalpsetu.ngo.entity.Ngo;
import com.sankalpsetu.ngo.repository.NgoRepository;
import com.sankalpsetu.user.entity.User;
import com.sankalpsetu.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final NgoRepository ngoRepository;
    private final DonationRepository donationRepository;
    private final AnalyticsDailyRepository analyticsDailyRepository;

    private User currentAdmin() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Admin access required");
        }
        return user;
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {
        currentAdmin();
        List<Donation> donations = donationRepository.findAll();
        List<Ngo> pendingNgos = ngoRepository.findByVerificationStatus(Ngo.VerificationStatus.PENDING);
        YearMonth currentMonth = YearMonth.now();

        AdminDashboardResponse response = new AdminDashboardResponse();
        response.setTotalUsers(userRepository.count());
        response.setDonorCount(userRepository.countByRole(User.Role.DONOR));
        response.setNgoCount(userRepository.countByRole(User.Role.NGO));
        response.setVolunteerCount(userRepository.countByRole(User.Role.VOLUNTEER));
        response.setVerifiedNgoCount(ngoRepository.findByVerificationStatus(Ngo.VerificationStatus.APPROVED).size());
        response.setPendingNgoCount(pendingNgos.size());
        response.setActiveDonationCount(donations.stream()
                .filter(donation -> List.of(
                        Donation.DonationStatus.PENDING,
                        Donation.DonationStatus.ACCEPTED,
                        Donation.DonationStatus.VOLUNTEER_ASSIGNED,
                        Donation.DonationStatus.PICKED_UP
                ).contains(donation.getStatus()))
                .count());
        response.setDeliveredDonationCount(donations.stream()
                .filter(donation -> donation.getStatus() == Donation.DonationStatus.DELIVERED)
                .count());
        response.setMealsThisMonth(mealsThisMonth(donations, currentMonth));
        response.setPendingNgos(pendingNgos.stream()
                .sorted(Comparator.comparing(Ngo::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())))
                .map(this::toPendingNgoResponse)
                .collect(Collectors.toList()));
        response.setRecentDonations(donations.stream()
                .sorted(Comparator.comparing(Donation::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .limit(8)
                .map(this::toRecentDonationResponse)
                .collect(Collectors.toList()));
        return response;
    }

    @Transactional
    public AdminActionResponse updateNgoVerification(UUID ngoId, boolean approved) {
        User admin = currentAdmin();
        Ngo ngo = ngoRepository.findById(ngoId).orElseThrow(() -> new RuntimeException("NGO not found"));
        ngo.setVerificationStatus(approved ? Ngo.VerificationStatus.APPROVED : Ngo.VerificationStatus.REJECTED);
        ngo.setVerifiedBy(admin);
        ngo.setVerifiedAt(LocalDateTime.now());
        ngoRepository.save(ngo);

        AdminActionResponse response = new AdminActionResponse();
        response.setMessage(approved ? "NGO approved" : "NGO rejected");
        response.setNgoId(ngo.getId());
        response.setVerificationStatus(ngo.getVerificationStatus().name());
        return response;
    }

    private long mealsThisMonth(List<Donation> donations, YearMonth currentMonth) {
        long fromDonations = donations.stream()
                .filter(donation -> donation.getStatus() == Donation.DonationStatus.DELIVERED)
                .filter(donation -> donation.getUpdatedAt() != null)
                .filter(donation -> YearMonth.from(donation.getUpdatedAt()).equals(currentMonth))
                .mapToLong(donation -> donation.getServesPeople() == null ? 0 : donation.getServesPeople())
                .sum();
        long fromAnalytics = analyticsDailyRepository.findByDate(LocalDate.now())
                .map(row -> row.getTotalMealsSaved() == null ? 0L : row.getTotalMealsSaved().longValue())
                .orElse(0L);
        return Math.max(fromDonations, fromAnalytics);
    }

    private PendingNgoResponse toPendingNgoResponse(Ngo ngo) {
        PendingNgoResponse response = new PendingNgoResponse();
        response.setId(ngo.getId());
        response.setOrganizationName(ngo.getOrganizationName());
        response.setRegistrationNumber(ngo.getRegistrationNumber());
        response.setVerificationStatus(ngo.getVerificationStatus().name());
        response.setSubmittedAt(ngo.getCreatedAt());
        if (ngo.getUser() != null) {
            response.setContactName((ngo.getUser().getFirstName() + " " + safeLastName(ngo.getUser())).trim());
            response.setEmail(ngo.getUser().getEmail());
            response.setPhone(ngo.getUser().getPhone());
        }
        if (ngo.getAddress() != null) {
            response.setCity(ngo.getAddress().getCity());
            response.setState(ngo.getAddress().getState());
        }
        return response;
    }

    private RecentDonationResponse toRecentDonationResponse(Donation donation) {
        RecentDonationResponse response = new RecentDonationResponse();
        response.setId(donation.getId());
        response.setFoodName(donation.getFoodName());
        response.setStatus(donation.getStatus().name());
        response.setServesPeople(donation.getServesPeople());
        response.setCreatedAt(donation.getCreatedAt());
        if (donation.getDonor() != null) {
            response.setDonorName((donation.getDonor().getFirstName() + " " + safeLastName(donation.getDonor())).trim());
        }
        if (donation.getPickupAddress() != null) {
            response.setCity(donation.getPickupAddress().getCity());
        }
        return response;
    }

    private String safeLastName(User user) {
        return user.getLastName() == null || user.getLastName().isBlank() ? "" : user.getLastName();
    }
}
