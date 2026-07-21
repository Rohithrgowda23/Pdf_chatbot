package com.pdfchat.pdfchatbot.exception;

import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public static class BadRequestException extends ApiException {
        public BadRequestException(String message) {
            super(message, HttpStatus.BAD_REQUEST);
        }
    }

    public static class ConflictException extends ApiException {
        public ConflictException(String message) {
            super(message, HttpStatus.CONFLICT);
        }
    }

    public static class ResourceNotFoundException extends ApiException {
        public ResourceNotFoundException(String message) {
            super(message, HttpStatus.NOT_FOUND);
        }
    }

    public static class UnauthorizedException extends ApiException {
        public UnauthorizedException(String message) {
            super(message, HttpStatus.UNAUTHORIZED);
        }
    }
}
