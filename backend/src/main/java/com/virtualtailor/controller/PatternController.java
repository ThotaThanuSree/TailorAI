package com.virtualtailor.controller;

import com.virtualtailor.dto.ApiResponse;
import com.virtualtailor.dto.PatternRequest;
import com.virtualtailor.dto.PatternResponse;
import com.virtualtailor.service.PatternService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/patterns")
public class PatternController {

    @Autowired
    private PatternService patternService;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<PatternResponse>> generatePattern(@RequestBody PatternRequest request) {
        PatternResponse response = patternService.generatePattern(request);
        return ResponseEntity.ok(ApiResponse.success("Pattern generated successfully!", response));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<ApiResponse<List<PatternResponse>>> getPatternHistory(@PathVariable Long userId) {
        List<PatternResponse> history = patternService.getPatternHistory(userId);
        return ResponseEntity.ok(ApiResponse.success("Pattern history retrieved successfully!", history));
    }
}
