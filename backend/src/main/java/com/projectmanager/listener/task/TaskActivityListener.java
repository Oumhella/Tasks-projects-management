package com.projectmanager.listener.task;

import com.projectmanager.entity.Activity;
import com.projectmanager.entity.Task;
import com.projectmanager.service.activity.ActivityService;
import jakarta.persistence.PostUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class TaskActivityListener {

    private static ActivityService activityService;
    @Autowired
    public void init(ActivityService service) {
        TaskActivityListener.activityService = service;
    }

    @PostUpdate
    public void onPostUpdate(Task task) {

        Activity activity = new Activity();
        activity.setAction("Task Updated");
        activity.setDetails("Task '" + task.getTitle() + "' was updated.");
        activity.setTask(task);
        activity.setCreatedAt(LocalDateTime.now());


        if (activityService != null) {
            activityService.createActivity(activity);
        }
    }
}