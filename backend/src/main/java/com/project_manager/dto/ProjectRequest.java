package com.project_manager.dto;

import com.project_manager.model.ProjectStatus;

import java.time.LocalDateTime;
import java.util.Date;

public class ProjectRequest {
    public String name;
    public String description;
    public LocalDateTime startDate;
    public LocalDateTime endDate;
    public ProjectStatus status;

}
