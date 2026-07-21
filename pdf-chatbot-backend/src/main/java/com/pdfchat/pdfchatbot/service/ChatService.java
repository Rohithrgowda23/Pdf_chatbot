package com.pdfchat.pdfchatbot.service;

import com.pdfchat.pdfchatbot.config.AppProperties;
import com.pdfchat.pdfchatbot.dto.chat.ChatRequest;
import com.pdfchat.pdfchatbot.dto.chat.ChatResponse;
import com.pdfchat.pdfchatbot.dto.chat.SourceDto;
import com.pdfchat.pdfchatbot.entity.ChatMessage;
import com.pdfchat.pdfchatbot.entity.ChatSession;
import com.pdfchat.pdfchatbot.entity.MessageSource;
import com.pdfchat.pdfchatbot.entity.PdfDocument;
import com.pdfchat.pdfchatbot.entity.User;
import com.pdfchat.pdfchatbot.exception.ApiException.ResourceNotFoundException;
import com.pdfchat.pdfchatbot.repository.ChatMessageRepository;
import com.pdfchat.pdfchatbot.repository.ChatSessionRepository;
import com.pdfchat.pdfchatbot.repository.PdfDocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final PdfDocumentRepository pdfDocumentRepository;
    private final VectorStore vectorStore;
    private final ChatModel chatModel;
    private final AppProperties appProperties;

    @Value("${spring.ai.ollama.chat.options.model:llama3.2}")
    private String modelName;

    private static final String SYSTEM_TEMPLATE = """
            You are a helpful assistant that answers questions using ONLY the context excerpts below,
            which were retrieved from the user's uploaded documents. If the context does not contain
            the answer, say you don't have enough information in the documents rather than guessing.
            Always be concise and cite which document/page the information came from when relevant.

            Context:
            %s
            """;

    @Transactional
    public ChatResponse sendMessage(ChatRequest request, User user) {
        ChatSession session = chatSessionRepository.findByIdAndUserId(request.getSessionId(), user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Chat session not found"));

        // 1. Retrieve relevant chunks
        String filterExpression = buildFilterExpression(user.getId(), request.getDocumentIds());
        SearchRequest searchRequest = SearchRequest.query(request.getQuestion())
                .withTopK(appProperties.getRag().getTopK())
                .withSimilarityThreshold(appProperties.getRag().getSimilarityThreshold())
                .withFilterExpression(filterExpression);

        List<Document> retrieved;
        try {
            retrieved = vectorStore.similaritySearch(searchRequest);
        } catch (Exception ex) {
            log.error("Vector search failed: {}", ex.getMessage(), ex);
            retrieved = List.of();
        }
        retrieved.forEach(d -> log.info("RETRIEVED DOC metadata: {}", d.getMetadata()));

        // 2. Build context + save user message
        String context = buildContext(retrieved);

        ChatMessage userMessage = ChatMessage.builder()
                .session(session)
                .user(user)
                .role(ChatMessage.MessageRole.USER)
                .content(request.getQuestion())
                .build();
        chatMessageRepository.save(userMessage);

        // 3. Call the model
        Prompt prompt = new Prompt(List.of(
                new SystemMessage(SYSTEM_TEMPLATE.formatted(context.isBlank() ? "(no relevant context found)" : context)),
                new UserMessage(request.getQuestion())
        ));

        org.springframework.ai.chat.model.ChatResponse aiResponse = chatModel.call(prompt);
        String answer = aiResponse.getResult().getOutput().getContent();

        Integer tokensUsed = null;
        if (aiResponse.getMetadata() != null && aiResponse.getMetadata().getUsage() != null) {
            Long totalTokens = aiResponse.getMetadata().getUsage().getTotalTokens();
            tokensUsed = totalTokens != null ? totalTokens.intValue() : null;
        }

        // 4. Save assistant message + sources
        ChatMessage assistantMessage = ChatMessage.builder()
                .session(session)
                .user(user)
                .role(ChatMessage.MessageRole.ASSISTANT)
                .content(answer)
                .tokensUsed(tokensUsed)
                .modelUsed(modelName)
                .sources(new ArrayList<>())
                .build();
        chatMessageRepository.save(assistantMessage);

        List<SourceDto> sourceList = new ArrayList<>();
        for (Document d : retrieved) {
            Map<String, Object> meta = d.getMetadata();
            Long documentId = toLong(meta.get("documentId"));
            PdfDocument pdfDocument = documentId != null ? pdfDocumentRepository.findById(documentId).orElse(null) : null;
            if (pdfDocument == null) continue;

            Integer pageNumber = toInt(meta.get("pageNumber"));
            Integer chunkIndex = toInt(meta.get("chunkIndex"));
            Float score = extractScore(d);

            MessageSource source = MessageSource.builder()
                    .message(assistantMessage)
                    .document(pdfDocument)
                    .chunkText(d.getContent())
                    .pageNumber(pageNumber)
                    .chunkIndex(chunkIndex)
                    .score(score)
                    .build();
            assistantMessage.getSources().add(source);

            sourceList.add(SourceDto.builder()
                    .documentId(pdfDocument.getId())
                    .documentTitle(pdfDocument.getTitle())
                    .pageNumber(pageNumber)
                    .chunkIndex(chunkIndex)
                    .score(score)
                    .chunkText(d.getContent())
                    .build());
        }
        chatMessageRepository.save(assistantMessage);

        session.setUpdatedAt(LocalDateTime.now());
        chatSessionRepository.save(session);

        return ChatResponse.builder()
                .messageId(assistantMessage.getId())
                .answer(answer)
                .sources(sourceList)
                .modelUsed(modelName)
                .tokensUsed(tokensUsed)
                .createdAt(assistantMessage.getCreatedAt())
                .build();
    }

    private String buildContext(List<Document> documents) {
        return documents.stream()
                .map(d -> "[%s, p.%s] %s".formatted(
                        d.getMetadata().getOrDefault("documentTitle", "document"),
                        d.getMetadata().getOrDefault("pageNumber", "?"),
                        d.getContent()))
                .collect(Collectors.joining("\n\n"));
    }

    private String buildFilterExpression(Long userId, List<Long> documentIds) {
        StringBuilder expr = new StringBuilder("userId == ").append(userId);
        if (documentIds != null && !documentIds.isEmpty()) {
            String ids = documentIds.stream().map(String::valueOf).collect(Collectors.joining(", "));
            expr.append(" && documentId in [").append(ids).append("]");
        }
        return expr.toString();
    }

    /**
     * M1's Document class has no getScore(); the similarity value (if the store populates it
     * at all) is carried in metadata instead. Different vector-store implementations use
     * different keys, so we try the common ones and fall back to null (SourcesPanel.jsx
     * already renders a 0% bar gracefully when score is missing).
     */
    private static Float extractScore(Document d) {
        Object raw = d.getMetadata().get("distance");
        if (raw instanceof Number n) {
            // Qdrant returns cosine distance (0 = identical, 2 = opposite).
            // Convert to a similarity score (1 = identical, 0 = unrelated) so
            // higher numbers in the UI genuinely mean "better match".
            float similarity = 1f - n.floatValue();
            return Math.max(0f, Math.min(1f, similarity));
        }
        Object score = d.getMetadata().get("score");
        if (score instanceof Number n) return n.floatValue();
        return null;
    }


    private static Long toLong(Object value) {
        if (value == null) return null;
        if (value instanceof Number n) return n.longValue();
        try {
            return Long.parseLong(value.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private static Integer toInt(Object value) {
        if (value == null) return null;
        if (value instanceof Number n) return n.intValue();
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }
}