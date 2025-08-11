package com.projectmanager.service.activity;

import com.projectmanager.dto.response.ProjectResponse;
import com.projectmanager.entity.Activity;
import com.projectmanager.entity.Comment;
import com.projectmanager.entity.Project;
import com.projectmanager.entity.Task;
import com.projectmanager.entity.User;
import com.projectmanager.event.CommentAddedEvent;
import com.projectmanager.service.project.ProjectService;
import com.projectmanager.service.task.TaskService;
import com.projectmanager.service.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ActivityEventHandler {

    private final ActivityService activityService;
    private final ProjectService projectService;
    private final UserService userService;
    private final TaskService taskService;

    public ActivityEventHandler(ActivityService activityService, ProjectService projectService, UserService userService, TaskService taskService) {
        this.activityService = activityService;
        this.projectService = projectService;
        this.userService = userService;
        this.taskService = taskService;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleCommentAddedEvent(CommentAddedEvent event) {
        Comment comment = event.getComment();

        Activity activity = new Activity();
        activity.setAction("comment added");
        activity.setDetails(comment.getUser().getUsername() + " has added a comment to " + comment.getTask().getTitle());


        Optional<Task> task = taskService.getTask(comment.getTask().getId());
        if (task.isEmpty()) {
           throw new EntityNotFoundException("Task not found");
        }
        activity.setTask(task.get());



         Optional<Project> project = projectService.findProjectById(comment.getTask().getProject().getId());
            if (project.isEmpty()) {
                throw new EntityNotFoundException("Project not found");
            }
         activity.setProject(project.get());

        Optional<User> user = userService.getUserById(comment.getUser().getId());
        if (user.isEmpty()) {
            throw new EntityNotFoundException("User not found");
        }
        activity.setUser(user.get());

        activity.setCreatedAt(LocalDateTime.now());

        activityService.createActivity(activity);
    }
}