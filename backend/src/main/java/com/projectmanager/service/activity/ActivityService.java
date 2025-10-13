package com.projectmanager.service.activity;

import com.projectmanager.dto.response.UserResponse;
import com.projectmanager.entity.Activity;
import com.projectmanager.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

public interface ActivityService {
    List<Activity> getActivities();
    void createActivity(Activity activity);
    Set<UserResponse> determineRecipients(Activity activity);

}
