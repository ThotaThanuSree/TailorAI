package com.virtualtailor.repository;

import com.virtualtailor.model.Measurement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MeasurementRepository extends JpaRepository<Measurement, Long> {
    List<Measurement> findByUserIdOrderByIdDesc(Long userId);
    Optional<Measurement> findFirstByUserIdOrderByIdDesc(Long userId);
}
