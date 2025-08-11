package com.projectmanager.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
public class CommentResponse {

    private UUID id;
    private String content;
    private UUID taskId;
    private UUID userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<AttachmentResponse> attachments;

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

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

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

    public Set<AttachmentResponse> getAttachments() {
        return attachments;
    }

    public void setAttachments(Set<AttachmentResponse> attachments) {
        this.attachments = attachments;
    }
}
