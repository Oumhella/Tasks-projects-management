package com.projectmanager.controller;

import com.projectmanager.dto.request.UserRequest;
import com.projectmanager.dto.request.UserUpdateRequest;
import com.projectmanager.dto.response.UserResponse;
import com.projectmanager.entity.Activity;
import com.projectmanager.entity.User;
import com.projectmanager.mapper.UserMapper;
import com.projectmanager.repository.UserRepository;
import com.projectmanager.service.activity.ActivityService;
import com.projectmanager.service.activity.NotificationService;
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
    private final UserRepository userRepository;

    public UserController(UserService userService,
                          UserMapper userMapper, ActivityService activityService, NotificationService notificationService, UserRepository userRepository) {
        this.userService = userService;
        this.userMapper = userMapper;
        this.activityService = activityService;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
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
        UUID id = UUID.fromString(principal.getName());
        Optional<User> user = userRepository.findByKeycloakId(id);
        if(!user.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<Activity> notifications = notificationService.getNotificationsforUser(user.get().getId());
        return ResponseEntity.ok(notifications);
    }
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getUserProfile(Principal principal) {
        UUID id = UUID.fromString(principal.getName());
        Optional<User> user = userRepository.findByKeycloakId(id);
        if (user.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        UserResponse userResponse = userMapper.toResponse(user.get());
        return ResponseEntity.ok(userResponse);
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