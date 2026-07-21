package com.pdfchat.pdfchatbot.dto.chat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class ChatRequest {

    @NotNull(message = "sessionId is required")
    private Long sessionId;

    @NotBlank(message = "question is required")
    private String question;

    /** Optional — restrict retrieval to these document IDs. Empty/null means search all of the user's ready documents. */
    private List<Long> documentIds;
}