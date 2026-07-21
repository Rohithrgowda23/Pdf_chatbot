package com.pdfchat.pdfchatbot.controller;

import com.pdfchat.pdfchatbot.dto.chat.ChatRequest;
import com.pdfchat.pdfchatbot.dto.chat.ChatResponse;
import com.pdfchat.pdfchatbot.entity.User;
import com.pdfchat.pdfchatbot.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/message")
    public ResponseEntity<ChatResponse> sendMessage(
            @Valid @RequestBody ChatRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(chatService.sendMessage(request, user));
    }
}