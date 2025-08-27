package com.projectmanager.service.user;

import com.projectmanager.dto.request.UserRequest;
import com.projectmanager.dto.request.UserUpdateRequest;
import com.projectmanager.dto.response.UserResponse;
import com.projectmanager.entity.Project;
import com.projectmanager.entity.User;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface UserService {
    UserResponse createUser(UserRequest request);
    List<UserResponse> getAllUsers();
    Optional<User> getUserById(UUID id);
    UserResponse updateUser(UUID id, UserUpdateRequest updateRequest);
    void deleteUser(UUID id);
    Set<UserResponse> getProjectMembers(UUID projectId);
    List<User> getUsersByIds(Set<UUID> userIds);
    Optional<User> findByKey(UUID key);

}
