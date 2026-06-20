package com.virtualtailor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationRequest {
    private Long userId;
    private String weather;
    private String occasion;
    private String comfortLevel;
    private String garmentType; // Shirt, Kurti, Dress
}
