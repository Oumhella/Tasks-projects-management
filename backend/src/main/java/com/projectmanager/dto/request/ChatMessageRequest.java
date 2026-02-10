package com.projectmanager.dto.request;

import java.util.UUID;

public class ChatMessageRequest {
    private String message;
    private UUID sessionId;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UUID getSessionId() {
        return sessionId;
    }

    public void setSessionId(UUID sessionId) {
        this.sessionId = sessionId;
    }
}


