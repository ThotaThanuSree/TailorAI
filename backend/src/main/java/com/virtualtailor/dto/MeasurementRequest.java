package com.virtualtailor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeasurementRequest {
    private Long userId;
    private Double height;
    private Double chest;
    private Double waist;
    private Double hip;
    private Double shoulder;
    private Double sleeveLength;
    private Double inseam;
    private Boolean estimatedFromPhoto;
}
