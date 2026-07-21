package com.pdfchat.pdfchatbot.util;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class PdfChunker {

    @Getter
    @AllArgsConstructor
    public static class Chunk {
        private final String text;
        private final int pageNumber;
    }

    @Getter
    @AllArgsConstructor
    public static class ExtractionResult {
        private final List<Chunk> chunks;
        private final int pageCount;
    }

    /**
     * Extracts text page by page and splits each page into overlapping chunks.
     * Page attribution is kept exact since each chunk never spans more than one page.
     */
    public static ExtractionResult extractAndChunk(byte[] pdfBytes, int chunkSize, int chunkOverlap) throws IOException {
        List<Chunk> chunks = new ArrayList<>();
        int pageCount;

        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            pageCount = document.getNumberOfPages();
            PDFTextStripper stripper = new PDFTextStripper();

            for (int page = 1; page <= pageCount; page++) {
                stripper.setStartPage(page);
                stripper.setEndPage(page);
                String pageText = stripper.getText(document);
                if (pageText == null || pageText.isBlank()) continue;

                chunks.addAll(chunkPageText(pageText.trim(), page, chunkSize, chunkOverlap));
            }
        }

        return new ExtractionResult(chunks, pageCount);
    }

    private static List<Chunk> chunkPageText(String text, int pageNumber, int chunkSize, int chunkOverlap) {
        List<Chunk> result = new ArrayList<>();
        if (text.length() <= chunkSize) {
            result.add(new Chunk(text, pageNumber));
            return result;
        }

        int step = Math.max(1, chunkSize - chunkOverlap);
        int start = 0;
        while (start < text.length()) {
            int end = Math.min(start + chunkSize, text.length());
            String piece = text.substring(start, end).trim();
            if (!piece.isEmpty()) {
                result.add(new Chunk(piece, pageNumber));
            }
            if (end == text.length()) break;
            start += step;
        }
        return result;
    }
}