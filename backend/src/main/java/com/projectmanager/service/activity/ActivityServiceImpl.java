package com.projectmanager.service.activity;

import com.projectmanager.entity.Activity;
import com.projectmanager.entity.Project;
import com.projectmanager.entity.Task;
import com.projectmanager.entity.User;
import com.projectmanager.repository.ActivityRepository;
import com.projectmanager.service.project.ProjectService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ActivityServiceImpl implements ActivityService {

    private final NotificationService notificationService;

    private final ActivityRepository activityRepository;


    private final ProjectService projectService;

    public ActivityServiceImpl(ActivityRepository activityRepository, ProjectService projectService, NotificationService notificationService) {
        this.activityRepository = activityRepository;
        this.projectService = projectService;
        this.notificationService = notificationService;
    }

    @Override
    public List<Activity> getActivities() {
        return activityRepository.findAll();
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void createActivity(Activity activity) {


        Activity savedActivity = activityRepository.save(activity);

        Set<User> recipients = determineRecipients(savedActivity);

        notificationService.sendNotification(recipients, savedActivity);
    }

    @Override
    public Set<User> determineRecipients(Activity activity) {
        Task associatedTask = activity.getTask();
        Set<User> recipients = new HashSet<>();
        recipients.add(associatedTask.getAssignedTo());
        Set<User> membres;
        Optional<Project> projectById = projectService.findProjectById(associatedTask.getProject().getId());
        if (projectById.isEmpty()) {
          throw new EntityNotFoundException("project not found");
        }
        membres =  projectById.get().getMembers();
        recipients.addAll(membres);
        return recipients;
    }
}
