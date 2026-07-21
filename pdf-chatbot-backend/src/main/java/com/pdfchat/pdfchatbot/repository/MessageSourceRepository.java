package com.pdfchat.pdfchatbot.repository;

import com.pdfchat.pdfchatbot.entity.MessageSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageSourceRepository extends JpaRepository<MessageSource, Long> {
}