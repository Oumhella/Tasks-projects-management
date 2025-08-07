package com.projectmanager.service.task;

import com.projectmanager.entity.Task;
import com.projectmanager.model.task.TaskStatus;
import com.projectmanager.repository.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @PreAuthorize("hasRole('admin_ROLE')")
    @Override
    public List<Task> getTasks(){
        return taskRepository.findAll();
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
    public List<Task> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status);
    }

//    @PreAuthorize("hasAnyRole('admin','project-manager')")
@PreAuthorize("hasAnyRole('admin','project-manager')")
@Override
    public Task addTask(Task task) {
        if(task.getId() != null) {
            throw new IllegalArgumentException("ID should be null for a new task");
        }
        task.setCreatedAt(LocalDateTime.now());
        task.setStatus(TaskStatus.TODO);
        return taskRepository.save(task);
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
