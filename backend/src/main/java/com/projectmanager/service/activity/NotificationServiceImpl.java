package com.projectmanager.service.activity;

import com.projectmanager.entity.Activity;
import com.projectmanager.entity.User;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Set;

@Service
public class NotificationServiceImpl implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationServiceImpl.class);

    @Override
    public void sendNotification(Set<User> recipients, Activity activity) {

       log.info("notification sent");
    }
}
