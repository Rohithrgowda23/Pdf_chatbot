package com.pdfchat.pdfchatbot.repository;

import com.pdfchat.pdfchatbot.entity.PdfDocument;
import com.pdfchat.pdfchatbot.entity.PdfDocument.DocumentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PdfDocumentRepository extends JpaRepository<PdfDocument, Long> {

    Page<PdfDocument> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<PdfDocument> findByUserIdAndStatus(Long userId, DocumentStatus status);

    Optional<PdfDocument> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT d FROM PdfDocument d WHERE d.user.id = :userId AND d.status = 'READY' ORDER BY d.createdAt DESC")
    List<PdfDocument> findReadyDocumentsByUserId(Long userId);

    void deleteByIdAndUserId(Long id, Long userId);

    long countByUserId(Long userId);
}