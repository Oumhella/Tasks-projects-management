package com.project_manager.repository.TaskDAO;

import com.project_manager.entity.Task;
import com.project_manager.model.TaskPriority;
import com.project_manager.model.TaskStatus;
import com.project_manager.model.TaskType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByStatus(TaskStatus status);

    List<Task> findByPriority(TaskPriority priority);

    List<Task> findByPriorityAndStatus(TaskPriority priority, String status);

//    List<Task>findByManager(UUID id);

    List<Task> findByType(TaskType type);
        

}
