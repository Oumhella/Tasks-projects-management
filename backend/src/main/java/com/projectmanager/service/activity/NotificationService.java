package com.projectmanager.service.activity;

import com.projectmanager.dto.response.UserResponse;
import com.projectmanager.entity.Activity;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface NotificationService {
//    void sendNotification(Set<UserResponse> recipients, Activity activity);

    void sendNotification(Set<UserResponse> recipients, Activity activity);

    List<Activity>getNotificationsforUser(UUID userId);

}
