package com.virtualtailor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "patterns")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Pattern {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "pattern_name", nullable = false, length = 100)
    private String patternName;

    @Column(name = "garment_type", nullable = false, length = 100)
    private String garmentType;

    @Column(name = "generated_pattern", nullable = false, columnDefinition = "TEXT")
    private String generatedPattern;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
