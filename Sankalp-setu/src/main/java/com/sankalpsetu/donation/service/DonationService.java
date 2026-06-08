package com.sankalpsetu.donation.service;

import com.sankalpsetu.donation.dto.CreateDonationRequest;
import com.sankalpsetu.donation.dto.DonationResponse;
import com.sankalpsetu.donation.dto.DonorStatsResponse;
import com.sankalpsetu.donation.entity.Donation;
import com.sankalpsetu.donation.entity.FoodCategory;
import com.sankalpsetu.donation.repository.DonationRepository;
import com.sankalpsetu.donation.repository.FoodCategoryRepository;
import com.sankalpsetu.user.entity.Address;
import com.sankalpsetu.user.entity.User;
import com.sankalpsetu.user.repository.AddressRepository;
import com.sankalpsetu.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository donationRepository;
    private final FoodCategoryRepository foodCategoryRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    public DonationResponse create(CreateDonationRequest req) {
        User donor = currentUser();

        Address address = new Address();
        address.setAddressLine1(req.getAddressLine1());
        address.setAddressLine2(req.getAddressLine2());
        address.setCity(req.getCity());
        address.setState(req.getState());
        address.setPincode(req.getPincode());
        addressRepository.save(address);

        Donation donation = new Donation();
        donation.setDonor(donor);
        donation.setFoodName(req.getFoodName());
        donation.setDescription(req.getDescription());
        donation.setQuantity(req.getQuantity());
        donation.setQuantityUnit(req.getQuantityUnit());
        donation.setServesPeople(req.getServesPeople());
        donation.setExpiryTime(req.getExpiryTime());
        donation.setPickupAddress(address);
        donation.setStatus(Donation.DonationStatus.PENDING);

        if (req.getFoodCategoryId() != null) {
            foodCategoryRepository.findById(req.getFoodCategoryId())
                    .ifPresent(donation::setFoodCategory);
        }

        return DonationResponse.from(donationRepository.save(donation));
    }

    public List<DonationResponse> myDonations() {
        return donationRepository.findByDonorId(currentUser().getId())
                .stream().map(DonationResponse::from).collect(Collectors.toList());
    }

    public DonationResponse getById(UUID id) {
        Donation d = donationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation not found"));
        return DonationResponse.from(d);
    }

    public DonorStatsResponse myStats() {
        UUID donorId = currentUser().getId();
        List<Donation> all = donationRepository.findByDonorId(donorId);

        long active = all.stream().filter(d -> List.of(
                Donation.DonationStatus.PENDING,
                Donation.DonationStatus.ACCEPTED,
                Donation.DonationStatus.VOLUNTEER_ASSIGNED,
                Donation.DonationStatus.PICKED_UP
        ).contains(d.getStatus())).count();

        long completed = all.stream().filter(d -> d.getStatus() == Donation.DonationStatus.DELIVERED).count();
        long cancelled = all.stream().filter(d -> d.getStatus() == Donation.DonationStatus.CANCELLED).count();

        int meals = all.stream()
                .filter(d -> d.getStatus() == Donation.DonationStatus.DELIVERED)
                .mapToInt(d -> d.getServesPeople() != null ? d.getServesPeople() : 0)
                .sum();

        return new DonorStatsResponse(all.size(), active, completed, cancelled, meals);
    }

    public void cancel(UUID id) {
        Donation d = donationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation not found"));
        if (d.getStatus() != Donation.DonationStatus.PENDING)
            throw new RuntimeException("Only pending donations can be cancelled");
        d.setStatus(Donation.DonationStatus.CANCELLED);
        donationRepository.save(d);
    }

    public List<com.sankalpsetu.donation.entity.FoodCategory> getAllCategories() {
        return foodCategoryRepository.findAll();
    }
}
