package com.pdfchat.pdfchatbot.dto.document;

import com.pdfchat.pdfchatbot.entity.PdfDocument;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class DocumentResponse {
    private Long id;
    private String title;
    private String originalName;
    private String s3Url;
    private Long fileSize;
    private Integer pageCount;
    private PdfDocument.DocumentStatus status;
    private String errorMessage;
    private Integer chunkCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static DocumentResponse fromEntity(PdfDocument doc) {
        return DocumentResponse.builder()
                .id(doc.getId())
                .title(doc.getTitle())
                .originalName(doc.getOriginalName())
                .s3Url(doc.getS3Url())
                .fileSize(doc.getFileSize())
                .pageCount(doc.getPageCount())
                .status(doc.getStatus())
                .errorMessage(doc.getErrorMessage())
                .chunkCount(doc.getChunkCount())
                .createdAt(doc.getCreatedAt())
                .updatedAt(doc.getUpdatedAt())
                .build();
    }
}