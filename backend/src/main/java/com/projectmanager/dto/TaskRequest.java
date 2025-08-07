package com.projectmanager.dto;

import com.projectmanager.model.task.TaskPriority;
import com.projectmanager.model.task.TaskStatus;
import com.projectmanager.model.task.TaskType;

import java.util.UUID;

public class TaskRequest {
    public String title;
    public String description;
    public TaskPriority priority;
    public TaskStatus status;
    public TaskType type;
    public UUID project_id;

}
