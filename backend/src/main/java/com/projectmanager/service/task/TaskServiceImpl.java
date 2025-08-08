package com.projectmanager.service.task;

import com.projectmanager.dto.TaskRequest;
import com.projectmanager.entity.Task;
import com.projectmanager.mapper.TaskMapper;
import com.projectmanager.model.task.TaskStatus;
import com.projectmanager.repository.TaskRepository;
import com.projectmanager.service.project.ProjectService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;
    private final ProjectService projectService;

    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository, TaskMapper taskMapper, ProjectService projectService) {
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
        this.projectService = projectService;
    }

    @PreAuthorize("hasRole('admin_ROLE')")
    @Override
    public List<TaskRequest> getTasks(){
        return taskRepository.findAll().stream().map(taskMapper::toDto).collect(Collectors.toList());
    }


    @PreAuthorize("permitAll()")
    @Override
    public Optional<TaskRequest> getTaskAsDto(UUID id) {
        return taskRepository.findById(id).map(taskMapper::toDto);
    }


    @PreAuthorize("permitAll()")
    @Override
    public Optional<Task> getTask(UUID id) {
        return taskRepository.findById(id);
    }
//    @PreAuthorize("isAuthenticated()")
//    @Override
//    public List<Task> getTasksByManager(UUID id) {
//        return taskRepository.findByManager(id);
//    }

    @PreAuthorize("isAuthenticated()")
    @Override
    public List<TaskRequest> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status).stream().map(taskMapper::toDto).collect(Collectors.toList());
    }

//    @PreAuthorize("hasAnyRole('admin','project-manager')")
@PreAuthorize("hasAnyRole('admin','project-manager')")
@Override
    public Task addTask(TaskRequest request) {
    if (request == null || request.project_id == null) {
        throw new IllegalArgumentException("Invalid task request");
    }
    Task newTask = taskMapper.toEntity(request);

    newTask.setCreatedAt(LocalDateTime.now());
    newTask.setStatus(TaskStatus.TODO);
    newTask.setUpdatedAt(LocalDateTime.now());
    newTask.setProject(projectService.findProjectById(request.project_id)
            .orElseThrow(() -> new EntityNotFoundException("Project not found with ID: " + request.project_id)));

        return taskRepository.save(newTask);
    }

    @PreAuthorize("hasAnyRole('admin','project-manager')")
    @Override
    public Task updateTask(UUID id, Task updatedTask) {
        Task existingtask = taskRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Task not found"));

        existingtask.setDescription(updatedTask.getDescription());
        existingtask.setStatus(updatedTask.getStatus());

        return taskRepository.save(existingtask);

    }

    @PreAuthorize("hasAnyRole('admin','project-manager')")
    @Override
    public void deleteTask(UUID id) {
        taskRepository.deleteById(id);
    }
}
