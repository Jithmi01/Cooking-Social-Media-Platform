package com.example.cookingsystem.security;

public class JwtAuthResponse {
    private String token;
    private String userId;

    // Constructors
    public JwtAuthResponse() {}

    public JwtAuthResponse(String token, String userId) {
        this.token = token;
        this.userId = userId;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}