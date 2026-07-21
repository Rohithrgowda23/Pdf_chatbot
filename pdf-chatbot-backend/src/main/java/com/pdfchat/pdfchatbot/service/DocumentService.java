package com.pdfchat.pdfchatbot.service;

import com.pdfchat.pdfchatbot.dto.document.DocumentResponse;
import com.pdfchat.pdfchatbot.entity.PdfDocument;
import com.pdfchat.pdfchatbot.entity.User;
import com.pdfchat.pdfchatbot.exception.ApiException.BadRequestException;
import com.pdfchat.pdfchatbot.exception.ApiException.ResourceNotFoundException;
import com.pdfchat.pdfchatbot.repository.PdfDocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentService {

    private final PdfDocumentRepository pdfDocumentRepository;
    private final DocumentProcessingService documentProcessingService;
    private final LocalFileStorageService fileStorageService;

    public DocumentResponse upload(MultipartFile file, User user) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("No file was uploaded");
        }
        if (!"application/pdf".equals(file.getContentType())) {
            throw new BadRequestException("Only PDF files are supported");
        }

        byte[] fileBytes;
        try {
            fileBytes = file.getBytes();
        } catch (IOException e) {
            throw new BadRequestException("Could not read the uploaded file");
        }

        String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "document.pdf";
        String relativeKey = "%d/%s_%s".formatted(user.getId(), UUID.randomUUID(), originalName);

        String storedPath = fileStorageService.store(fileBytes, relativeKey);

        PdfDocument doc = PdfDocument.builder()
                .user(user)
                .title(stripExtension(originalName))
                .originalName(originalName)
                .s3Key(storedPath)
                .s3Url(storedPath)
                .fileSize(file.getSize())
                .status(PdfDocument.DocumentStatus.UPLOADING)
                .chunkCount(0)
                .build();

        PdfDocument saved = pdfDocumentRepository.save(doc);

        documentProcessingService.processAsync(saved.getId(), fileBytes);

        return DocumentResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public Page<DocumentResponse> getAll(User user, Pageable pageable) {
        return pdfDocumentRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(DocumentResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public List<DocumentResponse> getReady(User user) {
        return pdfDocumentRepository.findReadyDocumentsByUserId(user.getId())
                .stream()
                .map(DocumentResponse::fromEntity)
                .toList();
    }

    @Transactional
    public void delete(Long id, User user) {
        PdfDocument doc = pdfDocumentRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        documentProcessingService.deleteEmbeddings(doc);
        fileStorageService.delete(doc.getS3Key());

        pdfDocumentRepository.delete(doc);
    }

    private static String stripExtension(String filename) {
        int dot = filename.lastIndexOf('.');
        return dot > 0 ? filename.substring(0, dot) : filename;
    }
}