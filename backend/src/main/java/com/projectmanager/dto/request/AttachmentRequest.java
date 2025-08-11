package com.projectmanager.dto.request;

import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public class AttachmentRequest {
    private MultipartFile file;
    private UUID taskId;
    private UUID commentId;
    private UUID uploadedByUserId;

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public void setTaskId(UUID taskId) {
        this.taskId = taskId;
    }

    public UUID getCommentId() {
        return commentId;
    }

    public void setCommentId(UUID commentId) {
        this.commentId = commentId;
    }

    public UUID getUploadedByUserId() {
        return uploadedByUserId;
    }

    public void setUploadedByUserId(UUID uploadedByUserId) {
        this.uploadedByUserId = uploadedByUserId;
    }
}
