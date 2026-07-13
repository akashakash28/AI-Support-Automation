package com.akash.aisupportautomation.dto;

public class LoginResponse {

    private String token;
    private String message;
    private String email;
    private String name;
    private String role;
    private String refreshToken;

    public LoginResponse() {
    }

    public LoginResponse(String token, String message, String email, String name, String role, String refreshToken) {
        this.token = token;
        this.message = message;
        this.email = email;
        this.name = name;
        this.role = role;
        this.refreshToken = refreshToken;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
}