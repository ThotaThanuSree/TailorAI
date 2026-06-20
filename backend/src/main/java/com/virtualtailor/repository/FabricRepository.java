package com.virtualtailor.repository;

import com.virtualtailor.model.Fabric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FabricRepository extends JpaRepository<Fabric, Long> {
    List<Fabric> findByWeatherTypeIgnoreCaseAndOccasionTypeIgnoreCase(String weatherType, String occasionType);
    List<Fabric> findByWeatherTypeIgnoreCase(String weatherType);
    List<Fabric> findByOccasionTypeIgnoreCase(String occasionType);
    List<Fabric> findByFabricNameContainingIgnoreCase(String name);
}
