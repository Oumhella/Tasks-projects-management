package com.projectmanager.service.activity;

import com.projectmanager.dto.response.UserResponse;
import com.projectmanager.entity.Activity;
import com.projectmanager.entity.Project;
import com.projectmanager.entity.Task;
import com.projectmanager.entity.User;
import com.projectmanager.repository.ActivityRepository;
import com.projectmanager.service.project.ProjectService;
import com.projectmanager.service.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
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

    private final UserService userService;

    @Autowired
    public ActivityServiceImpl(ActivityRepository activityRepository, NotificationService notificationService, UserService userService) {
        this.activityRepository = activityRepository;
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @Override
    public List<Activity> getActivities() {
        return activityRepository.findAll();
    }

    @Override
    public Set<UserResponse> determineRecipients(Activity activity) {
//        Task associatedTask = activity.getTask();
//        Set<User> recipients = new HashSet<>();
//        recipients.add(associatedTask.getAssignedTo());
//        Set<UserResponse> membres;
//        Optional<Project> projectById = projectService.findProjectById();
//        if (projectById.isEmpty()) {
//          throw new EntityNotFoundException("project not found");
//        }
//        membres =  userService.getProjectMembers(associatedTask.getProject().getId());
//        recipients.addAll(membres);
//        return recipients;


        return userService.getProjectMembers(activity.getProject().getId());
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void createActivity(Activity activity) {


        activityRepository.save(activity);

//        Set<UserResponse> recipients = determineRecipients(savedActivity);

//        notificationService.sendNotification(recipients, savedActivity);
    }


}
