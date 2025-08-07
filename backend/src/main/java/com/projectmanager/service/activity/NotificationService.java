package com.projectmanager.service.activity;

import com.projectmanager.entity.Activity;
import com.projectmanager.entity.User;

import java.util.Set;

public interface NotificationService {
    void sendNotification(Set<User> recipients, Activity activity);
}
