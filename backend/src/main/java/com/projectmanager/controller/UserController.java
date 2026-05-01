package com.projectmanager.controller;

import com.projectmanager.dto.request.UserRequest;
import com.projectmanager.dto.request.UserUpdateRequest;
import com.projectmanager.dto.response.UserResponse;
import com.projectmanager.entity.Activity;
import com.projectmanager.entity.User;
import com.projectmanager.mapper.UserMapper;
import com.projectmanager.service.activity.ActivityService;
import com.projectmanager.service.activity.NotificationService;
import com.projectmanager.service.user.CurrentUserProvisioningService;
import com.projectmanager.service.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final ActivityService activityService;
    private final NotificationService notificationService;
    private final CurrentUserProvisioningService currentUserProvisioningService;

    public UserController(UserService userService,
                          UserMapper userMapper, ActivityService activityService, NotificationService notificationService, CurrentUserProvisioningService currentUserProvisioningService) {
        this.userService = userService;
        this.userMapper = userMapper;
        this.activityService = activityService;
        this.notificationService = notificationService;
        this.currentUserProvisioningService = currentUserProvisioningService;
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody UserRequest request) {
        UserResponse user = userService.createUser(request);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        Optional<User> user = userService.getUserById(id);
        if (user.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        UserResponse userResponse = userMapper.toResponse(user.get());
        return ResponseEntity.ok(userResponse);
    }


    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable UUID id, @RequestBody UserUpdateRequest request) {
        UserResponse updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/notifications")
    public ResponseEntity<List<Activity>> getUserNotifications(Principal principal) {
        User user = currentUserProvisioningService.getOrCreateCurrentUser(principal);
        List<Activity> notifications = notificationService.getNotificationsforUser(user.getId());
        return ResponseEntity.ok(notifications);
    }
//    @GetMapping("/profile")
//    public ResponseEntity<UserResponse> getUserProfile(Principal principal) {
//        User user = currentUserProvisioningService.getOrCreateCurrentUser(principal);
//        UserResponse userResponse = userMapper.toResponse(user);
//        return ResponseEntity.ok(userResponse);
//    }
@GetMapping("/profile")
public ResponseEntity<UserResponse> getUserProfile(Principal principal) {
    try {
        System.out.println("Principal type: " + principal.getClass().getName());
        System.out.println("Principal name: " + principal.getName());
        User user = currentUserProvisioningService.getOrCreateCurrentUser(principal);
        System.out.println("User found/created: " + user.getId());
        UserResponse userResponse = userMapper.toResponse(user);
        return ResponseEntity.ok(userResponse);
    } catch (Exception e) {
        System.err.println("Error in getUserProfile: " + e.getMessage());
        e.printStackTrace();
        throw e;
    }
}
//    @GetMapping("/me")
//    public ResponseEntity<UserResponse> getUserMe(Principal principal) {
//        UUID id = UUID.fromString(principal.getName());
//        Optional<User> user = userRepository.findByKeycloakId(id);
//        if (user.isEmpty()) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//        UserResponse userResponse = userMapper.toResponse(user.get());
//        return ResponseEntity.ok(userResponse);
//    }


}