package com.pdfchat.pdfchatbot.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pdf_documents")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class PdfDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(name = "original_name", nullable = false, length = 500)
    private String originalName;

    @Column(name = "s3_key", nullable = false, length = 1000)
    private String s3Key;

    @Column(name = "s3_url", length = 2000)
    private String s3Url;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "page_count")
    private Integer pageCount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentStatus status;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "chunk_count")
    private Integer chunkCount = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MessageSource> sources = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum DocumentStatus {
        UPLOADING, PROCESSING, READY, FAILED
    }
}