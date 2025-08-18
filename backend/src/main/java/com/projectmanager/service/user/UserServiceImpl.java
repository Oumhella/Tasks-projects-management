package com.projectmanager.service.user;

import com.projectmanager.dto.request.UserRequest;
import com.projectmanager.dto.request.UserUpdateRequest;
import com.projectmanager.dto.response.UserResponse;
import com.projectmanager.entity.User;
import jakarta.persistence.EntityNotFoundException;
import com.projectmanager.mapper.UserMapper;
import com.projectmanager.repository.UserRepository;
import com.projectmanager.service.keycloak.KeycloakUserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final KeycloakUserService keycloakUserService;
    private final UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository, KeycloakUserService keycloakUserService, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.keycloakUserService = keycloakUserService;
        this.userMapper = userMapper;
    }

    @Override
    public UserResponse createUser(UserRequest request) {
        UUID keycloakId = keycloakUserService.createKeycloakUser(request.getUsername(), request.getEmail(), request.getPassword(), request.getRole());

        User user = userMapper.toEntity(request);
        user.setKeycloakId(keycloakId);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return userMapper.toResponseList(users);
    }

    @Override
    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }

    @Override
    @Transactional
    public UserResponse updateUser(UUID id, UserUpdateRequest updateRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + id));

        userMapper.updateEntityFromDto(updateRequest, user);

         keycloakUserService.updateKeycloakUser(user.getKeycloakId(), updateRequest.getUsername(), updateRequest.getEmail() , updateRequest.getRole());

        user.setUpdatedAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + id));

        keycloakUserService.deleteKeycloakUser(user.getKeycloakId());

        userRepository.deleteById(id);
    }
    @Override
    public List<User> getUsersByIds(Set<UUID> userIds) {
        return userRepository.findAllById(userIds);
    }
}