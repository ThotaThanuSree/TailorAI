package com.virtualtailor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fabrics")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Fabric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fabric_name", nullable = false, length = 100)
    private String fabricName;

    @Column(name = "weather_type", nullable = false, length = 50)
    private String weatherType;

    @Column(name = "occasion_type", nullable = false, length = 50)
    private String occasionType;

    @Column(name = "comfort_level", nullable = false, length = 50)
    private String comfortLevel;

    @Column(columnDefinition = "TEXT")
    private String description;
}
