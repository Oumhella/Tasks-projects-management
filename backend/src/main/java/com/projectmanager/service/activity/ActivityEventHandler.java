package com.projectmanager.service.activity;

import com.projectmanager.dto.response.ProjectResponse;
import com.projectmanager.dto.response.UserResponse;
import com.projectmanager.entity.Activity;
import com.projectmanager.entity.Comment;
import com.projectmanager.entity.Project;
import com.projectmanager.entity.Task;
import com.projectmanager.entity.User;
import com.projectmanager.event.CommentAddedEvent;
import com.projectmanager.event.TaskUpdatedEvent;
import com.projectmanager.repository.CommentRepository;
import com.projectmanager.repository.TaskRepository;
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
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ActivityEventHandler {

    private final ActivityService activityService;
    private final ProjectService projectService;
    private final UserService userService;
    private final TaskService taskService;
    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final NotificationService notificationService;

    public ActivityEventHandler(ActivityService activityService, CommentRepository commentRepository , ProjectService projectService, UserService userService, TaskService taskService, TaskRepository taskRepository, NotificationService notificationService) {
        this.activityService = activityService;
        this.projectService = projectService;
        this.userService = userService;
        this.taskService = taskService;
        this.commentRepository = commentRepository;
        this.taskRepository = taskRepository;
        this.notificationService = notificationService;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleCommentAddedEvent(CommentAddedEvent event) {
        Comment comment = commentRepository.findById(event.getComment().getId())
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with ID: " + event.getComment().getId()));
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
        Set<UserResponse> recipients = userService.getProjectMembers(project.get().getId());
        notificationService.sendNotification(recipients, activity);
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleTaskUpdatedEvent(TaskUpdatedEvent event) {
        Task task = taskRepository.findById(event.getTask().getId())
                .orElseThrow(()-> new EntityNotFoundException("task not found with ID: " + event.getTask().getId()));
            Activity activity = new Activity();
            activity.setAction("Task Updated");
            activity.setDetails("Task '" + task.getTitle() + "' was updated.");
            activity.setTask(task);
            activity.setCreatedAt(LocalDateTime.now());

        Optional<Project> project = projectService.findProjectById(task.getProject().getId());
        if (project.isEmpty()) {
            throw new EntityNotFoundException("Project not found");
        }
        activity.setProject(project.get());
            Optional<User> user = userService.getUserById(task.getCreatedBy().getId());
            if (user.isEmpty()) {
                throw new EntityNotFoundException("User not found with ID: " + task.getCreatedBy().getId());
            }
            activity.setUser(user.get());

            activityService.createActivity(activity);

        Set<UserResponse> recipients = userService.getProjectMembers(project.get().getId());
        notificationService.sendNotification(recipients, activity);
        }
}