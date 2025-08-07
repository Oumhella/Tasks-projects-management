package com.projectmanager.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class CommentRequest {

    private String content;
    private UUID taskId;
    private UUID userId;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public void setTaskId(UUID taskId) {
        this.taskId = taskId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }
}
