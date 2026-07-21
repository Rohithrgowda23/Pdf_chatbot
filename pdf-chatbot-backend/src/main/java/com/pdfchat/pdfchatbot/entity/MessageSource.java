package com.pdfchat.pdfchatbot.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "message_sources")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class MessageSource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "message_id", nullable = false)
    private ChatMessage message;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private PdfDocument document;

    @Column(name = "chunk_text", columnDefinition = "TEXT", nullable = false)
    private String chunkText;

    @Column(name = "page_number")
    private Integer pageNumber;

    @Column
    private Float score;

    @Column(name = "chunk_index")
    private Integer chunkIndex;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}