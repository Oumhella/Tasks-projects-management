package com.projectmanager.dto.response;

import com.projectmanager.model.task.TaskPriority;
import com.projectmanager.model.task.TaskStatus;
import com.projectmanager.model.task.TaskType;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public class TaskResponse {
    private UUID id;
    private String title;
    private String description;
    private TaskPriority priority;
    private TaskType type;
    private TaskStatus status;
    private Integer estimatedHours;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime dueDate;
    private UUID projectId;
    private UUID assignedToUserId;
    private UUID createdByUserId;
    private Set<CommentResponse> comments;
    private Set<AttachmentResponse> attachments;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    public TaskType getType() {
        return type;
    }

    public void setType(TaskType type) {
        this.type = type;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public Integer getEstimatedHours() {
        return estimatedHours;
    }

    public void setEstimatedHours(Integer estimatedHours) {
        this.estimatedHours = estimatedHours;
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

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public UUID getAssignedToUserId() {
        return assignedToUserId;
    }

    public void setAssignedToUserId(UUID assignedToUserId) {
        this.assignedToUserId = assignedToUserId;
    }

    public UUID getCreatedByUserId() {
        return createdByUserId;
    }

    public void setCreatedByUserId(UUID createdByUserId) {
        this.createdByUserId = createdByUserId;
    }

    public Set<CommentResponse> getComments() {
        return comments;
    }

    public void setComments(Set<CommentResponse> comments) {
        this.comments = comments;
    }

    public Set<AttachmentResponse> getAttachments() {
        return attachments;
    }

    public void setAttachments(Set<AttachmentResponse> attachments) {
        this.attachments = attachments;
    }
}
