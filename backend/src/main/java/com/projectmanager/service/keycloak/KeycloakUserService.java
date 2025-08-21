package com.projectmanager.service.keycloak;

import com.projectmanager.config.KeycloakAdminConfig;
import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class KeycloakUserService {
    private final Keycloak keycloak;
//    private final String targetRealm;  // Changed from 'realm' to 'targetRealm'
    private final KeycloakAdminConfig keycloakAdminConfig;

    public KeycloakUserService(Keycloak keycloak, KeycloakAdminConfig keycloakAdminConfig) {
        this.keycloak = keycloak;
//        this.targetRealm = targetRealm;
        this.keycloakAdminConfig = keycloakAdminConfig;
    }

    public UUID createKeycloakUser(String username, String email, String password, String role) {
        UserRepresentation user = new UserRepresentation();
        user.setUsername(username);
        user.setEmail(email);
        user.setEnabled(true);
        user.setRealmRoles(Collections.singletonList(role));

        // Set credentials
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);
        credential.setTemporary(false);
        user.setCredentials(Collections.singletonList(credential));


        Response resp = keycloak.realm(keycloakAdminConfig.keycloakTargetRealm())
                .users()
                .create(user);
        try (resp) {
            int status = resp.getStatus();
            if (status == Response.Status.CREATED.getStatusCode()) {
                String id = resp.getLocation().getPath();
                String userId = id.substring(id.lastIndexOf('/') + 1);

                // 3) Map realm role (optional)
                if (role != null && !role.isBlank()) {
                    var roles = keycloak.realm(keycloakAdminConfig.keycloakTargetRealm()).roles();
                    var roleRep = roles.get(role).toRepresentation(); // throws 404 if role doesn't exist
                    keycloak.realm(keycloakAdminConfig.keycloakTargetRealm())
                            .users()
                            .get(userId)
                            .roles()
                            .realmLevel()
                            .add(Collections.singletonList(roleRep));
                }

                return UUID.fromString(userId);
            }
            if (status == Response.Status.CONFLICT.getStatusCode()) {
                throw new IllegalStateException("User already exists: " + username);
            }
            throw new IllegalStateException("Failed to create user, HTTP " + status);
        }
    }

    public void updateKeycloakUser(UUID keycloakId, String newUsername, String newEmail, String newRole) {
        UserResource userResource = keycloak.realm(keycloakAdminConfig.keycloakTargetRealm()).users().get(keycloakId.toString());
        UserRepresentation user = userResource.toRepresentation();

        user.setUsername(newUsername);
        user.setEmail(newEmail);
        user.setRealmRoles(Collections.singletonList(newRole));

        userResource.update(user);
    }


    public void deleteKeycloakUser(UUID keycloakId) {
        keycloak.realm(keycloakAdminConfig.keycloakTargetRealm()).users().delete(keycloakId.toString());
    }
}