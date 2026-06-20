package com.virtualtailor.controller;

import com.virtualtailor.dto.ApiResponse;
import com.virtualtailor.dto.RecommendationRequest;
import com.virtualtailor.dto.RecommendationResponse;
import com.virtualtailor.model.Recommendation;
import com.virtualtailor.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<RecommendationResponse>> generateRecommendation(@RequestBody RecommendationRequest request) {
        RecommendationResponse response = recommendationService.generateRecommendation(request);
        return ResponseEntity.ok(ApiResponse.success("Recommendation generated successfully!", response));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<ApiResponse<List<Recommendation>>> getRecommendationHistory(@PathVariable Long userId) {
        List<Recommendation> history = recommendationService.getRecommendationHistory(userId);
        return ResponseEntity.ok(ApiResponse.success("Recommendation history retrieved successfully!", history));
    }
}
