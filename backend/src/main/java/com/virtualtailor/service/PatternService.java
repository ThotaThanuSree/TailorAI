package com.virtualtailor.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.virtualtailor.dto.PatternRequest;
import com.virtualtailor.dto.PatternResponse;
import com.virtualtailor.exception.ResourceNotFoundException;
import com.virtualtailor.model.Measurement;
import com.virtualtailor.model.Pattern;
import com.virtualtailor.model.User;
import com.virtualtailor.repository.MeasurementRepository;
import com.virtualtailor.repository.PatternRepository;
import com.virtualtailor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PatternService {

    @Autowired
    private PatternRepository patternRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MeasurementRepository measurementRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public PatternResponse generatePattern(PatternRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Measurement measurement = measurementRepository.findFirstByUserIdOrderByIdDesc(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("No measurements found. Please enter measurements or upload a photo first."));

        // Generate JSON pattern map
        Map<String, Double> patternMap = new HashMap<>();
        patternMap.put("shoulder", measurement.getShoulder());
        patternMap.put("chest", measurement.getChest());
        patternMap.put("waist", measurement.getWaist());
        patternMap.put("hip", measurement.getHip());
        patternMap.put("sleeve", measurement.getSleeveLength());

        String generatedJson = "";
        try {
            generatedJson = objectMapper.writeValueAsString(patternMap);
        } catch (Exception e) {
            throw new RuntimeException("Error generating pattern JSON: " + e.getMessage());
        }

        Pattern pattern = Pattern.builder()
                .user(user)
                .patternName(request.getPatternName())
                .garmentType(request.getGarmentType())
                .generatedPattern(generatedJson)
                .build();

        Pattern savedPattern = patternRepository.save(pattern);

        return PatternResponse.builder()
                .id(savedPattern.getId())
                .patternName(savedPattern.getPatternName())
                .garmentType(savedPattern.getGarmentType())
                .generatedPattern(patternMap)
                .build();
    }

    public List<PatternResponse> getPatternHistory(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        List<Pattern> patterns = patternRepository.findByUserIdOrderByIdDesc(userId);
        return patterns.stream().map(p -> {
            Map<String, Double> patternMap;
            try {
                patternMap = objectMapper.readValue(p.getGeneratedPattern(), new TypeReference<Map<String, Double>>() {});
            } catch (Exception e) {
                patternMap = new HashMap<>();
            }
            return PatternResponse.builder()
                    .id(p.getId())
                    .patternName(p.getPatternName())
                    .garmentType(p.getGarmentType())
                    .generatedPattern(patternMap)
                    .build();
        }).collect(Collectors.toList());
    }
}
