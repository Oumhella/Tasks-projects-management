//package com.projectmanager.controller;
//
//import com.projectmanager.dto.response.UserResponse;
//import com.projectmanager.entity.Activity;
//import com.projectmanager.service.activity.NotificationService;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Controller;
//
//import java.security.Principal;
//import java.util.Set;
//
//@Controller
//public class NotificationController {
//
//    private final SimpMessagingTemplate messagingTemplate;
//    private final NotificationService notificationService;
//    public NotificationController(SimpMessagingTemplate messagingTemplate, NotificationService notificationService) {
//        this.messagingTemplate = messagingTemplate;
//        this.notificationService = notificationService;
//    }
//
//    @MessageMapping("/notify") // Client sends to /app/notify
//    public void sendNotification(Set<UserResponse> recipients, Activity activity, Principal principal) {
//        notificationService.sendNotification();
//
//    }
//}
