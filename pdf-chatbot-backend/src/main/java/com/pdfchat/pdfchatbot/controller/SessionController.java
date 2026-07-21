package com.pdfchat.pdfchatbot.controller;

import com.pdfchat.pdfchatbot.dto.session.MessageResponse;
import com.pdfchat.pdfchatbot.dto.session.SessionRequest;
import com.pdfchat.pdfchatbot.dto.session.SessionResponse;
import com.pdfchat.pdfchatbot.entity.User;
import com.pdfchat.pdfchatbot.service.SessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @GetMapping
    public ResponseEntity<List<SessionResponse>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(sessionService.getAll(user));
    }

    @PostMapping
    public ResponseEntity<SessionResponse> create(
            @Valid @RequestBody SessionRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sessionService.create(request, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SessionResponse> rename(
            @PathVariable Long id,
            @Valid @RequestBody SessionRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(sessionService.rename(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        sessionService.delete(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<List<MessageResponse>> getMessages(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(sessionService.getMessages(id, user));
    }
}