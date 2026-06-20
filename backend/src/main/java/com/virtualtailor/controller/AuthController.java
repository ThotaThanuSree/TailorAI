package com.virtualtailor.controller;

import com.virtualtailor.dto.ApiResponse;
import com.virtualtailor.dto.LoginRequest;
import com.virtualtailor.dto.LoginResponse;
import com.virtualtailor.dto.RegisterRequest;
import com.virtualtailor.model.User;
import com.virtualtailor.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(@RequestBody RegisterRequest request) {
        User registeredUser = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Registration successful!", registeredUser));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful!", response));
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<User>> getProfile(@PathVariable Long userId) {
        User user = authService.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.success("User profile fetched successfully!", user));
    }
}
