package com.projectmanager.service.activity;

import com.projectmanager.dto.response.UserResponse;
import com.projectmanager.entity.Activity;
import com.projectmanager.repository.ActivityRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final ActivityRepository activityRepository;

    public NotificationServiceImpl(SimpMessagingTemplate messagingTemplate, ActivityRepository activityRepository) {
        this.messagingTemplate = messagingTemplate;
        this.activityRepository = activityRepository;
    }

    @Override
    public void sendNotification(Set<UserResponse> recipients, Activity activity) {
        messagingTemplate.convertAndSend("/topic/notifications", activity);


        for (UserResponse user : recipients) {
            messagingTemplate.convertAndSendToUser(
                    user.getUsername(),
                    "/queue/notifications",
                    activity
            );
        }
    }

    @Override
    public List<Activity> getNotificationsforUser(UUID userId) {
        return activityRepository.findActivitiesForUserProjects(userId);
    }


}