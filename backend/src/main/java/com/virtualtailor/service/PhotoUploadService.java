package com.virtualtailor.service;

import com.virtualtailor.dto.MeasurementRequest;
import com.virtualtailor.model.User;
import com.virtualtailor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class PhotoUploadService {

    @Autowired
    private UserRepository userRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public MeasurementRequest estimateMeasurementsFromPhoto(MultipartFile file, Long userId) {
        User user = userRepository.findById(userId)
                .orElse(null);

        // Store file path
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Could not store file: " + e.getMessage());
        }

        // Mock AI estimation based on gender
        String gender = (user != null && user.getGender() != null) ? user.getGender().toLowerCase() : "unknown";

        MeasurementRequest estimation = new MeasurementRequest();
        estimation.setUserId(userId);
        estimation.setEstimatedFromPhoto(true);

        if ("male".equals(gender)) {
            estimation.setHeight(176.0);
            estimation.setChest(40.0);
            estimation.setWaist(34.0);
            estimation.setHip(42.0);
            estimation.setShoulder(18.0);
            estimation.setSleeveLength(25.0);
            estimation.setInseam(31.0);
        } else if ("female".equals(gender)) {
            estimation.setHeight(164.0);
            estimation.setChest(34.0);
            estimation.setWaist(28.0);
            estimation.setHip(36.0);
            estimation.setShoulder(15.0);
            estimation.setSleeveLength(22.0);
            estimation.setInseam(28.0);
        } else {
            estimation.setHeight(170.0);
            estimation.setChest(37.0);
            estimation.setWaist(31.0);
            estimation.setHip(39.0);
            estimation.setShoulder(16.5);
            estimation.setSleeveLength(23.5);
            estimation.setInseam(29.5);
        }

        return estimation;
    }
}
