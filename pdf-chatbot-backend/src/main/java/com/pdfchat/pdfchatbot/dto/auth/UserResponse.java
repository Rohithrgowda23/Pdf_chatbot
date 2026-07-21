package com.pdfchat.pdfchatbot.dto.auth;

import com.pdfchat.pdfchatbot.entity.Role;
import com.pdfchat.pdfchatbot.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String username;
    private String fullName;
    private Role role;
    private LocalDateTime createdAt;

    public static UserResponse fromEntity(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
