package com.akash.aisupportautomation.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.akash.aisupportautomation.dto.LoginRequest;
import com.akash.aisupportautomation.dto.LoginResponse;
import com.akash.aisupportautomation.model.Role;
import com.akash.aisupportautomation.model.User;
import com.akash.aisupportautomation.model.RefreshToken;
import com.akash.aisupportautomation.model.VerificationToken;
import com.akash.aisupportautomation.model.PasswordResetToken;
import com.akash.aisupportautomation.repository.UserRepository;
import com.akash.aisupportautomation.repository.RefreshTokenRepository;
import com.akash.aisupportautomation.repository.VerificationTokenRepository;
import com.akash.aisupportautomation.repository.PasswordResetTokenRepository;
import com.akash.aisupportautomation.security.JwtUtil;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    // ===========================
    // Register User
    // ===========================
    @Transactional
    public String registerUser(User user) {

        Optional<User> existingUser =
                userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            return "Email already registered";
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Use the role from the request if provided, default to EMPLOYEE
        if (user.getRole() == null) {
            user.setRole(Role.EMPLOYEE);
        }
        user.setEnabled(true); // Auto-enable bypassing email verification

        User savedUser = userRepository.save(user);

        // Generate Verification Token
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(savedUser, token, Instant.now().plus(24, ChronoUnit.HOURS));
        verificationTokenRepository.save(verificationToken);

        // Send Email
        String verificationUrl = "http://localhost:5173/verify-email?token=" + token;
        emailService.sendEmail(
            savedUser.getEmail(), 
            "Verify your account", 
            "Please click the following link to verify your account:\n" + verificationUrl
        );

        return "User Registered Successfully. Please check your email to verify your account.";
    }

    // ===========================
    // Verify Email
    // ===========================
    @Transactional
    public String verifyEmail(String token) {
        Optional<VerificationToken> tokenOpt = verificationTokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            return "Invalid token";
        }
        
        VerificationToken verificationToken = tokenOpt.get();
        if (verificationToken.getExpiryDate().isBefore(Instant.now())) {
            verificationTokenRepository.delete(verificationToken);
            return "Token expired";
        }

        User user = verificationToken.getUser();
        user.setEnabled(true);
        userRepository.save(user);

        verificationTokenRepository.delete(verificationToken);
        return "Email verified successfully";
    }

    // ===========================
    // Login User
    // ===========================
    @Transactional
    public LoginResponse login(LoginRequest request) {

        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty() || !passwordEncoder.matches(request.getPassword(), optionalUser.get().getPassword())) {
            return new LoginResponse(null, "Invalid Email or Password", null, null, null, null);
        }

        User user = optionalUser.get();

        if (!user.getEnabled()) {
            return new LoginResponse(null, "Account has been disabled by admin.", null, null, null, null);
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        
        // Generate Refresh Token
        String rToken = UUID.randomUUID().toString();
        Optional<RefreshToken> existingTokenOpt = refreshTokenRepository.findByUser(user);
        if (existingTokenOpt.isPresent()) {
            RefreshToken existingToken = existingTokenOpt.get();
            existingToken.setToken(rToken);
            existingToken.setExpiryDate(Instant.now().plus(7, ChronoUnit.DAYS));
            refreshTokenRepository.save(existingToken);
        } else {
            RefreshToken refreshToken = new RefreshToken(user, rToken, Instant.now().plus(7, ChronoUnit.DAYS));
            refreshTokenRepository.save(refreshToken);
        }

        return new LoginResponse(token, "Login Successful", user.getEmail(), user.getName(), user.getRole().name(), rToken);
    }

    // ===========================
    // Refresh Token
    // ===========================
    @Transactional
    public LoginResponse refreshToken(String requestRefreshToken) {
        Optional<RefreshToken> tokenOpt = refreshTokenRepository.findByToken(requestRefreshToken);
        
        if (tokenOpt.isEmpty() || tokenOpt.get().getExpiryDate().isBefore(Instant.now())) {
            if (tokenOpt.isPresent()) {
                refreshTokenRepository.delete(tokenOpt.get());
            }
            throw new RuntimeException("Refresh token is invalid or expired");
        }

        User user = tokenOpt.get().getUser();
        String newToken = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new LoginResponse(newToken, "Token refreshed successfully", user.getEmail(), user.getName(), user.getRole().name(), requestRefreshToken);
    }

    // ===========================
    // Forgot Password
    // ===========================
    @Transactional
    public String forgotPassword(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return "If that email exists, a reset link has been sent.";
        }

        User user = userOpt.get();
        passwordResetTokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(user, token, Instant.now().plus(1, ChronoUnit.HOURS));
        passwordResetTokenRepository.save(resetToken);

        String resetUrl = "http://localhost:5173/reset-password?token=" + token;
        emailService.sendEmail(
            user.getEmail(), 
            "Password Reset Request", 
            "To reset your password, click the link below:\n" + resetUrl
        );

        return "If that email exists, a reset link has been sent.";
    }

    // ===========================
    // Reset Password
    // ===========================
    @Transactional
    public String resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository.findByToken(token);
        
        if (tokenOpt.isEmpty() || tokenOpt.get().getExpiryDate().isBefore(Instant.now())) {
            return "Invalid or expired reset token";
        }

        User user = tokenOpt.get().getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        passwordResetTokenRepository.delete(tokenOpt.get());
        return "Password reset successfully";
    }

    // ===========================
    // Find User By Email
    // ===========================
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // ===========================
    // Check Password
    // ===========================
    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    // ===========================
    // Get Support Agents
    // ===========================
    public java.util.List<User> getSupportAgents() {
        return userRepository.findByRole(Role.SUPPORT_AGENT);
    }
    
    // ===========================
    // Find Users by Role
    // ===========================
    public java.util.List<User> findByRole(Role role) {
        return userRepository.findByRole(role);
    }
}