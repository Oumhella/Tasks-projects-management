package com.projectmanager.service.task;


import com.projectmanager.dto.request.TaskRequest;
import com.projectmanager.entity.Task;
import com.projectmanager.model.task.TaskStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskService {

    List<TaskRequest> getTasks();
    Optional<Task> getTask(UUID id);
    Optional<TaskRequest> getTaskAsDto(UUID id);
    List<TaskRequest> getTasksByStatus(TaskStatus status);
    Task addTask(TaskRequest task);
    Task updateTask(UUID id,Task task);
    void deleteTask(UUID id);
}
