package com.virtualtailor.controller;

import com.virtualtailor.dto.ApiResponse;
import com.virtualtailor.dto.MeasurementRequest;
import com.virtualtailor.service.PhotoUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
public class PhotoUploadController {

    @Autowired
    private PhotoUploadService photoUploadService;

    @PostMapping("/photo")
    public ResponseEntity<ApiResponse<MeasurementRequest>> uploadPhoto(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("File is empty, please upload a valid image."));
        }

        MeasurementRequest estimation = photoUploadService.estimateMeasurementsFromPhoto(file, userId);
        return ResponseEntity.ok(ApiResponse.success("Photo uploaded and measurements estimated successfully!", estimation));
    }
}
