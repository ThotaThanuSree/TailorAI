package com.virtualtailor.dto;

import com.virtualtailor.model.Fabric;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponse {
    private Long id;
    private Fabric fabric;
    private String recommendedSize;
    private Double fabricRequired;
    private String occasion;
    private String weather;
}
