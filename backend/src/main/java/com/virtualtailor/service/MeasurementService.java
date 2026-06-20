package com.virtualtailor.service;

import com.virtualtailor.dto.MeasurementRequest;
import com.virtualtailor.exception.ResourceNotFoundException;
import com.virtualtailor.model.Measurement;
import com.virtualtailor.model.User;
import com.virtualtailor.repository.MeasurementRepository;
import com.virtualtailor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MeasurementService {

    @Autowired
    private MeasurementRepository measurementRepository;

    @Autowired
    private UserRepository userRepository;

    public Measurement saveMeasurement(MeasurementRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Measurement measurement = Measurement.builder()
                .user(user)
                .height(request.getHeight())
                .chest(request.getChest())
                .waist(request.getWaist())
                .hip(request.getHip())
                .shoulder(request.getShoulder())
                .sleeveLength(request.getSleeveLength())
                .inseam(request.getInseam())
                .estimatedFromPhoto(request.getEstimatedFromPhoto() != null && request.getEstimatedFromPhoto())
                .build();

        return measurementRepository.save(measurement);
    }

    public Measurement getLatestMeasurement(Long userId) {
        return measurementRepository.findFirstByUserIdOrderByIdDesc(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No measurements found for user id: " + userId));
    }

    public List<Measurement> getMeasurementHistory(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return measurementRepository.findByUserIdOrderByIdDesc(userId);
    }
}
