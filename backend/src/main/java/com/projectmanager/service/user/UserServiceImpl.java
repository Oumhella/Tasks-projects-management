package com.projectmanager.service.user;

import com.projectmanager.entity.User;
import com.projectmanager.repository.UserRepository;
import com.projectmanager.service.keycloak.KeycloakUserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final KeycloakUserService keycloakUserService;

    public UserServiceImpl(UserRepository userRepository, KeycloakUserService keycloakUserService) {
        this.userRepository = userRepository;
        this.keycloakUserService = keycloakUserService;
    }

    @PreAuthorize("permitAll()")
    @Override
    public User createUser(User user, String rawPassword) {

//        keycloakUserService.createKeycloakUser(user.getUsername(), user.getEmail(), rawPassword, user.getRole());

        return userRepository.save(user);
    }

    @PreAuthorize("isAuthenticated()")
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PreAuthorize("isAuthenticated()")
    @Override
    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }

    @PreAuthorize("hasAnyRole('admin','project-manager')")
    @Override
    public User updateUser(UUID id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setRole(userDetails.getRole());
        return userRepository.save(user);
    }

    @PreAuthorize("hasAnyRole('admin','project-manager')")
    @Override
    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }
}
