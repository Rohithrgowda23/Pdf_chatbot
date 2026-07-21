package com.pdfchat.pdfchatbot.config;


import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter @Setter
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private Rag rag = new Rag();

    @Getter @Setter
    public static class Rag {
        private int chunkSize = 1000;
        private int chunkOverlap = 200;
        private int topK = 5;
        private float similarityThreshold = 0.7f;
    }
}