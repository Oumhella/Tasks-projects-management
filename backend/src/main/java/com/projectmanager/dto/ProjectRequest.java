package com.projectmanager.dto;

import com.projectmanager.model.project.ProjectStatus;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public class ProjectRequest {
    public String name;
    public String description;
    public LocalDateTime startDate;
    public LocalDateTime endDate;
    public ProjectStatus status;
    public String color;
    public String icon;
    // The created_by_user_id is removed from here. It will be fetched from the security context.
    public Set<UUID> members;
}