package com.pdfchat.pdfchatbot.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class SourceDto {
    private Long documentId;
    private String documentTitle;
    private Integer pageNumber;
    private Float score;
    private String chunkText;
    private Integer chunkIndex;
}