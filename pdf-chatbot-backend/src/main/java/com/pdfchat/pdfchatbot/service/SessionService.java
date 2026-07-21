package com.pdfchat.pdfchatbot.service;

import com.pdfchat.pdfchatbot.dto.chat.SourceDto;
import com.pdfchat.pdfchatbot.dto.session.MessageResponse;
import com.pdfchat.pdfchatbot.dto.session.SessionRequest;
import com.pdfchat.pdfchatbot.dto.session.SessionResponse;
import com.pdfchat.pdfchatbot.entity.ChatSession;
import com.pdfchat.pdfchatbot.entity.User;
import com.pdfchat.pdfchatbot.exception.ApiException.ResourceNotFoundException;
import com.pdfchat.pdfchatbot.repository.ChatMessageRepository;
import com.pdfchat.pdfchatbot.repository.ChatSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;

    @Transactional
    public SessionResponse create(SessionRequest request, User user) {
        ChatSession session = ChatSession.builder()
                .user(user)
                .title(request.getTitle())
                .isActive(true)
                .build();
        ChatSession saved = chatSessionRepository.save(session);
        return SessionResponse.fromEntity(saved, 0);
    }

    @Transactional(readOnly = true)
    public List<SessionResponse> getAll(User user) {
        return chatSessionRepository.findByUserIdOrderByUpdatedAtDesc(user.getId())
                .stream()
                .map(s -> SessionResponse.fromEntity(s, chatMessageRepository.countBySessionId(s.getId())))
                .toList();
    }

    @Transactional
    public SessionResponse rename(Long id, SessionRequest request, User user) {
        ChatSession session = chatSessionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Chat session not found"));
        session.setTitle(request.getTitle());
        ChatSession saved = chatSessionRepository.save(session);
        return SessionResponse.fromEntity(saved, chatMessageRepository.countBySessionId(saved.getId()));
    }

    @Transactional
    public void delete(Long id, User user) {
        chatSessionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Chat session not found"));
        chatSessionRepository.deleteByIdAndUserId(id, user.getId());
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> getMessages(Long sessionId, User user) {
        chatSessionRepository.findByIdAndUserId(sessionId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Chat session not found"));

        return chatMessageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId)
                .stream()
                .map(m -> MessageResponse.builder()
                        .id(m.getId())
                        .role(m.getRole())
                        .content(m.getContent())
                        .modelUsed(m.getModelUsed())
                        .tokensUsed(m.getTokensUsed())
                        .createdAt(m.getCreatedAt())
                        .sources(m.getSources().stream()
                                .map(src -> SourceDto.builder()
                                        .documentId(src.getDocument().getId())
                                        .documentTitle(src.getDocument().getTitle())
                                        .pageNumber(src.getPageNumber())
                                        .chunkIndex(src.getChunkIndex())
                                        .score(src.getScore())
                                        .chunkText(src.getChunkText())
                                        .build())
                                .toList())
                        .build())
                .toList();
    }
}