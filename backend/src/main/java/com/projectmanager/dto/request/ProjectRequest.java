package com.projectmanager.dto.request;

import com.projectmanager.model.project.ProjectStatus;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public class ProjectRequest {
    private String name;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private ProjectStatus status;
    private String color;
    private String icon;
    private UUID createdByUserId;
    private Set<UUID> memberIds;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public UUID getCreatedByUserId() {
        return createdByUserId;
    }

    public void setCreatedByUserId(UUID createdByUserId) {
        this.createdByUserId = createdByUserId;
    }

    public Set<UUID> getMemberIds() {
        return memberIds;
    }

    public void setMemberIds(Set<UUID> memberIds) {
        this.memberIds = memberIds;
    }
}
