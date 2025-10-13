package com.projectmanager.service.task;


import com.projectmanager.dto.request.TaskRequest;
import com.projectmanager.dto.response.TaskResponse;
import com.projectmanager.entity.Task;
import com.projectmanager.model.task.TaskStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskService {

    List<TaskResponse> getTasks();
    Optional<Task> getTask(UUID id);
    List<TaskResponse> getTasksByStatus(TaskStatus status);
    TaskResponse addTask(TaskRequest task, String userId);
    TaskResponse updateTask(UUID id,TaskRequest request);
    void deleteTask(UUID id);
    List<TaskResponse> getTasksByProjectId(UUID projectId);
    List<Task> getTasksForUser(UUID userId);
}
