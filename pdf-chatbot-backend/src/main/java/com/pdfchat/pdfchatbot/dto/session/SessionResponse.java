package com.pdfchat.pdfchatbot.dto.session;

import com.pdfchat.pdfchatbot.entity.ChatSession;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class SessionResponse {
    private Long id;
    private String title;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long messageCount;

    public static SessionResponse fromEntity(ChatSession session, long messageCount) {
        return SessionResponse.builder()
                .id(session.getId())
                .title(session.getTitle())
                .createdAt(session.getCreatedAt())
                .updatedAt(session.getUpdatedAt())
                .messageCount(messageCount)
                .build();
    }
}