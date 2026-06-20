package com.virtualtailor.service;

import com.virtualtailor.dto.RecommendationRequest;
import com.virtualtailor.dto.RecommendationResponse;
import com.virtualtailor.exception.ResourceNotFoundException;
import com.virtualtailor.model.Fabric;
import com.virtualtailor.model.Measurement;
import com.virtualtailor.model.Recommendation;
import com.virtualtailor.model.User;
import com.virtualtailor.repository.FabricRepository;
import com.virtualtailor.repository.MeasurementRepository;
import com.virtualtailor.repository.RecommendationRepository;
import com.virtualtailor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class RecommendationService {

    @Autowired
    private RecommendationRepository recommendationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MeasurementRepository measurementRepository;

    @Autowired
    private FabricRepository fabricRepository;

    public RecommendationResponse generateRecommendation(RecommendationRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        // Fetch latest measurement
        Measurement measurement = measurementRepository.findFirstByUserIdOrderByIdDesc(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("No measurement records found. Please enter measurements or upload a photo first."));

        // 1. Recommended Fabric matching logic
        List<Fabric> allFabrics = fabricRepository.findAll();
        if (allFabrics.isEmpty()) {
            throw new ResourceNotFoundException("No fabrics available in the catalog. Please seed or add fabrics first.");
        }

        Fabric bestFabric = null;
        int highestScore = -1;

        for (Fabric f : allFabrics) {
            int score = 0;
            // Weather matching
            if (f.getWeatherType().equalsIgnoreCase(request.getWeather())) {
                score += 3;
            }
            // Occasion matching
            if (f.getOccasionType().equalsIgnoreCase(request.getOccasion())) {
                score += 3;
            }
            // Comfort level matching (High, Medium, Low)
            if (f.getComfortLevel().equalsIgnoreCase(request.getComfortLevel())) {
                score += 2;
            }

            if (score > highestScore) {
                highestScore = score;
                bestFabric = f;
            }
        }

        // Fallback if no score at all
        if (bestFabric == null) {
            bestFabric = allFabrics.get(0);
        }

        // 2. Recommended Size logic based on chest
        double chest = measurement.getChest();
        String size;
        if (chest < 36) {
            size = "Small";
        } else if (chest >= 36 && chest <= 40) {
            size = "Medium";
        } else if (chest >= 41 && chest <= 44) {
            size = "Large";
        } else {
            size = "XL";
        }

        // 3. Fabric Required logic
        // Shirt: height * 1.5
        // Kurti: height * 2
        // Dress: height * 2.5
        // Result in meters
        double height = measurement.getHeight();
        // Standardize height to cm if input was in meters (e.g. 1.7) or inches (e.g. 67)
        double hCm = height;
        if (hCm < 10.0) { // meters (e.g. 1.75)
            hCm = hCm * 100.0;
        } else if (hCm > 10.0 && hCm < 100.0) { // inches (e.g. 68)
            hCm = hCm * 2.54;
        }

        double multiplier = 2.0; // Default (Kurti)
        String gType = request.getGarmentType() != null ? request.getGarmentType().toLowerCase() : "kurti";
        if (gType.contains("shirt")) {
            multiplier = 1.5;
        } else if (gType.contains("kurti")) {
            multiplier = 2.0;
        } else if (gType.contains("dress")) {
            multiplier = 2.5;
        }

        double requiredMeters = (hCm * multiplier) / 100.0;
        // Round to 2 decimal places
        requiredMeters = BigDecimal.valueOf(requiredMeters)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();

        // Save recommendation in DB
        Recommendation rec = Recommendation.builder()
                .user(user)
                .fabric(bestFabric)
                .recommendedSize(size)
                .fabricRequired(requiredMeters)
                .occasion(request.getOccasion())
                .weather(request.getWeather())
                .build();

        Recommendation savedRec = recommendationRepository.save(rec);

        return RecommendationResponse.builder()
                .id(savedRec.getId())
                .fabric(bestFabric)
                .recommendedSize(size)
                .fabricRequired(requiredMeters)
                .occasion(request.getOccasion())
                .weather(request.getWeather())
                .build();
    }

    public List<Recommendation> getRecommendationHistory(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return recommendationRepository.findByUserIdOrderByIdDesc(userId);
    }
}
