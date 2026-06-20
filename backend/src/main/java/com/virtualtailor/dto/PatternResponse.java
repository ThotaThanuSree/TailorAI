package com.virtualtailor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatternResponse {
    private Long id;
    private String patternName;
    private String garmentType;
    private Map<String, Double> generatedPattern;
}
