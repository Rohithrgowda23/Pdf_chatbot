package com.pdfchat.pdfchatbot.repository;


import com.pdfchat.pdfchatbot.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    List<ChatSession> findByUserIdOrderByUpdatedAtDesc(Long userId);
    Optional<ChatSession> findByIdAndUserId(Long id, Long userId);
    void deleteByIdAndUserId(Long id, Long userId);
    long countByUserId(Long userId);
}