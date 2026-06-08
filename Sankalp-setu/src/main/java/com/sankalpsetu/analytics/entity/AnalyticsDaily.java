package com.sankalpsetu.analytics.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "analytics_daily")
@Getter @Setter
public class AnalyticsDaily {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true)
    private LocalDate date;

    @Column(name = "total_donations")
    private Integer totalDonations;

    @Column(name = "total_meals_saved")
    private Integer totalMealsSaved;

    @Column(name = "total_deliveries")
    private Integer totalDeliveries;

    @Column(name = "total_active_ngos")
    private Integer totalActiveNgos;
}
