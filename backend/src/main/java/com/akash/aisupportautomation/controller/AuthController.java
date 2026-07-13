package com.akash.aisupportautomation.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.akash.aisupportautomation.dto.LoginRequest;
import com.akash.aisupportautomation.dto.LoginResponse;
import com.akash.aisupportautomation.dto.RefreshTokenRequest;
import com.akash.aisupportautomation.dto.ForgotPasswordRequest;
import com.akash.aisupportautomation.dto.ResetPasswordRequest;
import com.akash.aisupportautomation.model.User;
import com.akash.aisupportautomation.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    // ===========================
    // Register User
    // ===========================
    @PostMapping("/register")
    public String registerUser(@Valid @RequestBody User user) {

        return userService.registerUser(user);
    }

    // ===========================
    // Login User
    // ===========================
    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request) {

        return userService.login(request);
    }

    // ===========================
    // Refresh Token
    // ===========================
    @PostMapping("/refresh")
    public LoginResponse refreshToken(@RequestBody RefreshTokenRequest request) {
        return userService.refreshToken(request.getRefreshToken());
    }

    // ===========================
    // Verify Email
    // ===========================
    @GetMapping("/verify-email")
    public String verifyEmail(@RequestParam("token") String token) {
        return userService.verifyEmail(token);
    }

    // ===========================
    // Forgot Password
    // ===========================
    @PostMapping("/forgot-password")
    public String forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return userService.forgotPassword(request.getEmail());
    }

    // ===========================
    // Reset Password
    // ===========================
    @PostMapping("/reset-password")
    public String resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return userService.resetPassword(request.getToken(), request.getNewPassword());
    }

    // ===========================
    // Get Current User
    // ===========================
    @GetMapping("/me")
    public java.util.Map<String, Object> getCurrentUser(java.security.Principal principal) {
        if (principal == null) {
            throw new RuntimeException("Not authenticated");
        }
        User user = userService.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());
        return response;
    }

    // ===========================
    // Get Support Agents
    // ===========================
    @GetMapping("/agents")
    public java.util.List<User> getSupportAgents() {
        return userService.getSupportAgents();
    }
}