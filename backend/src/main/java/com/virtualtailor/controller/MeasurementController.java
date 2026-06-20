package com.virtualtailor.controller;

import com.virtualtailor.dto.ApiResponse;
import com.virtualtailor.dto.MeasurementRequest;
import com.virtualtailor.model.Measurement;
import com.virtualtailor.service.MeasurementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/measurements")
public class MeasurementController {

    @Autowired
    private MeasurementService measurementService;

    @PostMapping
    public ResponseEntity<ApiResponse<Measurement>> saveMeasurement(@RequestBody MeasurementRequest request) {
        Measurement measurement = measurementService.saveMeasurement(request);
        return ResponseEntity.ok(ApiResponse.success("Measurements saved successfully!", measurement));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<Measurement>> getLatestMeasurement(@PathVariable Long userId) {
        Measurement measurement = measurementService.getLatestMeasurement(userId);
        return ResponseEntity.ok(ApiResponse.success("Latest measurements retrieved successfully!", measurement));
    }

    @GetMapping("/{userId}/history")
    public ResponseEntity<ApiResponse<List<Measurement>>> getMeasurementHistory(@PathVariable Long userId) {
        List<Measurement> history = measurementService.getMeasurementHistory(userId);
        return ResponseEntity.ok(ApiResponse.success("Measurement history retrieved successfully!", history));
    }
}
