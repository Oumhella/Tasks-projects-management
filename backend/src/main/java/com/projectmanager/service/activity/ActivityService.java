package com.projectmanager.service.activity;

import com.projectmanager.entity.Activity;
import com.projectmanager.entity.User;

import java.util.List;
import java.util.Set;

public interface ActivityService {
    List<Activity> getActivities();
    void createActivity(Activity activity);
    Set<User> determineRecipients(Activity activity);
}
