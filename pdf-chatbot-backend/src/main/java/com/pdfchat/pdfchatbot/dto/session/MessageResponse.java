package com.pdfchat.pdfchatbot.dto.session;

import com.pdfchat.pdfchatbot.dto.chat.SourceDto;
import com.pdfchat.pdfchatbot.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class MessageResponse {
    private Long id;
    private ChatMessage.MessageRole role;
    private String content;
    private List<SourceDto> sources;
    private String modelUsed;
    private Integer tokensUsed;
    private LocalDateTime createdAt;
}