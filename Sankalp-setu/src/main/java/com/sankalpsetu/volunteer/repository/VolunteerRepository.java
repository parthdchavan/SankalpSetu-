package com.sankalpsetu.volunteer.repository;

import com.sankalpsetu.volunteer.entity.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VolunteerRepository extends JpaRepository<Volunteer, UUID> {
    Optional<Volunteer> findByUserId(UUID userId);
    List<Volunteer> findByAvailabilityStatus(Volunteer.AvailabilityStatus status);
}
