package com.pdfchat.pdfchatbot.service;

import com.pdfchat.pdfchatbot.config.AppProperties;
import com.pdfchat.pdfchatbot.entity.PdfDocument;
import com.pdfchat.pdfchatbot.repository.PdfDocumentRepository;
import com.pdfchat.pdfchatbot.util.PdfChunker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentProcessingService {

    private final PdfDocumentRepository pdfDocumentRepository;
    private final VectorStore vectorStore;
    private final AppProperties appProperties;

    @Async
    public void processAsync(Long documentId, byte[] fileBytes) {
        PdfDocument doc = pdfDocumentRepository.findById(documentId).orElse(null);
        if (doc == null) {
            log.warn("Document {} disappeared before processing could start", documentId);
            return;
        }

        try {
            markStatus(doc, PdfDocument.DocumentStatus.PROCESSING, null);

            PdfChunker.ExtractionResult extraction = PdfChunker.extractAndChunk(
                    fileBytes,
                    appProperties.getRag().getChunkSize(),
                    appProperties.getRag().getChunkOverlap()
            );

            if (extraction.getChunks().isEmpty()) {
                markStatus(doc, PdfDocument.DocumentStatus.FAILED, "No extractable text found in this PDF (it may be scanned/image-only).");
                return;
            }

            List<Document> aiDocuments = new ArrayList<>();
            for (int i = 0; i < extraction.getChunks().size(); i++) {
                PdfChunker.Chunk chunk = extraction.getChunks().get(i);
                Map<String, Object> metadata = new HashMap<>();
                metadata.put("documentId", doc.getId().intValue());
                metadata.put("userId", doc.getUser().getId().intValue());
                metadata.put("documentTitle", doc.getTitle());
                metadata.put("pageNumber", chunk.getPageNumber());
                metadata.put("chunkIndex", i);

                aiDocuments.add(new Document(chunkId(doc.getId(), i), chunk.getText(), metadata));
            }

            vectorStore.add(aiDocuments);

            doc.setPageCount(extraction.getPageCount());
            doc.setChunkCount(aiDocuments.size());
            doc.setStatus(PdfDocument.DocumentStatus.READY);
            doc.setErrorMessage(null);
            pdfDocumentRepository.save(doc);

            log.info("Document {} processed: {} chunks across {} pages", doc.getId(), aiDocuments.size(), extraction.getPageCount());
        } catch (Exception ex) {
            log.error("Failed to process document {}: {}", documentId, ex.getMessage(), ex);
            markStatus(doc, PdfDocument.DocumentStatus.FAILED, "Processing failed: " + ex.getMessage());
        }
    }

    @Transactional
    public void deleteEmbeddings(PdfDocument doc) {
        if (doc.getChunkCount() == null || doc.getChunkCount() == 0) return;
        List<String> ids = new ArrayList<>();
        for (int i = 0; i < doc.getChunkCount(); i++) {
            ids.add(chunkId(doc.getId(), i));
        }
        try {
            vectorStore.delete(ids);
        } catch (Exception ex) {
            log.warn("Could not delete embeddings for document {}: {}", doc.getId(), ex.getMessage());
        }
    }

    private void markStatus(PdfDocument doc, PdfDocument.DocumentStatus status, String errorMessage) {
        doc.setStatus(status);
        doc.setErrorMessage(errorMessage);
        pdfDocumentRepository.save(doc);
    }

    private static String chunkId(Long documentId, int chunkIndex) {
        String key = "doc-" + documentId + "-chunk-" + chunkIndex;
        return java.util.UUID.nameUUIDFromBytes(key.getBytes(java.nio.charset.StandardCharsets.UTF_8)).toString();

    }
}