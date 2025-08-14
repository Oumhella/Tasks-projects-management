package com.projectmanager.service.task;

import com.projectmanager.dto.request.TaskRequest;
import com.projectmanager.dto.response.TaskResponse;
import com.projectmanager.entity.Project;
import com.projectmanager.entity.Task;
import com.projectmanager.entity.User;
import com.projectmanager.mapper.TaskMapper;
import com.projectmanager.model.task.TaskStatus;
import com.projectmanager.repository.TaskRepository;
import com.projectmanager.service.project.ProjectService;
import com.projectmanager.service.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;
    private final UserService userService;
    private final ProjectService projectService;
    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository, TaskMapper taskMapper, ProjectService projectService, UserService userService) {
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
        this.projectService = projectService;
        this.userService = userService;
    }

//    @PreAuthorize("hasRole('admin_ROLE')")
//    @Override
//    public List<TaskResponse> getTasks(){
////        return taskRepository.findAll().stream().map(taskMapper::toResponse).collect(Collectors.toList());
//        // In your TaskServiceImpl.getTasks() method:
//        List<Task> tasks = taskRepository.findAll();
//        tasks.forEach(task -> Hibernate.initialize(task.getComments())); // Force initialization
//
//// Now, safely proceed with mapping
//        return tasks.stream()
//                .map(taskMapper::toResponse)
//                .collect(Collectors.toList());
//    }
@Override
@Transactional(readOnly = true) // Use a read-only transaction for fetching
public List<TaskResponse> getTasks() {
    List<Task> tasks = taskRepository.findAllWithComments();
    return tasks.stream()
            .map(taskMapper::toResponse)
            .collect(Collectors.toList());
}

    @PreAuthorize("permitAll()")
    @Override
    public Optional<Task> getTask(UUID id) {
       return taskRepository.findById(id);
    }

    @PreAuthorize("isAuthenticated()")
    @Override
    public List<TaskResponse> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status).stream().map(taskMapper::toResponse).collect(Collectors.toList());
    }

//    @PreAuthorize("hasAnyRole('admin','project-manager')")
@PreAuthorize("hasAnyRole('admin','project-manager')")
@Override
@Transactional
public TaskResponse addTask(TaskRequest request) {
if (request == null || request.getProjectId() == null) {
    throw new IllegalArgumentException("Invalid task request");
}
Task newTask = taskMapper.toEntity(request);

newTask.setCreatedAt(LocalDateTime.now());
newTask.setStatus(TaskStatus.TODO);
newTask.setUpdatedAt(LocalDateTime.now());
newTask.setProject(projectService.findProjectById(request.getProjectId())
        .orElseThrow(() -> new EntityNotFoundException("Project not found with ID: " + request.getProjectId())));

Task createdTask = taskRepository.save(newTask);

    return taskMapper.toResponse(createdTask);
}

@PreAuthorize("hasAnyRole('admin','project-manager')")
@Override
@Transactional
public TaskResponse updateTask(UUID id, TaskRequest request) {
    Task existingTask = taskRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Task not found with ID: " + id));


    taskMapper.updateTaskFromDto(request, existingTask);

    if (request.getAssignedToUserId() != null) {
        User assignedTo = userService.getUserById(request.getAssignedToUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + request.getAssignedToUserId()));
        existingTask.setAssignedTo(assignedTo);
    }

    if (request.getProjectId() != null) {
        Project project = projectService.findProjectById(request.getProjectId())
                .orElseThrow(() -> new EntityNotFoundException("Project not found with ID: " + request.getProjectId()));
        existingTask.setProject(project);
    }

    existingTask.setUpdatedAt(LocalDateTime.now());

    Task savedTask = taskRepository.save(existingTask);

    return taskMapper.toResponse(savedTask);
}

@PreAuthorize("hasAnyRole('admin','project-manager')")
@Override
@Transactional
public void deleteTask(UUID id) {
    taskRepository.deleteById(id);
}
}
