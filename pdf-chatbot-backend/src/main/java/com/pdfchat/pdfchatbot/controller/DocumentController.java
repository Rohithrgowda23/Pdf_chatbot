package com.pdfchat.pdfchatbot.controller;

import com.pdfchat.pdfchatbot.dto.document.DocumentResponse;
import com.pdfchat.pdfchatbot.entity.User;
import com.pdfchat.pdfchatbot.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<DocumentResponse> upload(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(documentService.upload(file, user));
    }

    @GetMapping
    public ResponseEntity<Page<DocumentResponse>> getAll(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(documentService.getAll(user, pageable));
    }

    @GetMapping("/ready")
    public ResponseEntity<List<DocumentResponse>> getReady(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(documentService.getReady(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        documentService.delete(id, user);
        return ResponseEntity.noContent().build();
    }
}