package com.projectmanager.controller;

import com.projectmanager.dto.TaskRequest;
import com.projectmanager.entity.Task;
import com.projectmanager.model.task.TaskStatus;
import com.projectmanager.service.project.ProjectService;
import com.projectmanager.service.task.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    private final TaskService taskService;

    private final ProjectService projectService;

    @Autowired
    public TaskController(TaskService taskService, ProjectService projectService) {
        this.taskService = taskService;
        this.projectService = projectService;
    }

    @GetMapping
    public List<Task> getAllTasks() {
       return taskService.getTasks();
    }

    @GetMapping("/{id}")
    public Optional<Task> getTaskById(@PathVariable UUID id) {
        return taskService.getTask(id);
    }

    @GetMapping("/{status}")
    public List<Task> getTaskByStatus(@PathVariable TaskStatus status) {
        return taskService.getTasksByStatus(status);
    }

    @PostMapping
    public Task createTask(@RequestBody TaskRequest request) {
        Task newTask = new Task(request.title,request.description,request.priority,request.status,request.type,projectService.findProjectById(request.project_id).orElseThrow());

        return taskService.addTask(newTask);
    }
}
