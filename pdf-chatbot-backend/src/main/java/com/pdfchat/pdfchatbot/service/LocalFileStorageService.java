package com.pdfchat.pdfchatbot.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@Service
public class LocalFileStorageService {

    @Value("${app.storage.upload-dir}")
    private String uploadDir;

    /**
     * Saves the given bytes under uploadDir/relativeKey, creating any needed
     * subdirectories, and returns the absolute path it was written to.
     */
    public String store(byte[] fileBytes, String relativeKey) {
        try {
            Path targetPath = Paths.get(uploadDir).resolve(relativeKey).normalize();
            Files.createDirectories(targetPath.getParent());
            Files.write(targetPath, fileBytes);
            log.info("Stored file locally at {}", targetPath.toAbsolutePath());
            return targetPath.toAbsolutePath().toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file locally: " + e.getMessage(), e);
        }
    }

    public void delete(String absolutePath) {
        try {
            Files.deleteIfExists(Paths.get(absolutePath));
        } catch (IOException e) {
            log.warn("Could not delete local file {}: {}", absolutePath, e.getMessage());
        }
    }
}