package com.virtualtailor.repository;

import com.virtualtailor.model.Pattern;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PatternRepository extends JpaRepository<Pattern, Long> {
    List<Pattern> findByUserIdOrderByIdDesc(Long userId);
}
