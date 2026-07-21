package com.pdfchat.pdfchatbot.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LoginRequest {

    /** Either email or username may be supplied; email is preferred if both are present. */
    private String email;
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    public String resolveIdentifier() {
        if (email != null && !email.isBlank()) return email.trim();
        if (username != null && !username.isBlank()) return username.trim();
        return null;
    }
}
