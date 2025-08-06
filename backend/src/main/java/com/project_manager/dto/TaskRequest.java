package com.project_manager.dto;

import com.project_manager.model.TaskPriority;
import com.project_manager.model.TaskStatus;
import com.project_manager.model.TaskType;

import java.util.UUID;

public class TaskRequest {
    public String title;
    public String description;
    public TaskPriority priority;
    public TaskStatus status;
    public TaskType type;
    public UUID project_id;

}
