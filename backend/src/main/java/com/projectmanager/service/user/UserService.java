package com.projectmanager.service.user;

import com.projectmanager.entity.User;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface UserService {
    User createUser(User user, String rawPassword);
    List<User> getAllUsers();
    Optional<User> getUserById(UUID id);
    User updateUser(UUID id, User userDetails);
    void deleteUser(UUID id);
    List<User> getUsersByIds(Set<UUID> userIds);
}
