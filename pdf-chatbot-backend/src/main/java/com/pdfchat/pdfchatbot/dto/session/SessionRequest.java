package com.pdfchat.pdfchatbot.dto.session;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SessionRequest {

    @NotBlank(message = "title is required")
    private String title;
}