package com.projectmanager.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor

public class ChatSessionResponse {
    private UUID id;
    private String sessionName;
    private UUID userId;
    private List<ChatMessageResponse> messages;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ChatSessionResponse(UUID id, String sessionName, UUID userId, List<ChatMessageResponse> messages, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.sessionName = sessionName;
        this.userId = userId;
        this.messages = messages;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getSessionName() {
        return sessionName;
    }

    public void setSessionName(String sessionName) {
        this.sessionName = sessionName;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public List<ChatMessageResponse> getMessages() {
        return messages;
    }

    public void setMessages(List<ChatMessageResponse> messages) {
        this.messages = messages;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

