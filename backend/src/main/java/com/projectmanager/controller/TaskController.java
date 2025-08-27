package com.projectmanager.controller;

import com.projectmanager.dto.request.TaskRequest;
import com.projectmanager.dto.response.TaskResponse;
import com.projectmanager.entity.Task;
import com.projectmanager.mapper.TaskMapper;
import com.projectmanager.model.task.TaskStatus;
import com.projectmanager.service.project.ProjectService;
import com.projectmanager.service.task.TaskService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    private final TaskService taskService;

    private final ProjectService projectService;
    private final TaskMapper taskMapper;

    @Autowired
    public TaskController(TaskService taskService, ProjectService projectService, TaskMapper taskMapper) {
        this.taskService = taskService;
        this.projectService = projectService;
        this.taskMapper = taskMapper;
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks() {
       List<TaskResponse> tasks = taskService.getTasks();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable UUID id) {
        Optional<Task> task = taskService.getTask(id);
        if(task.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        TaskResponse taskResponse = taskMapper.toResponse(task.get());
        return ResponseEntity.ok(taskResponse);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<TaskResponse>> getTaskByStatus(@PathVariable TaskStatus status) {
        List<TaskResponse> tasks = taskService.getTasksByStatus(status);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@RequestBody TaskRequest request, Principal principal) {
        String creator = principal.getName();
        return new ResponseEntity<>((taskService.addTask(request, creator)), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable UUID id, @RequestBody TaskRequest request) {
        TaskResponse updatedTask = taskService.updateTask(id, request);
        return ResponseEntity.ok(updatedTask);
    }

    @GetMapping("/projects/{id}")
    public ResponseEntity<List<TaskResponse>> getTasksByProject(@PathVariable UUID id) {

        List<TaskResponse> tasks = taskService.getTasksByProjectId(id);
        return ResponseEntity.ok(tasks);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<TaskResponse> deleteTask(@PathVariable UUID id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}


