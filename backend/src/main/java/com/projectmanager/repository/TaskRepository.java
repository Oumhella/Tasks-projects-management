package com.projectmanager.repository;

import com.projectmanager.entity.Task;
import com.projectmanager.model.task.TaskPriority;
import com.projectmanager.model.task.TaskStatus;
import com.projectmanager.model.task.TaskType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByStatus(TaskStatus status);

    List<Task> findByPriority(TaskPriority priority);


    List<Task> findByType(TaskType type);
        

}
