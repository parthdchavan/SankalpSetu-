package com.sankalpsetu.analytics.repository;

import com.sankalpsetu.analytics.entity.AnalyticsDaily;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AnalyticsDailyRepository extends JpaRepository<AnalyticsDaily, UUID> {
    Optional<AnalyticsDaily> findByDate(LocalDate date);
}
