package com.sankalpsetu.ngo.repository;

import com.sankalpsetu.ngo.entity.Ngo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NgoRepository extends JpaRepository<Ngo, UUID> {
    Optional<Ngo> findByUserId(UUID userId);
    List<Ngo> findByVerificationStatus(Ngo.VerificationStatus status);
}
