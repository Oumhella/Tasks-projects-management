package com.projectmanager.listener.task;

import com.projectmanager.entity.Activity;
import com.projectmanager.entity.Task;
import com.projectmanager.entity.User;
import com.projectmanager.event.TaskUpdatedEvent;
import com.projectmanager.repository.TaskRepository;
import com.projectmanager.service.activity.ActivityService;
import com.projectmanager.service.task.TaskService;
import com.projectmanager.service.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PostUpdate;
import org.hibernate.event.spi.PostUpdateEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Component
public class TaskActivityListener {

 private final ApplicationEventPublisher eventPublisher;

    public TaskActivityListener(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    @PostUpdate
    public void onPostUpdate(Task task) {
    if(eventPublisher != null) {
        eventPublisher.publishEvent(new TaskUpdatedEvent(this, task));
    }
    }


}