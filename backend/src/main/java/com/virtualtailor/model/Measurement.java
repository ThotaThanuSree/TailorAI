package com.virtualtailor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "measurements")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Measurement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Double height;

    @Column(nullable = false)
    private Double chest;

    @Column(nullable = false)
    private Double waist;

    @Column(nullable = false)
    private Double hip;

    @Column(nullable = false)
    private Double shoulder;

    @Column(name = "sleeve_length", nullable = false)
    private Double sleeveLength;

    @Column(nullable = false)
    private Double inseam;

    @Column(name = "estimated_from_photo")
    private Boolean estimatedFromPhoto;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.estimatedFromPhoto == null) {
            this.estimatedFromPhoto = false;
        }
    }
}
