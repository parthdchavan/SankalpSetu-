package com.sankalpsetu.donation.repository;

import com.sankalpsetu.donation.entity.FoodCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodCategoryRepository extends JpaRepository<FoodCategory, Integer> {
}
