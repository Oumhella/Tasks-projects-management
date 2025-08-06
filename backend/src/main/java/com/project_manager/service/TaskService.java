package com.project_manager.service;


import com.project_manager.entity.Task;
import com.project_manager.model.TaskStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskService {

    List<Task> getTasks();
    Optional<Task> getTask(UUID id);
//    List<Task> getTasksByManager(UUID id);
    List<Task> getTasksByStatus(TaskStatus status);
    Task addTask(Task task);
    Task updateTask(UUID id,Task task);
    void deleteTask(UUID id);
}
