package com.pdfchat.pdfchatbot.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tokenType;
    private UserResponse user;

    public static AuthResponse of(String token, UserResponse user) {
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(user)
                .build();
    }
}
