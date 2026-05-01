package com.projectmanager.service.user;

import com.projectmanager.entity.User;
import com.projectmanager.repository.UserRepository;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class CurrentUserProvisioningService {
    private final UserRepository userRepository;

    public CurrentUserProvisioningService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getOrCreateCurrentUser(Principal principal) {
        UUID keycloakId = UUID.fromString(principal.getName());
        return userRepository.findByKeycloakId(keycloakId)
                .orElseGet(() -> {
                    // Check again inside to avoid race condition
                    return userRepository.findByKeycloakId(keycloakId)
                            .orElseGet(() -> createUserFromPrincipal(principal, keycloakId));
                });
    }

    private User createUserFromPrincipal(Principal principal, UUID keycloakId) {
        User user = new User();
        user.setKeycloakId(keycloakId);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        if (principal instanceof JwtAuthenticationToken jwtAuthenticationToken) {
            Jwt token = jwtAuthenticationToken.getToken();
            user.setUsername(valueOrDefault(token.getClaimAsString("preferred_username"), "user-" + keycloakId));
            user.setEmail(token.getClaimAsString("email"));
            user.setFirstName(token.getClaimAsString("given_name"));
            user.setLastName(token.getClaimAsString("family_name"));
            user.setRole(extractApplicationRole(token));
        } else {
            user.setUsername("user-" + keycloakId);
            user.setRole("observer");
        }

        return userRepository.save(user);
    }

    private String valueOrDefault(String value, String fallback) {
        return (value == null || value.isBlank()) ? fallback : value;
    }

    @SuppressWarnings("unchecked")
    private String extractApplicationRole(Jwt token) {
        Object realmAccessObj = token.getClaims().get("realm_access");
        if (realmAccessObj instanceof Map<?, ?> realmAccess) {
            Object rolesObj = realmAccess.get("roles");
            if (rolesObj instanceof List<?> rolesList) {
                for (Object roleObj : rolesList) {
                    if (!(roleObj instanceof String role)) {
                        continue;
                    }
                    if ("admin".equals(role) || "project-manager".equals(role) || "developer".equals(role) || "observer".equals(role)) {
                        return role;
                    }
                }
            }
        }
        return "observer";
    }
}
