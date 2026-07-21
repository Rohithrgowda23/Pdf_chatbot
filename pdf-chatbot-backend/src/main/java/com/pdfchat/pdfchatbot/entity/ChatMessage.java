package com.pdfchat.pdfchatbot.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chat_messages")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private ChatSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageRole role;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String content;

    @Column(name = "tokens_used")
    private Integer tokensUsed;

    @Column(name = "model_used", length = 100)
    private String modelUsed;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "message", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<MessageSource> sources = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum MessageRole {
        USER, ASSISTANT, SYSTEM
    }
}