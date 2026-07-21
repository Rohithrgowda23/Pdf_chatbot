package com.pdfchat.pdfchatbot.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class ChatResponse {
    private Long messageId;
    private String answer;
    private List<SourceDto> sources;
    private String modelUsed;
    private Integer tokensUsed;
    private LocalDateTime createdAt;
}