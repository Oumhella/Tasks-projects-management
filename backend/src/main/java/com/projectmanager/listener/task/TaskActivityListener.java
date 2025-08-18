package com.projectmanager.listener.task;

import com.projectmanager.entity.Activity;
import com.projectmanager.entity.Task;
import com.projectmanager.entity.User;
import com.projectmanager.service.activity.ActivityService;
import com.projectmanager.service.task.TaskService;
import com.projectmanager.service.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PostUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Component
public class TaskActivityListener {

    private static ActivityService activityService;
    private static TaskService taskService;
    private static UserService userService;
    @Autowired
    public void init(ActivityService service, TaskService taskService, UserService userService) {
        TaskActivityListener.activityService = service;
        TaskActivityListener.taskService = taskService;
        TaskActivityListener.userService = userService;

    }

    @PostUpdate
    public void onPostUpdate(Task task) {

        Activity activity = new Activity();
        activity.setAction("Task Updated");
        activity.setDetails("Task '" + task.getTitle() + "' was updated.");
        activity.setTask(task);
        activity.setCreatedAt(LocalDateTime.now());
        UUID testUserId = UUID.fromString("47f98275-1d5d-45b9-be9d-5e8f78a27b67");
        Optional<User> user = Optional.ofNullable(userService.getUserById(testUserId).orElseThrow(() -> new EntityNotFoundException("user not found")));
        if (user.isEmpty()) {
            throw new EntityNotFoundException("user not found");
        }
        activity.setUser(user.get());
        if (activityService != null) {
            activityService.createActivity(activity);
        }
    }
}